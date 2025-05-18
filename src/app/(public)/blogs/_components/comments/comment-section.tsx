import { getCommentsByBlog } from "@/actions/blog/comments/get"
import CommentForm from "./comment-form"
import CommentList from "./comment-list"
import { verifySession } from "@/actions/permissions"
import { getTranslations } from "next-intl/server"

interface CommentSectionProps {
  blogId: string
}

export default async function CommentSection({ blogId }: CommentSectionProps) {
  const session = await verifySession()
  const translate = await getTranslations("Blogs")
  let { data = [] } = await getCommentsByBlog(blogId).then((res) => (res.status==200 && res.data  ? res : { data: [] }))

  if( !Array.isArray(data))
    data = []

  return (
    <div className="mt-10 space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold">{translate("comments")} ({data.length})</h2>
      </div>

      {session?.data.user ? (
        <CommentForm blogId={blogId} />
      ) : (
        <div className="bg-muted p-4 rounded-md text-center">
          <p>{translate("mustsignintocomment")}</p>
        </div>
      )}

      <CommentList comments={data} blogId={blogId} />
    </div>
  )
}
