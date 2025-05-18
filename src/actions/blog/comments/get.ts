"use server"

import { prisma } from "@/lib/db"
import { getTranslations } from "next-intl/server";

// Get all comments for a blog with nested replies
export async function getCommentsByBlog(blogId: string) {
    const e = await getTranslations('Error');

    try {
        // First get all top-level comments (no parent)
        const comments = await prisma.comment.findMany({
            where: {
                blog_id:blogId,
                parent_id: null,
                deleted_at: null, // Exclude soft-deleted comments
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        image: true,
                    },
                },
                reactions: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        replies: true,
                    },
                },
            },
            orderBy: {
                created_at: "desc",
            },
        })

        return { status: 200, data: comments }
    } catch (error) {
        console.error("Error getting blog comments:", error)
        return { status: 500, data: { message: e("error") } };
    }
}

// Get replies for a specific comment
export async function getCommentReplies(commentId: string) {
    const e = await getTranslations('Error');
    try {
        const replies = await prisma.comment.findMany({
            where: {
                parent_id: commentId,
                deleted_at: null,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        image: true,
                    },
                },
                reactions: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        replies: true,
                    },
                },
            },
            orderBy: {
                created_at: "asc",
            },
        })

        return { status: 200, data: replies }
    } catch (error) {
        console.error("Error getting comment replies:", error)
        return { status: 500, data: { message: e("error") } };
    }
}

// Get comments by user
export async function getCommentsByUser(userId: string) {
    const e = await getTranslations('Error');
    try {
        const comments = await prisma.comment.findMany({
            where: {
                author_id: userId,
                deleted_at: null,
            },
            include: {
                blog: {
                    select: {
                        id: true,
                        slug: true,
                        titles: true,
                    },
                },
                _count: {
                    select: {
                        reactions: true,
                        replies: true,
                    },
                },
            },
            orderBy: {
                created_at: "desc",
            },
        })

        return { success: true, comments }
    } catch (error) {
        console.error("Error getting user comments:", error)
        return { status: 500, data: { message: e("error") } };
    }
}

// Get reactions for a blog (all comments in a blog)
export async function getReactionsByBlog(blogId: string) {
    const e = await getTranslations('Error');
    try {
        const reactions = await prisma.comment_reaction.findMany({
            where: {
                comment: {
                    blog_id:blogId,
                },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        image: true,
                    },
                },
                comment: {
                    select: {
                        id: true,
                        content: true,
                    },
                },
            },
            orderBy: {
                created_at: "desc",
            },
        })

        return { status: 200, data: reactions }
    } catch (error) {
        console.error("Error getting blog reactions:", error)
        return { status: 500, data: { message: e("error") } };
    }
}

// Get reactions by user
export async function getReactionsByUser(userId: string) {
    const e = await getTranslations('Error');
    try {
        const reactions = await prisma.comment_reaction.findMany({
            where: {
                user_id:userId,
            },
            include: {
                comment: {
                    select: {
                        id: true,
                        content: true,
                        blog: {
                            select: {
                                id: true,
                                slug: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                created_at: "desc",
            },
        })

        return { status: 200, data: reactions }
    } catch (error) {
        console.error("Error getting user reactions:", error)
        return { status: 500, data: { message: e("error") } };
    }
}

// Get reactions for a specific comment
export async function getReactionsByComment(commentId: string) {
    const e = await getTranslations('Error');
    try {
        const reactions = await prisma.comment_reaction.findMany({
            where: {
                comment_id:commentId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        image: true,
                    },
                },
            },
            orderBy: {
                created_at: "desc",
            },
        })

        // Group reactions by type for easier frontend display
        const groupedReactions = reactions.reduce(
            (acc, reaction) => {
                if (!acc[reaction.type]) {
                    acc[reaction.type] = []
                }
                acc[reaction.type].push(reaction)
                return acc
            },
            {} as Record<string, typeof reactions>,
        )

        return {
            status: 200,
            data: {
                reactions,
                groupedReactions,
                counts: Object.entries(groupedReactions).map(([type, reactions]) => ({
                    type,
                    count: reactions.length,
                })),
            }
        }
    } catch (error) {
        console.error("Error getting comment reactions:", error)
        return { status: 500, data: { message: e("error") } };
    }
}

