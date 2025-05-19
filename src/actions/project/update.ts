"use server"

import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/db";
import { withAuthorizationPermission, verifySession } from "../permissions";
import { uploadFileDB } from "../localstorage/upload-db";
import { deleteFileDb } from "../localstorage/delete-db";

export async function UpdateProject(id: string, titles: any[], descriptions: any[], components: any[], image: any, slug: any, categories: any[], deleteImage?: boolean): Promise<{ status: number, data: { message?: string } }> {
    const e = await getTranslations('Error');
    const s = await getTranslations('System');
    const b = await getTranslations('Projects');

    try {
        const session = await verifySession();
        if (!session?.data?.user) {
            return { status: 401, data: { message: e("unauthorized") } };
        }
        const hasPermissionAdd = await withAuthorizationPermission(['projects_update'], session.data.user.id);

        const project = await prisma.project.findUnique({ where: { id }});

        if(!project)
            return { status: 404, data: { message: b("projectnotfound") } };

        if ((hasPermissionAdd.status != 200 || !hasPermissionAdd.data.hasPermission) && project.created_by !== session.data.user.id) {
            return { status: 403, data: { message: e('forbidden') } };
        }

        if (titles.every((title: any) => !title.value)) {
            return { status: 400, data: { message: e("titlerequired") } };
        }

        const titleExist = await prisma.project_titles.findFirst(
            {
                where: {
                    title: {
                        equals:titles[0].value,
                    }
                }
        })

        if (titleExist && titleExist.project_id !== project.id) {
            return { status: 400, data: { message: e("titleexists") } };
        }

        if ((!slug || !slug.length) && !project.slug ) slug = await generateSlug(titles[0].value);

        const imageProject = await prisma.project.findUnique({ where: { id }, select: { image: true } });
        let url = "";
        if (image) {
            const res = await uploadFileDB(image, session.data.user.id)
            if (res.status === 200) {
                url = res.data.file.id
            }
        }
        if (imageProject?.image && (url !== "" || deleteImage)) {
            await deleteFileDb(imageProject.image);
        } else if (imageProject?.image && !deleteImage) {
            url = imageProject.image
        }

        await prisma.project_titles.deleteMany({ where: { project_id: id } });
        await prisma.project_description.deleteMany({ where: { project_id: id } });
        await prisma.project_content.deleteMany({ where: { project_id: id } });
        await prisma.project.update(
            {
                where: { id },
                data: {
                    categories: undefined
                }
            }
        )


        await prisma.project.update({
            where: { id },
            data: {
                image: url,
                slug: (!slug || !slug.length)? project.slug: slug,
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
                    await prisma.project_description.create({
                        data: {
                            description: description && description.value ? description.value : "",
                            language: description.language || "en",
                            project_id: project.id
                        }
                    })
                })

            )
        }

        return { status: 200, data: { message: s("updatesuccess") } };
    } catch (error) {
        // @ts-ignore
        console.error("An error occurred in UpdateProject" + error.message);
        return { status: 500, data: { message: e("error") } };
    }
}


const generateSlug = async (title: string) => {
    const slug = title.toLowerCase().replace(/ /g, '-');
    const existingProject = await prisma.project.findMany({ where: { slug } });
    if (existingProject.length > 0) {
        const count = existingProject.length + 1;
        return `${slug}-${count}`;
    }
    return slug;
}

export async function incrementProjectView(id: string) {
    await prisma.project.update({
        where: { id: id },
        data: { views: { increment: 1 } },
    });
    await prisma.project_view.create({
        data: { project_id: id },
    });
}