import React from 'react'
import ContactPage from './contact'
import { Metadata } from 'next'
import { ReCaptchaProvider } from '@/components/providers/recaptcha-provider'

export const metadata: Metadata = {
  title: "Contact Me - Aimen Blog", // Title for SEO
  description:
    "Do you have a question about an article? Want to collaborate on a project? Or simply discuss web development? Feel free to contact me!", // Description for SEO
  openGraph: {
    title: "Contact Me", // OpenGraph title
    description:
      "Get in touch with me for questions, collaborations, or to discuss web development topics.",
    url: "https://www.aimen-blog.com/contact", // URL for the Contact page
    siteName: "Aimen Blog",
    images: [
      {
        url: "https://www.aimen-blog.com/logo.png", // Image for OpenGraph sharing
        width: 1200,
        height: 630,
        alt: "Aimen Blog Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image", // Twitter card type
    title: "Contact Me", // Twitter title
    description:
      "Have a question or project in mind? Reach out to me for collaboration or discussions on web development.",
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
    <ReCaptchaProvider>
      <ContactPage />
    </ReCaptchaProvider>
  )
}

export default Page
