"use server"

import { getLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/db";
import { verifySession } from "../permissions";
import { getUserName } from "../users/get";

export async function getProjects(page: number = 1, pageSize: number = 10, searchQuery?: string): Promise<{ status: number, data: any }> {
    const e = await getTranslations('Error');
    try {
        const skip = (page - 1) * pageSize;

        const projects = await prisma.project.findMany({
            skip: skip,
            take: pageSize,
            where: searchQuery ? {
                slug: {
                    contains: searchQuery
                }
            } : {},
            include: {
                categories: true,
                titles: {
                    select: {
                        title: true,
                        language: true
                    },
                    where: searchQuery ? {
                        title: {
                            contains: searchQuery
                        }
                    } : {},
                },
                description: {
                    select: {
                        description: true,
                        language: true
                    }
                },
                contents: {
                    select: {
                        data: true,
                        language: true
                    },
                    orderBy: {
                        order: "asc"
                    }
                }
            }
        });


        return { status: 200, data: projects };
    } catch (error) {
        console.error("An error occurred in getprojects");
        return { status: 500, data: { message: e("error") } };
    }
}


export async function getProjectsDesc(page: number = 1, pageSize: number = 10, searchQuery?: string, lang?: string, serachCategories: string[] = [], sortedBy?: string, mine = false): Promise<{ status: number, data: any, count: number }> {
    const e = await getTranslations('Error');

    const locale = lang && lang !== "" ? lang : await getLocale()

    try {

        const skip = (page - 1) * pageSize;

        let conditions = searchQuery ? {
            OR: [
                { slug: { contains: searchQuery } },
                { titles: { some: { title: { contains: searchQuery } } } },
                { description: { some: { description: { contains: searchQuery } } } },
            ]
        } : {};

        if (serachCategories.length > 0) {
            //@ts-ignore
            conditions.AND = [
                { categories: { some: { id: { in: serachCategories } } } },
            ]
        }

        if (mine) {
            const session = await verifySession()

            if (session.status === 200 && session.data.user && session.data.user.id) {
                //@ts-ignore
                if (conditions.AND) {
                    //@ts-ignore
                    conditions.AND.push({ created_by: session.data.user.id });
                } else {
                    //@ts-ignore
                    conditions.AND = [{ created_by: session.data.user.id }];
                }
            }
        }


        const projects = await prisma.project.findMany({
            skip: skip,
            take: pageSize,
            where: conditions,
            orderBy: sortedBy && sortedBy === "popular" ? { views: 'desc' } : { created_at: 'desc' },
            include: {
                categories: true,
                titles: {
                    select: {
                        title: true,
                        language: true
                    },
                    where: searchQuery ? {
                        title: {
                            contains: searchQuery
                        }
                    } : {},
                },
                description: {
                    select: {
                        description: true,
                        language: true
                    },
                },
            }
        });

        const count = await prisma.project.count({ where: conditions });

        const projectsFormatted = await Promise.all(projects.map(async (project) => (
            {
                ...project,
                user: await getUserName(project.created_by),
                image: (project.image && project.image !== "")
                    ? project.image
                    : null,
                title: project.titles.find((title: any) => title.language === locale)
                    ? project.titles.find((title: any) => title.language === locale)?.title
                    : project.titles.find((title: any) => title.language === 'en')
                        ? project.titles.find((title: any) => title.language === 'en')?.title
                        : project.titles && project.titles[0] && project.titles[0].title
                            ? project.titles[0].title
                            : "",
                description: project.description.find((desc: any) => desc.language === locale)
                    ? project.description.find((desc: any) => desc.language === locale)?.description
                    : project.description.find((desc: any) => desc.language === 'en')
                        ? project.description.find((desc: any) => desc.language === 'en')?.description
                        : project.description && project.description[0] && project.description[0].description
                            ? project.description[0].description
                            : "",
                categories: project.categories.map((category) => (
                    {
                        title: locale === "en" && category.name
                            ? category.name
                            : locale === "fr" && category.namefr
                                ? category.namefr
                                : locale === "ar" && category.namear
                                    ? category.namear : category.name ?? category.namefr ?? category.namear ?? ""
                    }
                ))
            }
        ))

        )

        return { status: 200, data: projectsFormatted, count };
    } catch (error) {
        console.error("An error occurred in getprojects");
        return { status: 500, data: { message: e("error") }, count: 0 };
    }
}

// Get a single role
// muste have permission update
export async function getProject(id?: string, slug?: string): Promise<{ status: number, data: any }> {
    const e = await getTranslations('Error');
    try {

        if (!id && !slug) {
            return { status: 400, data: { message: e("titlerequired") } };
        }

        let project = undefined
        if (id) {
            project = await prisma.project.findUnique({ where: { id } });
        } else if (slug) {
            project = await prisma.project.findFirst({ where: { slug } });
        }

        if (!project) {
            return { status: 404, data: { message: e("projectnotfound") } };
        }

        const projectDetail = await prisma.project.findUnique({ where: { id: project.id }, include: { categories: true, titles: true, description: true, contents: { orderBy: { order: "asc" } } } });

        return { status: 200, data: projectDetail };
    } catch (error) {
        console.error("An error occurred in getProject");
        return { status: 500, data: { message: e("error") } };
    }
}

export async function getProjectPublic(id?: string, slug?: string, langage?: string, withothers: boolean = false): Promise<{ status: number, data: any }> {
    const e = await getTranslations('Error');
    const translate = await getTranslations('Projects');
    try {
        if (!id && !slug) {
            return { status: 400, data: { message: translate("titlerequired") } };
        }

        let project = undefined
        if (id) {
            project = await prisma.project.findUnique({ where: { id } });
        } else if (slug) {
            project = await prisma.project.findFirst({ where: { slug } });
        }

        if (!project) {
            return { status: 404, data: { message: translate("projectnotfound") } };
        }

        let lang = "en"
        if (langage) {
            lang = langage
        } else {
            lang = await getLocale()
        }

        if (!withothers) {
            const projectDetail = await prisma.project.findUnique({
                where: { id: project.id },
                include: { categories: true, titles: true, description: true, contents: { orderBy: { order: "asc" } } }
            });
            return { status: 200, data: projectDetail };
        }

        const projectDetail = await prisma.project.findUnique({
            where: { id: project.id },
            include: {
                categories: true,
                titles: {
                    where: { language: lang },
                    select: { title: true, language: true }
                },
                description: {
                    where: { language: lang },
                    select: { description: true, language: true }
                },
                contents: {
                    orderBy: { order: 'asc' },
                    where: { language: lang },
                    select: { data: true, language: true, type: true },
                }
            }
        });


        if (projectDetail && (!projectDetail.titles || projectDetail.titles.length == 0)) {
            const titles = (await prisma.project.findUnique({ where: { id: project.id }, include: { titles: { where: { language: "en" }, select: { title: true, language: true } } } }))
            if (titles && titles.titles.length !== 0) {
                projectDetail.titles = titles.titles
            }
            else {
                const titles = (await prisma.project.findUnique({ where: { id: project.id }, include: { titles: { select: { title: true, language: true } } } }))
                if (titles) projectDetail.titles = titles.titles
            }
        }

        if (projectDetail && (!projectDetail.description || projectDetail.description.length == 0)) {
            const description = (await prisma.project.findUnique({ where: { id: project.id }, include: { description: { where: { language: "en" }, select: { description: true, language: true } } } }))
            if (description && description.description.length !== 0)
                projectDetail.description = description.description
            else {
                const description = (await prisma.project.findUnique({ where: { id: project.id }, include: { description: { select: { description: true, language: true } } } }))
                if (description) projectDetail.description = description.description
            }
        }


        if (projectDetail && (!projectDetail.contents || projectDetail.contents.length == 0)) {
            const contents = await prisma.project.findUnique({ where: { id: project.id }, include: { contents: { where: { language: "en" }, select: { data: true, language: true, type: true }, orderBy: { order: 'asc' }, } } })
            if (contents && contents.contents.length !== 0)
                projectDetail.contents = contents.contents
            else {
                const contents = (await prisma.project.findUnique({ where: { id: project.id }, include: { contents: { select: { data: true, language: true, type: true }, orderBy: { order: 'asc' }, } } }))
                if (contents) projectDetail.contents = contents.contents
            }
        }

        return { status: 200, data: projectDetail };
    } catch (error) {
        console.error("An error occurred in getProjectPublic");
        return { status: 500, data: { message: e("error") } };
    }
}

export async function getProjectsCount(searchQuery?: string): Promise<{ status: number, data: any }> {
    const e = await getTranslations('Error');
    try {
        const count = await prisma.project.count({
            where: {
                OR: [
                    { slug: { contains: searchQuery } },
                    { titles: { some: { title: { contains: searchQuery } } } }
                ]
            }
        });
        return { status: 200, data: count };
    } catch (error) {
        console.error("An error occurred in getProjectsCount");
        return { status: 500, data: { message: e("error") } };
    }

}
