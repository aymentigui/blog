import { MetadataRoute } from "next";

export default async function robots(): Promise<MetadataRoute.Robots> {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: ["/admin"]
			}
		],
		sitemap: `https://aimen-blog.com/sitemap.xml`
	}
}
