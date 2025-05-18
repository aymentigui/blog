"use server"
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/db";
import { withAuthorizationPermission, verifySession } from "../../permissions";

export async function DeleteBlogsCategories(ids: string): Promise<{ status: number, data: { message: string } }> {
    const e = await getTranslations('Error');
    const s = await getTranslations('System');
    try {
        const session = await verifySession();
        if (!session?.data?.user) {
            return { status: 401, data: { message: e("unauthorized") } };
        }
        const hasPermissionAdd = await withAuthorizationPermission(['blogs_categories_delete'],session.data.user.id);

        if (hasPermissionAdd.status != 200 || !hasPermissionAdd.data.hasPermission) {
            return { status: 403, data: { message: e('forbidden') } };
        }
        await prisma.blogs_categories.delete({ where: { id: ids } });
        return { status: 200, data: { message: s("deletesuccess") } };
    } catch (error) {
        console.error("An error occurred in deleteBlogsCategories");
        return { status: 500, data: { message: e("error") } };
    }
}
