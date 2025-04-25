"use server"

import { getLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/db";

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


export async function getBlogsDesc(page: number = 1, pageSize: number = 10, searchQuery?: string): Promise<{ status: number, data: any }> {
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


        return { status: 200, data: blogs };
    } catch (error) {
        console.error("An error occurred in getBlogs");
        return { status: 500, data: { message: e("error") } };
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
                    select: { data: true, language: true },
                }
            }
        });


        if (blogDetail && (!blogDetail.titles || blogDetail.titles.length == 0)) {
            const titles = (await prisma.blog.findUnique({ where: { id: blog.id }, include: { titles: { where: { language: "en" }, select: { title: true, language: true } } } }))
            if (titles && titles.titles.length == 0) {
                blogDetail.titles = titles.titles
            }
            else {
                const titles = (await prisma.blog.findUnique({ where: { id: blog.id }, include: { titles: { select: { title: true, language: true } } } }))
                if (titles) blogDetail.titles = titles.titles
            }
        }

        if (blogDetail && (!blogDetail.description || blogDetail.description.length == 0)) {
            const description = (await prisma.blog.findUnique({ where: { id: blog.id }, include: { description: { where: { language: "en" }, select: { description: true, language: true } } } }))
            if (description && description.description.length == 0)
                blogDetail.description = description.description
            else {
                const description = (await prisma.blog.findUnique({ where: { id: blog.id }, include: { description: { select: { description: true, language: true } } } }))
                if (description) blogDetail.description = description.description
            }
        }


        if (blogDetail && (!blogDetail.contents || blogDetail.contents.length == 0)) {
            const contents = (await prisma.blog.findUnique({ where: { id: blog.id }, include: { contents: { where: { language: "en" }, select: { data: true, language: true } } } }))
            if (contents && contents.contents.length == 0)
                blogDetail.contents = contents.contents
            else {
                const contents = (await prisma.blog.findUnique({ where: { id: blog.id }, include: { contents: { select: { data: true, language: true } } } }))
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
