"use server"

import { verifySession } from "@/actions/permissions";
import { prisma } from "@/lib/db";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache"

// Soft delete a single comment
export async function deleteComment(id: string) {
    const e = await getTranslations('Error');
    const b = await getTranslations('Blogs');

    try {
        const session = await verifySession()

        if (!session?.data?.user) {
            return { status: 401, data: { message: e("unauthorized") } };
        }

        // Find the comment first to check ownership and get blogId
        const comment = await prisma.comment.findUnique({
            where: { id },
            select: { author_id: true, blog_id: true },
        })

        if (!comment) {
            return { status: 401, data: { message: b("commentnotfound") } }
        }

        // Check if user is the author of the comment or an admin
        if (comment.author_id !== session.data.user.id && !session.data.user.isAdmin) {
            return { status: 401, data: { message: e("unauthorized") } };
        }

        // Soft delete by setting deletedAt
        const deletedComment = await prisma.comment.update({
            where: { id },
            data: {
                deleted_at: new Date(),
            },
        })

        revalidatePath(`/blogs/${comment.blog_id}`)
        return { success: true, comment: deletedComment }
    } catch (error) {
        console.error("Error deleting comment:", error)
        return { status: 500, data: { message: e("error") } };
    }
}

// Soft delete multiple comments (admin only)
export async function deleteMultipleComments(ids: string[]) {
    const e = await getTranslations('Error');

    try {
        const session = await verifySession()

        if (!session?.data?.user || !session.data.user.isAdmin) {
            return { status: 401, data: { message: e("unauthorized") } };
        }

        // Get all blog IDs affected for path revalidation
        const comments = await prisma.comment.findMany({
            where: {
                id: {
                    in: ids,
                },
            },
            select: {
                blog_id: true,
            },
        })

        const blogIds = [...new Set(comments.map((comment) => comment.blog_id))]

        // Soft delete all comments
        const deletedComments = await prisma.comment.updateMany({
            where: {
                id: {
                    in: ids,
                },
            },
            data: {
                deleted_at: new Date(),
            },
        })

        // Revalidate all affected blog paths
        blogIds.forEach((blogId) => {
            revalidatePath(`/blogs/${blogId}`)
        })

        return { success: true, count: deletedComments.count }
    } catch (error) {
        console.error("Error deleting multiple comments:", error)
        return { status: 500, data: { message: e("error") } };
    }
}

// Hard delete a comment (admin only)
export async function hardDeleteComment(id: string) {
    const e = await getTranslations('Error');
    const b = await getTranslations('Blogs');

    try {
        const session = await verifySession()

        if (!session?.data.user?.id || !session.data.user.isAdmin) {
            return { status: 401, data: { message: e("unauthorized") } };
        }

        // Find the comment first to get blogId
        const comment = await prisma.comment.findUnique({
            where: { id },
            select: { blog_id: true },
        })

        if (!comment) {
            return { status: 401, data: { message: b("commentnotfound") } }
        }

        // Delete all reactions to this comment first
        await prisma.comment_reaction.deleteMany({
            where: {
                comment_id: id,
            },
        })

        // Delete the comment
        await prisma.comment.delete({
            where: { id },
        })

        revalidatePath(`/blogs/${comment.blog_id}`)
        return { success: true }
    } catch (error) {
        console.error("Error hard deleting comment:", error)
        return { status: 500, data: { message: e("error") } };
    }
}

