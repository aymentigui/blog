import React from 'react'
import ProjectPage from './projects'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: "Web Development Projects", // Title for SEO
    description:
        "Explore the collection of my personal and professional web development projects. Learn about the technologies, tools, and techniques used in each project.",
    openGraph: {
        title: "Aimen Blog - Web Development Projects", // OpenGraph title
        description:
            "Discover my web development projects, including Next.js, React.js, and full-stack web applications built with modern technologies.",
        url: "https://www.aimen-blog.com/projects", // URL for the Projects page
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
        title: "Web Development Projects", // Twitter title
        description:
            "Explore my personal and professional projects, built with Next.js, React, and other modern web technologies.",
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
        <ProjectPage />
    )
}

export default Page
