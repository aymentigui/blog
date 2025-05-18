"use server"

import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/db";
import { withAuthorizationPermission, verifySession } from "../permissions";
import { uploadFileDB } from "../localstorage/upload-db";
import { deleteFileDb } from "../localstorage/delete-db";

export async function UpdateBlog(id: string, titles: any[], descriptions: any[], components: any[], image: any, slug: any, categories: any[], deleteImage?: boolean): Promise<{ status: number, data: { message?: string } }> {
    const e = await getTranslations('Error');
    const s = await getTranslations('System');
    const b = await getTranslations('Blogs');

    try {
        const session = await verifySession();
        if (!session?.data?.user) {
            return { status: 401, data: { message: e("unauthorized") } };
        }
        const hasPermissionAdd = await withAuthorizationPermission(['blogs_update'], session.data.user.id);

        const blog = await prisma.blog.findUnique({ where: { id }});

        if(!blog)
            return { status: 404, data: { message: b("blognotfound") } };

        if ((hasPermissionAdd.status != 200 || !hasPermissionAdd.data.hasPermission) && blog.created_by !== session.data.user.id) {
            return { status: 403, data: { message: e('forbidden') } };
        }

        if (titles.every((title: any) => !title.value)) {
            return { status: 400, data: { message: e("titlerequired") } };
        }

        const titleExist = await prisma.blog_titles.findFirst(
            {
                where: {
                    title: {
                        equals:titles[0].value,
                    }
                }
        })

        if (titleExist && titleExist.blog_id !== blog.id) {
            return { status: 400, data: { message: e("titleexists") } };
        }

        if ((!slug || !slug.length) && !blog.slug ) slug = await generateSlug(titles[0].value);

        const imageBlog = await prisma.blog.findUnique({ where: { id }, select: { image: true } });
        let url = "";
        if (image) {
            const res = await uploadFileDB(image, session.data.user.id)
            if (res.status === 200) {
                url = res.data.file.id
            }
        }
        if (imageBlog?.image && (url !== "" || deleteImage)) {
            await deleteFileDb(imageBlog.image);
        } else if (imageBlog?.image && !deleteImage) {
            url = imageBlog.image
        }

        await prisma.blog_titles.deleteMany({ where: { blog_id: id } });
        await prisma.blog_description.deleteMany({ where: { blog_id: id } });
        await prisma.blog_content.deleteMany({ where: { blog_id: id } });
        await prisma.blogs_categories.deleteMany({ 
            where: {
                products : {
                    some: {
                        id
                    }
                }
            }
        });

        await prisma.blog.update({
            where: { id },
            data: {
                image: url,
                slug: (!slug || !slug.length)? blog.slug: slug,
                titles: {
                    create: titles.map((title: any) => ({
                        title: title.value.trim().toLowerCase(),
                        language: title.language || "en",
                    })),
                },
                contents: {
                    create: components.map((content: any, index) => ({
                        type: content.type,
                        data: JSON.stringify(content.value),
                        language: content.langage || "en",
                        order: index
                    })),
                },
                categories: {
                    connect: categories.map((category: any) => ({
                        id: category,
                    })),
                },
            }
        });


        if (descriptions && descriptions.length > 0) {
            await Promise.all(
                descriptions.map(async (description: any) => {
                    await prisma.blog_description.create({
                        data: {
                            description: description && description.value ? description.value : "",
                            language: description.language || "en",
                            blog_id: blog.id
                        }
                    })
                })

            )
        }

        return { status: 200, data: { message: s("updatesuccess") } };
    } catch (error) {
        // @ts-ignore
        console.error("An error occurred in UpdateBlog" + error.message);
        return { status: 500, data: { message: e("error") } };
    }
}


const generateSlug = async (title: string) => {
    const slug = title.toLowerCase().replace(/ /g, '-');
    const existingBlogs = await prisma.blog.findMany({ where: { slug } });
    if (existingBlogs.length > 0) {
        const count = existingBlogs.length + 1;
        return `${slug}-${count}`;
    }
    return slug;
}

export async function incrementBlogView(id: string) {
    await prisma.blog.update({
        where: { id: id },
        data: { views: { increment: 1 } },
    });
    await prisma.blogs_view.create({
        data: { blog_id: id },
    });
}