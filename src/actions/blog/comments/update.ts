"use server"

import { verifySession } from "@/actions/permissions"
import { prisma } from "@/lib/db"
import { getTranslations } from "next-intl/server"
import { revalidatePath } from "next/cache"

// Update a comment
export async function updateComment({
  id,
  content,
}: {
  id: string
  content: string
}) {

    const e = await getTranslations('Error');
    const b = await getTranslations('Blogs');
  try {
    const session = await verifySession()

    if (!session?.data?.user) {
        return { status: 401, data: { message: e("unauthorized") } };
    }

    // Find the comment first to check ownership and get blogId
    const existingComment = await prisma.comment.findUnique({
      where: { id },
      select: { author_id: true, blog_id: true },
    })

    if (!existingComment) {
      return { status: 401, data: { message: b("commentnotfound") } }
    }

    // Check if user is the author of the comment or an admin
    if (existingComment.author_id !== session.data.user.id && !session.data.user.isAdmin) {
      return { status: 401, data: { message: e("unauthorized") } };
    }

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: {
        content,
        updated_at: new Date(),
      },
    })

    revalidatePath(`/blogs/${existingComment.blog_id}`)
    return { status: 200, data: { message: "" }, comment: updatedComment }
  } catch (error) {
    console.error("Error updating comment:", error)
    return { status: 500, data: { message: e("error") } };
  }
}

