import { getBlogPublic } from "@/actions/blog/get"
import BlogImage from "@/components/myui/blog-image"
import { PreviewBuilderHtml } from "@/components/myui/elements-builder/preview-builder"
import { getLocale } from "next-intl/server"
import CommentSection from "../_components/comments/comment-section"

const BlogPreview = async ({ params }: any) => {
  const paramsID = await params
  const local = await getLocale()

  if (!paramsID.id) return null

  const res = await getBlogPublic(paramsID.id,undefined,undefined,true)

  if (res.status !== 200) return null

  const categories = res.data.categories
    .map((category: any) => {
      if (local === "en") {
        return category.name
      } else if (local === "fr") {
        return category.namefr ?? category.name
      } else if (local === "ar") {
        return category.namear ?? category.name
      }
      return category.name
    })
    .join(", ")

  return (
    <div className="p-4 py-8 flex gap-2 overflow-auto">
      {/* content blog */}
      <div className="w-3/4 px-4">
        <div className="h-72 overflow-hidden">
          <BlogImage image={res.data.image} />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{res.data.titles[0].title}</h1>
          <div className="text-xs mb-2">{categories}</div>
          <p>{res.data.description[0].description}</p>
        </div>
        <div>
          <div>
            {res.data.contents.map((content: any,index:number) => (
              <div key={index}>
                <PreviewBuilderHtml id={content.id} type={content.type} value={JSON.parse(content.data)} />
              </div>
            ))}
          </div>
        </div>

        {/* Comment Section */}
        <CommentSection blogId={paramsID.id} />
      </div>

      {/* sidebar */}
      <div className="w-1/4 border rounded-sm p-2 min-h-full">
        <div className="h-72 overflow-hidden">
          <BlogImage image={res.data.image} />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{res.data.titles[0].title}</h1>
          <p>{res.data.description[0].description}</p>
        </div>
      </div>
    </div>
  )
}

export default BlogPreview
