import { Metadata } from "next"
import { getLocale, getTranslations } from "next-intl/server"
import { getProjectPublic } from "@/actions/project/get"
import MyImage from "@/components/myui/my-image"
import { HeartHandshake } from "lucide-react"
import AddViewProject from "@/components/my/public/add-view-project"
import SocialShare from "../_components/social-share"
import { PreviewBuilderHtml } from "@/components/myui/elements-builder/preview-builder"

// Server-side function to fetch project data
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const paramsID = await params
  const decodedID = decodeURIComponent(paramsID.id)
  const local = await getLocale()
  const res = await getProjectPublic(undefined, decodedID, local, true)

  if (res.status !== 200) return {} // If project not found, return empty metadata

  const categories = res.data.categories
    .map((category: any) => category.name)
    .join(", ")

  const baseUrl = process.env.DOMAIN_URL || "http://localhost:3000"
  const shareUrl = `${baseUrl}/projects/${decodedID}`

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
      icon: "/logo.png", // Favicon
    },
  }
}

const ProjectPreview = async ({ params }: any) => {
  const paramsID = await params
  const decodedID = decodeURIComponent(paramsID.id); 
  const local = await getLocale()
  const translate = await getTranslations("BlogPage")
  const e = await getTranslations("Error")

  if (!decodedID) {
    console.log("ID not found")
    return null
  }

  const res = await getProjectPublic(undefined, decodedID, local, true)
  if (res.status !== 200) {
    console.log(res)
    return null
  }

  const categories = res.data.categories
    .map((category: any) => category.name)
    .join(", ");

  const baseUrl = process.env.DOMAIN_URL || "http://localhost:3000"
  const shareUrl = `${baseUrl}/projects/${decodedID}`

  return (
    <div className="p-4 py-8 flex gap-2 overflow-auto">
      <AddViewProject id={res.data.id} />
      {/* Project content */}
      <div className="w-full px-4">
        <div className="my-4 relative overflow-hidden">
          <MyImage classNameProps="w-full h-[300px] lg:h-[400px] bg-accent" objet_fit="object-contain" image={res.data.image} />
          <div className="absolute w-full flex items-center justify-between gap-2 p-4 top-0 right-0">
            <div className="flex items-center gap-2">
              <SocialShare
                title={res.data.titles[0].title}
                description={res.data.description && res.data.description[0] ? res.data.description[0].description : ""}
                url={shareUrl}
              />
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
          {res.data.contents.map((content: any, index: number) => (
            <div key={index}>
              <PreviewBuilderHtml id={content.id} type={content.type} value={JSON.parse(content.data)} />
            </div>
          ))}
        </div>
        <div className="my-8 flex">
          <div>
            <p className="mb-2 text-gray-600">{translate("likethisproject")}</p>
            <SocialShare
              title={res.data.titles[0].title}
              description={res.data.description && res.data.description[0] ? res.data.description[0].description : ""}
              url={shareUrl}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectPreview
