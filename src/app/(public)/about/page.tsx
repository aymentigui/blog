import React from 'react'
import AboutPage from './about'
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "About Me", // Page title for SEO
    description: "Welcome to my web development blog, where I share my passion for Next.js, React, and other modern web technologies. TIGHIOUART Aimen's blog.", // Page description for SEO
    openGraph: {
      title: "About Me - Aimen Blog", // OpenGraph title (used for social media sharing)
      description:
        "Discover more about the developer behind Aimen Blog. Passionate about web development with Next.js, React, and modern technologies. TIGHIOUART Aimen's blog.",
      url: "https://www.aimen-blog.com/about", // Page URL for OpenGraph
      siteName: "Aimen Blog", // Website name
      images: [
        {
          url: "https://www.aimen-blog.com/logo.png", // Image for OpenGraph sharing
          width: 1200,
          height: 630,
          alt: "Logo Aimen Blog", // Image alt text
        },
      ],
    },
    twitter: {
      card: "summary_large_image", // Twitter card type
      title: "About Me", // Twitter title
      description:
        "Learn more about the developer of Aimen Blog and the tech behind it. TIGHIOUART Aimen's blog.",
      images: [
        {
          url: "https://www.aimen-blog.com/logo.png", // Image for Twitter card
        },
      ],
    },
    icons: {
      icon: "/logo.png", // Favicon or icon for the page
    },
  };

const About = () => {
  return (
    <AboutPage />
  )
}

export default About
