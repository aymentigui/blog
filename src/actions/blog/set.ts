"use server"
import { prisma } from "@/lib/db";
import { getTranslations } from "next-intl/server";
import { withAuthorizationPermission, verifySession } from "../permissions";
import { uploadFileDB } from "../localstorage/upload-db";

export async function AddBlog(titles: any[], descriptions: any[], components: any[], image: any, slug: any, categories: any[]): Promise<{ status: number, data: { message?: string } }> {
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

        let url = "";
        if (image) {
            const res = await uploadFileDB(image, session.data.user.id)
            if (res.status === 200) {
                url = res.data.file.id
            }
        }

        if (!slug || slug === '') {
            const titleExist = await prisma.blog_titles.findFirst(
                {
                    where: {
                       title: titles[0].value
                    }
                }
            )
            if (titleExist){
                return { status: 400, data: { message: translate("titleexists") } };
            }
            slug = await generateSlug(titles[0].value)
        }


        const blog = await prisma.blog.create({
            data: {
                created_by: session.data.user.id,
                image: url,
                slug: slug,
                titles: {
                    create: titles.map((title: any) => ({
                        title: title.value.trim().toLowerCase() ?? "",
                        language: title.language || "en",
                    })
                    )
                },
                contents: {
                    create: components.map((content: any, index) => ({
                        type: content.type,
                        data: JSON.stringify(content.value ?? ""),
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

        // await emailQueue.add('sendNewsletter', {
        //     slog: slug,
        //     title: titles[0].value +"--" + (titles[1]? titles[0].value:"") + "--" + (titles[2]? titles[0].value:""),
        //     descriptions: descriptions[0].value +,
        //   });

        const myCategories = await prisma.blogs_categories.findMany({
            where: {
                products: {
                    some: {
                        id: blog.id
                    }
                }
            }
        })

        fetch((process.env.DOMAIN_URL ?? "http://localhost:3000")+"/api/email", {
            method: "POST",
            body: JSON.stringify({
                title: titles[0].value + (titles[1] ?  "--" +titles[1].value : "") + (titles[2] ?  "--" + titles[2].value : ""),
                description: descriptions && descriptions.length > 0 && descriptions[0].value? descriptions[0].value : "",
                categorie: JSON.stringify(myCategories && myCategories.length > 0 ? myCategories.map((cat) => cat.name).join(", ") : ""),
                slug: slug
            }),
        });

        return { status: 200, data: { message: s("createsuccess") } };
    } catch (error) {
        // @ts-ignore
        console.error("An error occurred in Addblog" + error.message);
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