"use server"
import { prisma } from "@/lib/db";
import { getTranslations } from "next-intl/server";
import { withAuthorizationPermission, verifySession } from "../../permissions";

export async function AddProjectsCategory(name: string,nameFr: string,nameAr: string): Promise<{ status: number, data: { message: string } }> {
    const e = await getTranslations('Error');
    const s = await getTranslations('System');
    const translate = await getTranslations('ProjectsCategories');

    try {
        const session = await verifySession();
        if (!session?.data?.user) {
            return { status: 401, data: { message: e("unauthorized") } };
        }
        const hasPermissionAdd = await withAuthorizationPermission(['projects_categories_create'],session.data.user.id);
        
        if(hasPermissionAdd.status != 200 || !hasPermissionAdd.data.hasPermission) {
            return { status: 403, data: { message: e('forbidden') } };
        }
        
        const existName = await prisma.project_categories.findFirst({ where: { name } });

        if(existName) {
            return { status: 400, data: { message: translate('nameexist') } };
        }

        await prisma.project_categories.create({
            data: {
                name: name,
                namefr: nameFr,
                namear: nameAr,
            },
        })
        return { status: 200, data: { message: s("createsuccess") } };
    } catch (error) {
        console.error("An error occurred in AddprojectsCategory");
        return { status: 500, data: { message: e("error") } };
    }
}
