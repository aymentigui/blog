"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTranslations } from "next-intl"
import HeaderPublic from "@/components/my/public/header"
import CardBlogAnimate from "@/components/my/public/card-blog-animate"
import CardCategoryAnimate from "@/components/my/public/card-category-animate"
import Loading from "@/components/myui/loading"
import { fetchBlogs, fetchCategories } from "@/actions/blog/util-client"
import FooterPublic from "@/components/my/footer-from"
import AddViewPage from "@/components/my/public/add-view-page"



// const recentArticles = [
//   {
//     id: 4,
//     title: "Utiliser TypeScript avec React: Guide complet",
//     excerpt: "Comment tirer le meilleur parti de TypeScript dans vos projets React pour un code plus robuste.",
//     category: "TypeScript",
//     date: "2 Avril 2025",
//     readTime: "10 min",
//     image: "/placeholder.svg?height=300&width=500",
//     slug: "/blog/typescript-react-guide",
//   },
//   {
//     id: 5,
//     title: "Créer un thème sombre avec Tailwind CSS",
//     excerpt: "Implémentez facilement un mode sombre/clair dans votre application Next.js avec Tailwind CSS.",
//     category: "CSS",
//     date: "28 Mars 2025",
//     readTime: "7 min",
//     image: "/placeholder.svg?height=300&width=500",
//     slug: "/blog/theme-sombre-tailwind",
//   },
//   {
//     id: 6,
//     title: "Les Server Actions dans Next.js expliqués",
//     excerpt: "Tout ce que vous devez savoir sur les Server Actions et comment les utiliser efficacement.",
//     category: "Next.js",
//     date: "25 Mars 2025",
//     readTime: "9 min",
//     image: "/placeholder.svg?height=300&width=500",
//     slug: "/blog/server-actions-nextjs",
//   },
//   {
//     id: 7,
//     title: "Migration de WordPress vers Next.js",
//     excerpt: "Guide étape par étape pour migrer votre site WordPress vers une application Next.js moderne.",
//     category: "WordPress",
//     date: "20 Mars 2025",
//     readTime: "12 min",
//     image: "/placeholder.svg?height=300&width=500",
//     slug: "/blog/migration-wordpress-nextjs",
//   },
// ]

// const components = [
//   {
//     id: 1,
//     title: "Carousel d'images responsive",
//     description: "Un composant de carousel d'images entièrement responsive avec navigation tactile.",
//     category: "UI",
//     downloads: 1245,
//     slug: "/components/image-carousel",
//   },
//   {
//     id: 2,
//     title: "Formulaire d'authentification",
//     description: "Un formulaire d'authentification complet avec validation et gestion des erreurs.",
//     category: "Auth",
//     downloads: 987,
//     slug: "/components/auth-form",
//   },
//   {
//     id: 3,
//     title: "Tableau de données avancé",
//     description: "Un tableau de données avec tri, filtrage et pagination côté client.",
//     category: "Data",
//     downloads: 756,
//     slug: "/components/data-table",
//   },
// ]


