"use server"

import { verifySession } from "@/actions/permissions";
import { prisma } from "@/lib/db";
import { getTranslations } from "next-intl/server";

export async function addfavoris(blogId:string) {
    const e = await getTranslations('Error');
    const b = await getTranslations('Blogs');

    try {
        const session = await verifySession()

        if (!session?.data?.user) {
            return { status: 401, data: { message: e("unauthorized") } };
        }

        const favorisExists = await prisma.blog_favorites.findFirst({
            where: {
                blog_id: blogId,
                user_id: session.data.user.id
            }
        })

        if (favorisExists) {
            return { status: 400, data: { message: "" } }
        }

        await prisma.blog_favorites.create({
            data: {
                blog_id: blogId,
                user_id: session.data.user.id
            },
        })

        return { status: 200, data :{ message : ""} }
    } catch (error) {
        console.error("Error adding favoris:", error)
        return { status: 500, data: { message: e("error") } }
    }
}