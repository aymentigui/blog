"use server"

import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/db";
import { withAuthorizationPermission,verifySession } from "../../permissions";

export async function UpdateBlogsCategory(id: string, name: string, nameFr: string, nameAr: string) : Promise<{ status: number, data: { message: string } }> {
    const e = await getTranslations('Error');
    const s = await getTranslations('System');
    try {
        const session = await verifySession();
        if (!session?.data?.user) {
            return { status: 401, data: { message: e("unauthorized") } };
        }
        const hasPermissionAdd = await withAuthorizationPermission(['blogs_categories_update'],session.data.user.id);
        
        if(hasPermissionAdd.status != 200 || !hasPermissionAdd.data.hasPermission) {
            return { status: 403, data: { message: e('forbidden') } };
        }
        await prisma.blogs_categories.update({
            where: { id },
            data: {
                name: name,
                namefr: nameFr,
                namear: nameAr,
            },
        })
        return { status: 200, data: { message: s("updatesuccess") } };
    } catch (error) {
        console.error("An error occurred in UpdateBlogsCategory");
        return { status: 500, data: { message: e("error") } };
    }
}
