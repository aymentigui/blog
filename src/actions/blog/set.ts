"use server"
import { prisma } from "@/lib/db";
import { getTranslations } from "next-intl/server";
import { withAuthorizationPermission, verifySession } from "../permissions";
import { uploadFileDB } from "../localstorage/upload-db";

export async function AddBlog(titles: any[], descriptions: any[], components: any[],image: any,slug:any,categories:any[]): Promise<{ status: number, data: { message?: string } }> {
    const e = await getTranslations('Error');
    const s = await getTranslations('System');
    const translate = await getTranslations('Blogs');
    try {
        const session = await verifySession();
        if (!session?.data?.user) {
            return { status: 401, data: { message: e("unauthorized") } };
        }
        const hasPermission = await withAuthorizationPermission(['blogs_create'], session.data.user.id);

        if (hasPermission.status != 200 || !hasPermission.data.hasPermission) {
            return { status: 403, data: { message: e('forbidden') } };
        }

        if (titles.every((title: any) => !title.value)) {
            return { status: 400, data: { message: translate("titlerequired") } };
        }

        let contents = await UploadFilesContent(components, session.data.user.id)

        let url = "";
        if (image) {
            const res = await uploadFileDB(image, session.data.user.id)
            if(res.status === 200) {
                url = res.data.file.id
            }
        }

        if(!slug || slug === '') {
            slug = await generateSlug(titles[0].value)
        }

        await prisma.blog.create({
            data: {
                createdBy: session.data.user.id,
                image: url,
                slug: slug,
                titles: {
                    create: titles.map((title: any) => ({
                        title: title.value,
                        language: title.language || "en",
                    })
                    )
                },
                description: {
                    create: descriptions.map((description: any) => ({
                        description: description.value,
                        language: description.language || "en",
                    })
                    )
                },
                contents: {
                    create: contents.map((content: any, index) => ({
                        type: content.type,
                        data: JSON.stringify(content.value),
                        language: content.langage || "en",
                        order: index
                    })),
                },
                categories: {
                    connect: categories.map((category: any) => ({
                        id: category
                    }))
                }
            }
        })
        return { status: 200, data: { message: s("createsuccess") } };
    } catch (error) {
        // @ts-ignore
        console.error("An error occurred in Addblog" + error.message);
        return { status: 500, data: { message: e("error") } };
    }
}

const UploadFilesContent = async (components: any[], userId: string) => {

    const Contents = components.map(async (component) => {

        if ((component.type === 'image' || component.type === 'video' || component.type === 'file') && component.value) {
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