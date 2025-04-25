"use server"

import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/db";
import { verifySession } from "../../permissions";

export async function getBlogsCategories(): Promise<{ status: number, data: any }> {
    const e = await getTranslations('Error');
    try {
        const session = await verifySession();
        if (!session?.data?.user) {
            return { status: 401, data: { message: e("unauthorized") } };
        }

        const data = await prisma.blogs_categories.findMany();

        return { status: 200, data: data };
    } catch (error) {
        console.error("An error occurred in getBlogsCategories");
        return { status: 500, data: { message: e("error") } };
    }
}

// Get a single role
// muste have permission update
export async function getBlogssCategory(id: string): Promise<{ status: number, data: any }> {
    const e = await getTranslations('Error');
    try {
        const session = await verifySession();
        if (!session?.data?.user) {
            return { status: 401, data: { message: e("unauthorized") } };
        }

        const products_categories = await prisma.blogs_categories.findUnique({ where: { id } });
        return { status: 200, data: products_categories };
    } catch (error) {
        console.error("An error occurred in getBlogssCategory");
        return { status: 500, data: { message: e("error") } };
    }
}