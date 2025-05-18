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
		sitemap: `${process.env.DOMAIN_URL}/sitemap.xml`
	}
}
