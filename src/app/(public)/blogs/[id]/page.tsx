import { getBlogPublic } from "@/actions/blog/get"
import { PreviewBuilderHtml } from "@/components/myui/elements-builder/preview-builder"
import { getLocale, getTranslations } from "next-intl/server"
import CommentSection from "../_components/comments/comment-section"
import SideBarBlog from "@/components/my/public/sidebar-blog"
import AddViewBlog from "@/components/my/public/add-view-blog"
import MyImage from "@/components/myui/my-image"
import { HeartHandshake } from "lucide-react"
import { verifySession } from "@/actions/permissions"
import AddFavorites from "../_components/add-favorites"
import RemoveFavorites from "../_components/remove-favorites"
import SocialShare from "../_components/social-share"

const BlogPreview = async ({ params }: any) => {
  const paramsID = await params
  const local = await getLocale()
  const translate = await getTranslations("BlogPage")
  const e = await getTranslations("Error")
  const session = await verifySession()
  let user = null
  if (session.status === 200 && session.data && session.data.user) {
    user = session.data.user
  }
  if (!paramsID.id) return null
  const res = await getBlogPublic(undefined, paramsID.id, local, true)
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
  
  // URL complète pour le partage
  const baseUrl = process.env.DOMAIN_URL || "http://localhost:3000"
  const shareUrl = `${baseUrl}/blogs/${paramsID.id}`
  
  return (
    <div className="p-4 py-8 flex gap-2 overflow-auto">
      <AddViewBlog id={res.data.id} />
      {/* content blog */}
      <div className="w-3/4 px-4">
        <div className="h-72 relative overflow-hidden">
          <MyImage image={res.data.image} />
          <div className="absolute w-full flex items-center justify-between gap-2 p-4 top-0 right-0">
            <div className="flex items-center gap-1">{res.data.blog_favorites ? res.data.blog_favorites.length : 0}<HeartHandshake className="text-red-500" size={15} /></div>
            <div className="flex items-center gap-2">
              {/* Composant de partage social */}
              <SocialShare 
                title={res.data.titles[0].title}
                description={res.data.description && res.data.description[0] ? res.data.description[0].description : ""}
                url={shareUrl}
              />
              {user && (
                <>
                  {res.data.blog_favorites && res.data.blog_favorites.some((favorite: any) => favorite.user_id === user.id)
                    ? <RemoveFavorites idBlog={res.data.id} />
                    : <AddFavorites idBlog={res.data.id} />
                  }
                </>
              )}
            </div>
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold">{res.data.titles[0].title}</h1>
          <div className="flex justify-between items-center">
            <div className="text-xs mb-2">{categories}</div>
            {/* Version mobile du bouton de partage */}
            <div className="md:hidden">
              <SocialShare
                title={res.data.titles[0].title}
                description={res.data.description && res.data.description[0] ? res.data.description[0].description : ""}
                url={shareUrl}
              />
            </div>
          </div>
          <p>{res.data.description && res.data.description[0] && res.data.description[0].description ? res.data.description[0].description : ""}</p>
        </div>
        <div>
          <div>
            {res.data.contents.map((content: any, index: number) => (
              <div key={index}>
                <PreviewBuilderHtml id={content.id} type={content.type} value={JSON.parse(content.data)} />
              </div>
            ))}
          </div>
        </div>
        {/* Section de partage en bas de l'article */}
        <div className="my-8 flex ">
          <div className="">
            <p className="mb-2 text-gray-600">{translate("likethisarticle")}</p>
            <SocialShare 
              title={res.data.titles[0].title}
              description={res.data.description && res.data.description[0] ? res.data.description[0].description : ""}
              url={shareUrl}
            />
          </div>
        </div>
        {/* Comment Section */}
        <CommentSection blogId={res.data.id} />
      </div>
      {/* sidebar */}
      <SideBarBlog />
    </div>
  )
}

export default BlogPreview