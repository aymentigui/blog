"use server"

import { getLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/db";
import { verifySession } from "../permissions";
import { getUserName } from "../users/get";

export async function getBlogs(page: number = 1, pageSize: number = 10, searchQuery?: string): Promise<{ status: number, data: any }> {
    const e = await getTranslations('Error');
    try {
        const skip = (page - 1) * pageSize;

        const blogs = await prisma.blog.findMany({
            skip: skip,
            take: pageSize,
            where: searchQuery ? {
                slug: {
                    contains: searchQuery
                }
            } : {},
            include: {
                blog_favorites: true,
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


        return { status: 200, data: blogs };
    } catch (error) {
        console.error("An error occurred in getBlogs");
        return { status: 500, data: { message: e("error") } };
    }
}


export async function getBlogsDesc(page: number = 1, pageSize: number = 10, searchQuery?: string, lang?: string, serachCategories: string[] = [], sortedBy?: string, mine = false): Promise<{ status: number, data: any, count: number }> {
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
                    conditions.AND.push({ createdBy: session.data.user.id });
                } else {
                    //@ts-ignore
                    conditions.AND = [{ createdBy: session.data.user.id }];
                }
            }
        }


        const blogs = await prisma.blog.findMany({
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

        const count = await prisma.blog.count({ where: conditions });

        const blogsFormatted = await Promise.all(blogs.map(async (blog) => (
            {
                ...blog,
                user: await getUserName(blog.created_by),
                image: (blog.image && blog.image !== "")
                    ? blog.image
                    : null,
                    title: blog.titles.find((title: any) => title.language === locale)
                    ? blog.titles.find((title: any) => title.language === locale)?.title
                    : blog.titles.find((title: any) => title.language === 'en')
                        ? blog.titles.find((title: any) => title.language === 'en')?.title
                        : blog.titles && blog.titles[0] && blog.titles[0].title
                            ? blog.titles[0].title
                            : "",
                description: blog.description.find((desc: any) => desc.language === locale)
                    ? blog.description.find((desc: any) => desc.language === locale)?.description
                    : blog.description.find((desc: any) => desc.language === 'en')
                        ? blog.description.find((desc: any) => desc.language === 'en')?.description
                        : blog.description && blog.description[0] && blog.description[0].description
                            ? blog.description[0].description
                            : "",
                categories: blog.categories.map((category) => (
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

        return { status: 200, data: blogsFormatted, count };
    } catch (error) {
        console.error("An error occurred in getBlogs");
        return { status: 500, data: { message: e("error") }, count: 0 };
    }
}

export async function getBlogsDescFavorites(page: number = 1, pageSize: number = 10, searchQuery?: string, lang?: string, serachCategories: string[] = [], sortedBy?: string): Promise<{ status: number, data: any, count: number }> {
    const e = await getTranslations('Error');

    const locale = lang && lang !== "" ? lang : await getLocale()

    try {

        const session = await verifySession()

        if (!session?.data?.user) {
            return { status: 401, data: { message: e("unauthorized") }, count: 0 };
        }

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

        //@ts-ignore
        if (conditions.AND) {
            //@ts-ignore
            conditions.AND.push({
                blog_favorites: { some: { user_id: session.data.user.id } }
            });
        } else {
            //@ts-ignore
            conditions.AND = [{
                blog_favorites: { some: { user_id: session.data.user.id } }
            }];
        }



        const blogs = await prisma.blog.findMany({
            skip: skip,
            take: pageSize,
            where: conditions,
            orderBy: sortedBy && sortedBy === "popular" ? { views: 'desc' } : { created_at: 'desc' },
            include: {
                categories: true,
                blog_favorites:true,
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

        const count = await prisma.blog.count({ where: conditions });

        const blogsFormatted = await Promise.all(blogs.map(async (blog) => (
            {
                ...blog,
                user: await getUserName(blog.created_by),
                image: (blog.image && blog.image !== "")
                    ? blog.image
                    : null,
                title: blog.titles.find((title: any) => title.language === locale)?.title
                    ?? blog.titles.find((title: any) => title.language === 'en')?.title
                    ?? blog.titles
                    ? blog.titles[0].title
                    : "",
                description: blog.description.find((desc: any) => desc.language === locale)?.description
                    ?? blog.description.find((desc: any) => desc.language === 'en')?.description
                    ?? blog.description[0]
                    ? blog.description[0].description
                    : "",
                categories: blog.categories.map((category) => (
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

        return { status: 200, data: blogsFormatted, count };
    } catch (error) {
        console.error("An error occurred in getBlogs");
        return { status: 500, data: { message: e("error") }, count: 0 };
    }
}


// Get a single role
// muste have permission update
export async function getBlog(id?: string, slug?: string): Promise<{ status: number, data: any }> {
    const e = await getTranslations('Error');
    try {

        if (!id && !slug) {
            return { status: 400, data: { message: e("titlerequired") } };
        }

        let blog = undefined
        if (id) {
            blog = await prisma.blog.findUnique({ where: { id } });
        } else if (slug) {
            blog = await prisma.blog.findFirst({ where: { slug } });
        }

        if (!blog) {
            return { status: 404, data: { message: e("blognotfound") } };
        }

        const blogDetail = await prisma.blog.findUnique({ where: { id: blog.id }, include: { categories: true, titles: true, description: true, contents: { orderBy: { order: "asc" } } } });

        return { status: 200, data: blogDetail };
    } catch (error) {
        console.error("An error occurred in getRole");
        return { status: 500, data: { message: e("error") } };
    }
}

export async function getBlogPublic(id?: string, slug?: string, langage?: string, withothers: boolean = false): Promise<{ status: number, data: any }> {
    const e = await getTranslations('Error');
    const translate = await getTranslations('Blogs');
    try {
        if (!id && !slug) {
            return { status: 400, data: { message: translate("titlerequired") } };
        }

        let blog = undefined
        if (id) {
            blog = await prisma.blog.findUnique({ where: { id } });
        } else if (slug) {
            blog = await prisma.blog.findFirst({ where: { slug } });
        }

        if (!blog) {
            return { status: 404, data: { message: translate("blognotfound") } };
        }

        let lang = "en"
        if (langage) {
            lang = langage
        } else {
            lang = await getLocale()
        }

        if (!withothers) {
            const blogDetail = await prisma.blog.findUnique({
                where: { id: blog.id },
                include: { categories: true, titles: true, description: true, contents: { orderBy: { order: "asc" } } }
            });
            return { status: 200, data: blogDetail };
        }

        const blogDetail = await prisma.blog.findUnique({
            where: { id: blog.id },
            include: {
                blog_favorites: true,
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
                    select: { data: true, language: true, type:true },
                }
            }
        });


        if (blogDetail && (!blogDetail.titles || blogDetail.titles.length == 0)) {
            const titles = (await prisma.blog.findUnique({ where: { id: blog.id }, include: { titles: { where: { language: "en" }, select: { title: true, language: true } } } }))
            if (titles && titles.titles.length !== 0) {
                blogDetail.titles = titles.titles
            }
            else {
                const titles = (await prisma.blog.findUnique({ where: { id: blog.id }, include: { titles: { select: { title: true, language: true } } } }))
                if (titles) blogDetail.titles = titles.titles
            }
        }

        if (blogDetail && (!blogDetail.description || blogDetail.description.length == 0)) {
            const description = (await prisma.blog.findUnique({ where: { id: blog.id }, include: { description: { where: { language: "en" }, select: { description: true, language: true } } } }))
            if (description && description.description.length !== 0)
                blogDetail.description = description.description
            else {
                const description = (await prisma.blog.findUnique({ where: { id: blog.id }, include: { description: { select: { description: true, language: true } } } }))
                if (description) blogDetail.description = description.description
            }
        }


        if (blogDetail && (!blogDetail.contents || blogDetail.contents.length == 0)) {
            const contents = await prisma.blog.findUnique({ where: { id: blog.id }, include: { contents: { where: { language: "en" }, select: { data: true, language: true,  type: true }, orderBy: { order: 'asc' }, } } })
            if (contents && contents.contents.length !== 0)
                blogDetail.contents = contents.contents
            else {
                const contents = (await prisma.blog.findUnique({ where: { id: blog.id }, include: { contents: { select: { data: true, language: true, type: true }, orderBy: { order: 'asc' }, } } }))
                if (contents) blogDetail.contents = contents.contents
            }
        }

        return { status: 200, data: blogDetail };
    } catch (error) {
        console.error("An error occurred in getBlogPublic");
        return { status: 500, data: { message: e("error") } };
    }
}

export async function getBlogsCount(searchQuery?: string): Promise<{ status: number, data: any }> {
    const e = await getTranslations('Error');
    try {
        const count = await prisma.blog.count({
            where: {
                OR: [
                    { slug: { contains: searchQuery } },
                    { titles: { some: { title: { contains: searchQuery } } } }
                ]
            }
        });
        return { status: 200, data: count };
    } catch (error) {
        console.error("An error occurred in getBlogsCount");
        return { status: 500, data: { message: e("error") } };
    }

}
