"use server"
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/db";
import { verifySession } from "../permissions";
import {  withAuthorizationPermission } from "../permissions";

export async function deleteBlogs(blogsIds: string[]): Promise<{ status: number, data: { message: string } }> {
    const e = await getTranslations('Error');
    const s = await getTranslations('System');
    try {
        const session = await verifySession();
        if (!session?.data?.user) {
            return { status: 401, data: { message: e("unauthorized") } };
        }
        const hasPermissionAdd = await withAuthorizationPermission(['blogs_delete'],session.data.user.id);

        if (hasPermissionAdd.status != 200 || !hasPermissionAdd.data.hasPermission) {
            return { status: 403, data: { message: e('forbidden') } };
        }
        // suppression des titles
        await prisma.blog_titles.deleteMany({
            where: {
                blog_id: {
                    in: blogsIds
                }
            }
        });

        // suppression des descriptions
        await prisma.blog_description.deleteMany({
            where: {
                blog_id: {
                    in: blogsIds
                }
            }
        })

        // suppression des contents
        await prisma.blog_content.deleteMany({
            where: {
                blog_id: {
                    in: blogsIds
                }
            }
        })

        await prisma.blogs_view.deleteMany({
            where: {
                blog_id: {
                    in: blogsIds
                }
            }
        })

        await prisma.blog_favorites.deleteMany({
            where: {
                blog_id: {
                    in: blogsIds
                }
            }
        })

        await prisma.blog.deleteMany({
            where: {
                id: {
                    in: blogsIds
                }
            }
        });

        return { status: 200, data: { message: s("deletesuccess") } };
    } catch (error) {
        console.error("An error occurred in deleteBlogs");
        return { status: 500, data: { message: e("error") } };
    }
}