export default function HomePage() {
  const translate = useTranslations("HomePage")

  const [blogs, setBlogs] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const [categories, setCategories] = useState<any[]>([])
  const [isLoadingC, setIsLoadingC] = useState(false)

  // const [searchQuery, setSearchQuery] = useState("")

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  useEffect(() => {
    fetchBlogs(setBlogs, setIsLoading, 1, 3, undefined, "", [], "popular")
    fetchCategories(setCategories, setIsLoadingC)
  }, [])



  return (
    <div className="flex flex-col min-h-screen">
      <AddViewPage name="home" />
      <HeaderPublic />
      <div className="h-10"></div>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 theme-ocean:from-purple-950/20 dark:to-pink-950/20 theme-ocean:to-pink-950/20 -z-10" />
        <div className="absolute inset-0 bg-[url('/blog-landing.webp?height=100&width=100')] bg-repeat opacity-5 -z-10" />

        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="container px-4 mx-auto text-center">
          <Badge className="mb-4 bg-purple-100 text-purple-800 dark:bg-purple-900 theme-ocean:bg-purple-900 dark:text-purple-100 theme-ocean:text-purple-100 hover:bg-purple-100 dark:hover:bg-purple-900 theme-ocean:hover:bg-purple-900">
            Next.js • React • TypeScript • JavaScript • PHP • WordPress
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {translate("title")}
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 theme-ocean:text-gray-300 max-w-3xl mx-auto mb-8">
            {translate("description")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href={"/blogs"}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {translate("browserarticles")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            {/* <Button size="lg" variant="outline">
              {translate("browsercomponents")}
            </Button> */}
          </div>

          {/* <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Rechercher des articles, composants..."
                className="pl-10 pr-4 py-6 rounded-full border-gray-300 dark:border-gray-700 theme-ocean:border-gray-700 focus:ring-2 focus:ring-purple-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div> */}
        </motion.div>
      </section>

      {/* Featured Articles */}
      <section className="py-16 bg-white dark:bg-gray-950 theme-ocean:bg-background">
        <div className="container px-4 mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="flex flex-col md:flex-row justify-between items-center mb-12"
          >
            <h2 className="text-3xl font-bold">{translate("articlesmostviewed")}</h2>
            <Link
              href="/blogs"
              className="text-purple-600 dark:text-purple-400 theme-ocean:text-purple-400 hover:underline flex items-center mt-4 md:mt-0"
            >
              {translate("allarticles")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </motion.div>

          {
            isLoading
              ? <div className=" w-full h-24 flex justify-center items-center">
                <Loading />
              </div>
              : <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                {blogs.map((article, index) => (
                  <CardBlogAnimate key={index} article={article} />
                ))}
              </motion.div>
          }
        </div>
      </section>

      {/* Categories */}
      {
        isLoadingC
          ?
          <section className="py-16 bg-gray-50 flex justify-center items-center dark:bg-gray-900 theme-ocean:bg-gray-900">
            <Loading />
          </section>
          :
          categories.length > 0 &&
          <section className="py-16 bg-gray-50 dark:bg-gray-900 theme-ocean:bg-gray-900">
            <div className="container px-4 mx-auto">
              <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-3xl font-bold text-center mb-12"
              >
                {translate("browsercategories")}
              </motion.h2>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {categories.map((category, index): any => (
                  <CardCategoryAnimate key={index} index={index} title={category.title} />
                ))}
              </motion.div>
            </div>
          </section>
      }

      {/* Recent Content Tabs */}
      {/* <section className="py-16 bg-white dark:bg-gray-950 theme-ocean:bg-gray-950">
        <div className="container px-4 mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12"
          >
            Contenu récent
          </motion.h2>

          <Tabs defaultValue="articles" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
              <TabsTrigger value="articles">Articles</TabsTrigger>
              <TabsTrigger value="components">Composants</TabsTrigger>
            </TabsList>

            <TabsContent value="articles">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {recentArticles.map((article) => (
                  <motion.div key={article.id} variants={fadeIn} whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                    <Link href={article.slug}>
                      <Card className="overflow-hidden flex flex-col md:flex-row h-full hover:shadow-lg transition-shadow duration-300">
                        <div className="relative h-48 md:h-auto md:w-1/3 flex-shrink-0">
                          <Image
                            src={article.image || "/placeholder.svg"}
                            alt={article.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 p-6">
                          <Badge className="mb-2">{article.category}</Badge>
                          <h3 className="text-lg font-bold mb-2 line-clamp-2">{article.title}</h3>
                          <p className="text-gray-600 dark:text-gray-400 theme-ocean:text-gray-400 text-sm line-clamp-2 mb-2">
                            {article.excerpt}
                          </p>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 theme-ocean:text-gray-400 mt-auto">
                            <span>{article.date}</span>
                            <span className="mx-2">•</span>
                            <span>{article.readTime} de lecture</span>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="components">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {components.map((component) => (
                  <motion.div
                    key={component.id}
                    variants={fadeIn}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link href={component.slug}>
                      <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                        <CardContent className="pt-6">
                          <Badge className="mb-2">{component.category}</Badge>
                          <h3 className="text-xl font-bold mb-2">{component.title}</h3>
                          <p className="text-gray-600 dark:text-gray-400 theme-ocean:text-gray-400 mb-4">{component.description}</p>
                          <div className="text-sm text-gray-500 dark:text-gray-400 theme-ocean:text-gray-400">
                            {component.downloads} téléchargements
                          </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                          <span className="text-purple-600 dark:text-purple-400 theme-ocean:text-purple-400 font-medium flex items-center">
                            Voir le composant
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </span>
                        </CardFooter>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </section> */}

      {/* Arabic Content Section */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 theme-ocean:from-purple-950/20 dark:to-pink-950/20 theme-ocean:to-pink-950/20">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <Badge className="mb-4 bg-purple-100 text-purple-800 dark:bg-purple-900 theme-ocean:bg-purple-900 dark:text-purple-100 theme-ocean:text-purple-100 hover:bg-purple-100 dark:hover:bg-purple-900 theme-ocean:hover:bg-purple-900">
              محتوى باللغة العربية
            </Badge>
            <h2 className="text-3xl font-bold mb-4">{translate("contentarabictitle")}</h2>
            <p className="text-gray-700 dark:text-gray-300 theme-ocean:text-gray-300 mb-8">
              {translate("contentarabicdescription")}
            </p>
            <Link href="https://instagram.com/tigui_tech" target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {translate("viewininstagram")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Newsletter */}
      <FooterPublic />
    </div>
  )
}
