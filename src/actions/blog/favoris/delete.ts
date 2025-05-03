"use server"

import { verifySession } from "@/actions/permissions";
import { prisma } from "@/lib/db";
import { getTranslations } from "next-intl/server";

export async function removefavoris(blogId: string) {
    const e = await getTranslations('Error');
    const b = await getTranslations('Blogs');

    try {
        const session = await verifySession()

        if (!session?.data?.user || !session.data.user.id) {
            return { status: 401, data: { message: e("unauthorized") } };
        }

        if(!blogId) {
            return { status: 401, data: { message: b("blognotfound") } };
        }

        await prisma.blog_favorites.deleteMany(
            {
                where: {
                    blog_id: blogId,
                    user_id: session.data.user.id
                }
            }
        )

        return { status: 200, data :{ message : ""} }
    } catch (error) {
        console.error("Error removing favoris:", error)
        return { status: 500, data: { message: e("error") } }
    }
}