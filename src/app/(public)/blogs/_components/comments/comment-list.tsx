"use client"
import CommentItem from "./comment-item"

interface CommentListProps {
  comments: any[]
  blogId: string
  isReplies?: boolean
}

export default function CommentList({ comments, blogId, isReplies = false }: CommentListProps) {
  if (!comments.length && !isReplies) {
    return (
      <div className="py-6 text-center text-muted-foreground">
        <p>Be the first to comment!</p>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${isReplies ? "mt-4 w-full" : ""}`}>
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} blogId={blogId} />
      ))}
    </div>
  )
}
