import "./globals.css";
import { Cairo } from "next/font/google";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { ThemeProvider } from "@/components/providers/theme-provider";
import DivStart from "@/components/my/public/div-start";

const cairo = Cairo({
  subsets: ['latin'], // Sous-ensembles pour les caractères spécifiques
  weight: ['400', '700'], // Ajouter les épaisseurs nécessaires (normal, bold)
});
export const metadata : Metadata = {
  title: {
    default :"Aimen Blog - Développement Web, React, Next.js et Projets",
    template: "%s - Aimen Blog"
  },
  description:
    "Articles sur le développement web avec Next.js, PHP, WordPress, React JS et projets personnels.",
  openGraph: {
    title: "Aimen Blog - Développement Web, React, Next.js et Projets",
    description:
      "Découvrez des articles sur le développement web avec Next.js, PHP, WordPress, React JS, et plus encore.",
    url: "https://www.aimen-blog.com",
    siteName: "Aimen Blog",
    images: [
      {
        url: "https://www.aimen-blog.com/logo.png",
        width: 1200,
        height: 630,
        alt: "Logo Aimen Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aimen Blog - Développement Web, React, Next.js et Projets",
    description:
      "Articles sur le développement web, Next.js, React JS, PHP et plus.",
    images: [
      {
        url : "https://www.aimen-blog.com/logo.png"
      }
    ],
  },
  icons: {
    icon: "/logo.png",
  },
};


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html suppressHydrationWarning lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body
        className={`
          ${cairo.className}
          antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
             <DivStart />
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
        <div><Toaster /></div>
      </body>
    </html>
  );
}
