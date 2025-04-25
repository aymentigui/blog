"use server"

import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/db";
import { withAuthorizationPermission, verifySession } from "../permissions";
import { uploadFileDB } from "../localstorage/upload-db";
import { deleteFileDb } from "../localstorage/delete-db";

export async function UpdateBlog(id: string, titles: any[], descriptions: any[], components: any[], image: any, slug: any, categories: any[], deleteImage?: boolean): Promise<{ status: number, data: { message?: string } }> {
    const e = await getTranslations('Error');
    const s = await getTranslations('System');
    try {
        const session = await verifySession();
        if (!session?.data?.user) {
            return { status: 401, data: { message: e("unauthorized") } };
        }
        const hasPermissionAdd = await withAuthorizationPermission(['blogs_update'], session.data.user.id);

        if (hasPermissionAdd.status != 200 || !hasPermissionAdd.data.hasPermission) {
            return { status: 403, data: { message: e('forbidden') } };
        }

        if (titles.every((title: any) => !title.value)) {
            return { status: 400, data: { message: e("titlerequired") } };
        }

        let contents = await UploadFilesContent(components, session.data.user.id)
        if(!slug || !slug.length) slug = await generateSlug(titles[0].value);
        
        const imageBlog = await prisma.blog.findUnique({ where: { id }, select: { image: true } });
        let url = "";
        if (image) {
            const res = await uploadFileDB(image, session.data.user.id)
            if(res.status === 200) {
                url = res.data.file.id
            }
        }
        if (imageBlog?.image && (url!=="" || deleteImage)) {
            await deleteFileDb(imageBlog.image);
        }else if(imageBlog?.image && !deleteImage) {
            url = imageBlog.image
        }

        await prisma.blog.update({
            where: { id },
            data: {
                image: url,
                slug: slug,
                titles: {
                    deleteMany: {},
                    create: titles.map((title: any) => ({
                        title: title.value,
                        language: title.language || "en",
                    })),
                },
                description: {
                    deleteMany: {},
                    create: descriptions.map((description: any) => ({
                        description: description.value,
                        language: description.language || "en",
                    })),
                },
                contents: {
                    deleteMany: {},
                    create: contents.map((content: any,index) => ({
                        type: content.type,
                        data: JSON.stringify(content.value),
                        language: content.langage || "en",
                        order: index
                    })),
                },
                categories: {
                    deleteMany: {},
                    connect: categories.map((category: any) => ({
                        id: category,
                    })),
                },
            }
        });
        return { status: 200, data: { message: s("updatesuccess") } };
    } catch (error) {
        // @ts-ignore
        console.error("An error occurred in UpdateBlog" + error.message);
        return { status: 500, data: { message: e("error") } };
    }
}

const UploadFilesContent = async (components: any[], userId: string) => {

    const Contents = components.map(async (component) => {
        
        if ((component.type === 'image' || component.type === 'video' || component.type === 'file') && component.value) {
            if(component.value.url) return component
            const file = await uploadFileDB(component.value.file, userId)
            if (file.status === 200 && file.data.file) {
                return {
                    ...component, value: {
                        ...component.value,
                        file: null,
                        url: file.data.file.id
                    }
                }
            }
        }

        else {
            return component
        }
    })

    const contetns = await Promise.all(Contents);
    return contetns
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