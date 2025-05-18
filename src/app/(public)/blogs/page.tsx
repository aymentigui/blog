import React from 'react'
import BlogPage from './blogs'
import { Metadata } from 'next'


export const metadata: Metadata = {
    title: "Latest Articles on Web Development", // Title for SEO
    description:
        "Explore the latest articles, tutorials, and tips on web development, React.js, Next.js, PHP, and more. Learn new techniques and improve your web development skills.",
    openGraph: {
        title: "Aimen Blog - Latest Articles on Web Development", // OpenGraph title
        description:
            "Discover tutorials, tips, and articles on web development, React.js, Next.js, PHP, and much more.",
        url: "https://www.aimen-blog.com/blogs", // URL for the Blogs page
        siteName: "Aimen Blog",
        images: [
            {
                url: "https://www.aimen-blog.com/logo.png", // Image for OpenGraph sharing
                width: 1200,
                height: 630,
                alt: "Aimen Blog Logo", // Image alt text
            },
        ],
    },
    twitter: {
        card: "summary_large_image", // Twitter card type
        title: "Latest Articles on Web Development", // Twitter title
        description:
            "Explore tutorials, tips, and articles on web development with Next.js, React.js, PHP, and more.",
        images: [
            {
                url: "https://www.aimen-blog.com/logo.png", // Image for Twitter card
            },
        ],
    },
    icons: {
        icon: "/logo.png", // Favicon for the page
    },
}

const Page = () => {
    return (
        <BlogPage />
    )
}

export default Page
