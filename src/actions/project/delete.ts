"use server"
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/db";
import { verifySession } from "../permissions";
import {  withAuthorizationPermission } from "../permissions";

export async function deleteProjects(projectsIds: string[]): Promise<{ status: number, data: { message: string } }> {
    const e = await getTranslations('Error');
    const s = await getTranslations('System');
    try {
        const session = await verifySession();
        if (!session?.data?.user) {
            return { status: 401, data: { message: e("unauthorized") } };
        }
        const hasPermissionAdd = await withAuthorizationPermission(['projects_delete'],session.data.user.id);

        if (hasPermissionAdd.status != 200 || !hasPermissionAdd.data.hasPermission) {
            return { status: 403, data: { message: e('forbidden') } };
        }
        // suppression des titles
        await prisma.project_titles.deleteMany({
            where: {
                project_id: {
                    in: projectsIds
                }
            }
        });

        // suppression des descriptions
        await prisma.project_description.deleteMany({
            where: {
                project_id: {
                    in: projectsIds
                }
            }
        })

        // suppression des contents
        await prisma.project_content.deleteMany({
            where: {
                project_id: {
                    in: projectsIds
                }
            }
        })

        await prisma.project_view.deleteMany({
            where: {
                project_id: {
                    in: projectsIds
                }
            }
        })

        await prisma.project.deleteMany({
            where: {
                id: {
                    in: projectsIds
                }
            }
        });

        return { status: 200, data: { message: s("deletesuccess") } };
    } catch (error) {
        console.error("An error occurred in deleteProjects");
        return { status: 500, data: { message: e("error") } };
    }
}
