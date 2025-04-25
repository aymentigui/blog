"use server"

import { verifySession } from "@/actions/permissions"
import { prisma } from "@/lib/db"
import { getTranslations } from "next-intl/server"
import { revalidatePath } from "next/cache"

// Add a new comment
export async function addComment({
    content,
    blogId,
    parentId,
}: {
    content: string
    blogId: string
    parentId?: string | null
}) {
    const e = await getTranslations('Error');
    const b = await getTranslations('Blogs');

    try {
        const session = await verifySession()

        if (!session?.data?.user) {
            return { status: 401, data: { message: e("unauthorized") } };
        }

        if (parentId) {
            const parentComment = await prisma.comment.findUnique({
                where: { id: parentId },
                select: { parentId: true },
            })
            if (parentComment && parentComment.parentId) {
                return { status: 400, data: { message:  b("errorreplaytoreplay")} }
            }
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                blogId,
                authorId: session.data.user.id,
                parentId: parentId || null,
            },
        })

        revalidatePath(`/blog/${blogId}`)
        return { success: true, comment }
    } catch (error) {
        console.error("Error adding comment:", error)
        return { status: 500, data: { message: e("error") } }
    }
}

// Add a reaction to a comment
export async function addReaction({
    commentId,
    type,
}: {
    commentId: string
    type: string
}) {
    const e = await getTranslations('Error');

    try {
        const session = await verifySession()

        if (!session?.data?.user) {
            return { status: 401, data: { message: e("unauthorized") } };
        }

        // Check if user already reacted to this comment
        const existingReaction = await prisma.comment_reaction.findUnique({
            where: {
                userId_commentId: {
                    userId: session.data.user.id,
                    commentId,
                },
            },
        })

        if (existingReaction) {
            // Update existing reaction if type is different
            if (existingReaction.type !== type) {
                const updatedReaction = await prisma.comment_reaction.update({
                    where: {
                        id: existingReaction.id,
                    },
                    data: {
                        type,
                    },
                })
                return { success: true, reaction: updatedReaction }
            }

            // Remove reaction if same type (toggle behavior)
            await prisma.comment_reaction.delete({
                where: {
                    id: existingReaction.id,
                },
            })
            return { success: true, removed: true }
        }

        // Create new reaction
        const reaction = await prisma.comment_reaction.create({
            data: {
                type,
                userId: session.data.user.id,
                commentId,
            },
        })

        // Get the blog ID to revalidate the path
        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
            select: { blogId: true },
        })

        if (comment?.blogId) {
            revalidatePath(`/blog/${comment.blogId}`)
        }

        return { success: true, reaction }
    } catch (error) {
        console.error("Error adding reaction:", error)
        return { status: 500, data: { message: e("error") } }
    }
}

