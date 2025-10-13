import { Metadata } from "next";
import { getBlogPublic } from "@/actions/blog/get";
import { getLocale, getTranslations } from "next-intl/server";
import { HeartHandshake } from "lucide-react";
import AddViewBlog from "@/components/my/public/add-view-blog";
import SocialShare from "../_components/social-share";
import { verifySession } from "@/actions/permissions";
import AddFavorites from "../_components/add-favorites";
import RemoveFavorites from "../_components/remove-favorites";
import { PreviewBuilderHtml } from "@/components/myui/elements-builder/preview-builder";
import CommentSection from "../_components/comments/comment-section";
import SideBarBlog from "@/components/my/public/sidebar-blog";
import MyImage from "@/components/myui/my-image";

// Server-side function to fetch blog data
export async function generateMetadata({params} : any): Promise<Metadata> {
  const paramsID = await params
  const decodedID = decodeURIComponent(paramsID.id)
  const local = await getLocale();
  const res = await getBlogPublic(undefined, decodedID, local, true);
  
  if (res.status !== 200) return {}; // If not found, return empty metadata
  
  const categories = res.data.categories
    .map((category: any) => category.name)
    .join(", ");
    
  const baseUrl = process.env.DOMAIN_URL || "http://localhost:3000";
  const shareUrl = `${baseUrl}/blogs/${decodedID}`;
  

  return {
    title: res.data.titles[0].title, // Dynamic Title
    description: res.data.description && res.data.description[0] && res.data.description[0].description, // Dynamic Description
    openGraph: {
      title: res.data.titles[0].title,
      description: res.data.description && res.data.description[0] && res.data.description[0].description,
      url: shareUrl,
      siteName: "Aimen Blog",
      images: [
        {
          url: res.data.image || "https://www.aimen-blog.com/logo.png", // Fallback Image
          width: 1200,
          height: 630,
          alt: res.data.titles[0].title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: res.data.titles[0].title,
      description: res.data.description && res.data.description[0] && res.data.description[0].description,
      images: [
        {
          url: res.data.image || "https://www.aimen-blog.com/logo.png", // Fallback Image
        },
      ],
    },
    icons: {
      icon: "/logo.png",
    },
  };
}

const BlogPreview = async ({ params }: any) => {
  const paramsID = await params;
  const decodedID = decodeURIComponent(paramsID.id)
  const local = await getLocale();
  const translate = await getTranslations("BlogPage");
  const e = await getTranslations("Error");
  const session = await verifySession();
  let user = null;
  
  if (session.status === 200 && session.data && session.data.user) {
    user = session.data.user;
  }
  
  if (!decodedID) return null;
  
  const res = await getBlogPublic(undefined, decodedID, local, true);
  
  if (res.status !== 200) return null;
  
  const categories = res.data.categories
    .map((category: any) => category.name)
    .join(", ");
    
  const baseUrl = process.env.DOMAIN_URL || "http://localhost:3000";
  const shareUrl = `${baseUrl}/blogs/${decodedID}`;

  return (
    <div className="p-4 py-8 flex flex-col lg:flex-row gap-2 overflow-auto">
      <AddViewBlog id={res.data.id} />
      {/* content blog */}
      <div className="w-full lg:w-4/4 px-4">
        <div className="my-4 relative overflow-hidden">
          <MyImage classNameProps="w-full h-[300px] lg:h-[400px] bg-accent" objet_fit="object-contain" image={res.data.image} />
          <div className="absolute w-full flex items-center justify-between gap-2 p-4 top-0 right-0">
            <div className="flex items-center gap-1">{res.data.blog_favorites ? res.data.blog_favorites.length : 0}<HeartHandshake className="text-red-500" size={15} /></div>
            <div className="flex items-center gap-2">
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
        <CommentSection blogId={res.data.id} />
      </div>
    </div>
  )
}

export default BlogPreview;
