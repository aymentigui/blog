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
                select: { parent_id: true },
            })
            if (parentComment && parentComment.parent_id) {
                return { status: 400, data: { message:  b("errorreplaytoreplay")} }
            }
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                blog_id:blogId,
                author_id: session.data.user.id,
                parent_id: parentId || null,
            },
        })

        revalidatePath(`/blogs/${blogId}`)
        return { status: 200, data: { message: "" }, comment: comment }
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
                user_id_comment_id: {
                    user_id: session.data.user.id,
                    comment_id:commentId,
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
                return { status:200, reaction: updatedReaction }
            }

            // Remove reaction if same type (toggle behavior)
            await prisma.comment_reaction.delete({
                where: {
                    id: existingReaction.id,
                },
            })
            return { status:200, removed: true }
        }

        // Create new reaction
        const reaction = await prisma.comment_reaction.create({
            data: {
                type,
                user_id: session.data.user.id,
                comment_id:commentId,
            },
        })

        // Get the blog ID to revalidate the path
        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
            select: { blog_id: true },
        })

        if (comment?.blog_id) {
            revalidatePath(`/blogs/${comment.blog_id}`)
        }

        return { status: 200, data: { message: "" }, reaction }
    } catch (error) {
        console.error("Error adding reaction:", error)
        return { status: 500, data: { message: e("error") } }
    }
}

