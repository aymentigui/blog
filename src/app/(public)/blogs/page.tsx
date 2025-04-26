"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Search, Filter, ArrowUpDown, Eye, Clock, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTranslations } from "next-intl"
import { fetchBlogs, fetchCategories } from "@/actions/blog/util-client"
import Loading from "@/components/myui/loading"
import TablePagination from "@/components/myui/table/pagination"
import CardBlogAnimate from "@/components/my/public/card-blog-animate"

// Types
type Article = {
    id: number
    title: string
    excerpt: string
    category: string
    date: string
    readTime: string
    image: string
    slug: string
    views: number
}

// type Category = {
//     name: string
//     color: string
// }

// Données simulées
const allArticles: Article[] = [
    {
        id: 1,
        title: "Comment utiliser les Server Components dans Next.js 15",
        excerpt:
            "Découvrez les nouvelles fonctionnalités des Server Components et comment les utiliser efficacement dans vos projets Next.js 15.",
        category: "Next.js",
        date: "2025-04-15",
        readTime: "8 min",
        image: "/placeholder.svg?height=400&width=600",
        slug: "/blog/server-components-nextjs-15",
        views: 1250,
    },
    {
        id: 2,
        title: "Créer des animations fluides avec Framer Motion",
        excerpt:
            "Un guide complet pour intégrer des animations professionnelles dans vos applications React avec Framer Motion.",
        category: "React",
        date: "2025-04-10",
        readTime: "6 min",
        image: "/placeholder.svg?height=400&width=600",
        slug: "/blog/animations-framer-motion",
        views: 980,
    },
    {
        id: 3,
        title: "Les meilleures pratiques pour l'optimisation des images dans Next.js",
        excerpt: "Apprenez à optimiser vos images pour des performances optimales et un meilleur référencement.",
        category: "Performance",
        date: "2025-04-05",
        readTime: "5 min",
        image: "/placeholder.svg?height=400&width=600",
        slug: "/blog/optimisation-images-nextjs",
        views: 750,
    },
    {
        id: 4,
        title: "Utiliser TypeScript avec React: Guide complet",
        excerpt: "Comment tirer le meilleur parti de TypeScript dans vos projets React pour un code plus robuste.",
        category: "TypeScript",
        date: "2025-04-02",
        readTime: "10 min",
        image: "/placeholder.svg?height=300&width=500",
        slug: "/blog/typescript-react-guide",
        views: 1100,
    },
    {
        id: 5,
        title: "Créer un thème sombre avec Tailwind CSS",
        excerpt: "Implémentez facilement un mode sombre/clair dans votre application Next.js avec Tailwind CSS.",
        category: "CSS",
        date: "2025-03-28",
        readTime: "7 min",
        image: "/placeholder.svg?height=300&width=500",
        slug: "/blog/theme-sombre-tailwind",
        views: 890,
    },
    {
        id: 6,
        title: "Les Server Actions dans Next.js expliqués",
        excerpt: "Tout ce que vous devez savoir sur les Server Actions et comment les utiliser efficacement.",
        category: "Next.js",
        date: "2025-03-25",
        readTime: "9 min",
        image: "/placeholder.svg?height=300&width=500",
        slug: "/blog/server-actions-nextjs",
        views: 1500,
    },
    {
        id: 7,
        title: "Migration de WordPress vers Next.js",
        excerpt: "Guide étape par étape pour migrer votre site WordPress vers une application Next.js moderne.",
        category: "WordPress",
        date: "2025-03-20",
        readTime: "12 min",
        image: "/placeholder.svg?height=300&width=500",
        slug: "/blog/migration-wordpress-nextjs",
        views: 2200,
    },
    {
        id: 8,
        title: "Créer une API REST avec Next.js",
        excerpt: "Apprenez à créer une API REST complète en utilisant les API Routes de Next.js.",
        category: "API",
        date: "2025-03-15",
        readTime: "11 min",
        image: "/placeholder.svg?height=300&width=500",
        slug: "/blog/api-rest-nextjs",
        views: 950,
    },
    {
        id: 9,
        title: "Authentification avec NextAuth.js",
        excerpt: "Implémentez un système d'authentification robuste avec NextAuth.js dans votre application Next.js.",
        category: "Auth",
        date: "2025-03-10",
        readTime: "14 min",
        image: "/placeholder.svg?height=300&width=500",
        slug: "/blog/nextauth-authentication",
        views: 1800,
    },
    {
        id: 10,
        title: "Déployer une application Next.js sur Vercel",
        excerpt: "Guide complet pour déployer et configurer votre application Next.js sur la plateforme Vercel.",
        category: "Déploiement",
        date: "2025-03-05",
        readTime: "8 min",
        image: "/placeholder.svg?height=300&width=500",
        slug: "/blog/deploiement-nextjs-vercel",
        views: 1350,
    },
    {
        id: 11,
        title: "Utiliser les Middleware dans Next.js",
        excerpt: "Comment tirer parti des Middleware pour gérer les requêtes avant qu'elles n'atteignent vos pages.",
        category: "Next.js",
        date: "2025-03-01",
        readTime: "9 min",
        image: "/placeholder.svg?height=300&width=500",
        slug: "/blog/middleware-nextjs",
        views: 780,
    },
    {
        id: 12,
        title: "Optimisation SEO avec Next.js",
        excerpt: "Stratégies et techniques pour améliorer le référencement de votre application Next.js.",
        category: "SEO",
        date: "2025-02-25",
        readTime: "10 min",
        image: "/placeholder.svg?height=300&width=500",
        slug: "/blog/seo-nextjs",
        views: 2100,
    },
    {
        id: 13,
        title: "Gestion d'état avec Zustand",
        excerpt: "Découvrez comment utiliser Zustand pour une gestion d'état simple et efficace dans React.",
        category: "React",
        date: "2025-02-20",
        readTime: "7 min",
        image: "/placeholder.svg?height=300&width=500",
        slug: "/blog/zustand-state-management",
        views: 1050,
    },
    {
        id: 14,
        title: "Tests unitaires avec Jest et React Testing Library",
        excerpt: "Guide complet pour tester vos composants React avec Jest et React Testing Library.",
        category: "Testing",
        date: "2025-02-15",
        readTime: "13 min",
        image: "/placeholder.svg?height=300&width=500",
        slug: "/blog/tests-jest-react-testing-library",
        views: 920,
    },
    {
        id: 15,
        title: "Créer un blog avec Next.js et MDX",
        excerpt: "Apprenez à créer un blog moderne avec Next.js et MDX pour gérer votre contenu.",
        category: "Next.js",
        date: "2025-02-10",
        readTime: "11 min",
        image: "/placeholder.svg?height=300&width=500",
        slug: "/blog/blog-nextjs-mdx",
        views: 1650,
    },
]

// const categories: Category[] = [
//     { name: "Next.js", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100" },
//     { name: "React", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100" },
//     { name: "TypeScript", color: "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-100" },
//     { name: "CSS", color: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100" },
//     { name: "WordPress", color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100" },
//     { name: "Performance", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" },
//     { name: "API", color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100" },
//     { name: "Auth", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100" },
//     { name: "Déploiement", color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100" },
//     { name: "SEO", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100" },
//     { name: "Testing", color: "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-100" },
// ]

export default function BlogPage() {
    const translate = useTranslations("BlogPage")


    const [blogs, setBlogs] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const [categories, setCategories] = useState<any[]>([])
    const [isLoadingC, setIsLoadingC] = useState(false)

    // États pour les filtres et la pagination
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [sortBy, setSortBy] = useState<"recent" | "popular">("recent")
    const [currentPage, setCurrentPage] = useState(1)
    const [count, setCount] = useState(0)

    const articlesPerPage = 6

    // Effet pour mettre à jour la recherche debouncée
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearchQuery(searchQuery), 500)
        return () => clearTimeout(timer)
    }, [searchQuery])

    // Effet pour filtrer les articles
    useEffect(() => {
        fetchBlogs(setBlogs, setIsLoading, currentPage, articlesPerPage, setCount, debouncedSearchQuery, selectedCategories, sortBy)
    }, [debouncedSearchQuery, selectedCategories, sortBy])

    // Effet pour paginer les articles filtrés


    useEffect(() => {
        fetchBlogs(setBlogs, setIsLoading, currentPage, 9, setCount, debouncedSearchQuery, selectedCategories, sortBy)
        fetchCategories(setCategories, setIsLoadingC)
    }, [])

    // Gestionnaires d'événements
    const handleCategoryToggle = (category: string) => {
        setSelectedCategories((prev) =>
            prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
        )
    }

    const handleClearFilters = () => {
        setSearchQuery("")
        setSelectedCategories([])
        setSortBy("recent")
    }

    const getCategoryStyle = (category: string) => {
        const categoryObj = categories.find((c) => c.name === category)
        return categoryObj?.color || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
    }

    // Animations
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4 },
        },
        exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
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

    return (
        <div className="container mx-auto py-12 px-4 md:px-6">
            <motion.div initial="hidden" animate="visible" variants={fadeIn} className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {translate("title")}
                </h1>
                <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mb-8"></div>
                <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                    {translate("subtitle")}
                </p>
            </motion.div>

            {/* Filtres et recherche */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-12 space-y-6"
            >
                {/* Barre de recherche */}
                <div className="relative max-w-md mx-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                        type="text"
                        placeholder={translate("searchplaceholder")}
                        className="pl-10 pr-4 py-6 rounded-full border-gray-300 dark:border-gray-700"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>

                {/* Filtres et tri */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Filter className="h-5 w-5 text-gray-500" />
                        <span className="text-sm font-medium">{translate("filterby")}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-center">
                        {isLoadingC
                            ? <Loading classSizeProps="h-4 w-4" />
                            : categories.map((category) => (
                                <Badge
                                    key={category.id}
                                    className={`cursor-pointer ${selectedCategories.includes(category.id)
                                        ? category.color
                                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100 opacity-70"
                                        } hover:opacity-100 transition-opacity`}
                                    onClick={() => handleCategoryToggle(category.id)}
                                >
                                    {category.title}
                                </Badge>
                            ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <ArrowUpDown className="h-4 w-4 text-gray-500" />
                            <Select value={sortBy} onValueChange={(value) => setSortBy(value as "recent" | "popular")}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder={translate("sortby")} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="recent">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            <span>{translate("newest")}</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="popular">
                                        <div className="flex items-center gap-2">
                                            <Eye className="h-4 w-4" />
                                            <span>{translate("popular")}</span>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {(searchQuery || selectedCategories.length > 0) && (
                            <Button variant="outline" size="sm" onClick={handleClearFilters}>
                                {translate("clearfilters")}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Résumé des filtres */}
                <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-gray-500">
                    {count === 0 ? (
                        <p>{translate("noarticle")}</p>
                    ) : (
                        <p>
                            {count} {count > 1 ? translate("articles") : translate("article")}
                            {count > 1 ? translate("found2") : translate("found")}
                            {selectedCategories.length > 0 && (
                                <>
                                    {" "}
                                    {translate("in") + " "}
                                    {selectedCategories.length === 1
                                        ? translate("thecategory") + ` "${selectedCategories[0]}"`
                                        : `${selectedCategories.length} ` + translate("categories")}
                                </>
                            )}
                            {searchQuery && <> {translate("containing")} "{searchQuery}"</>}
                        </p>
                    )}
                </div>
            </motion.div>

            {/* Liste des articles */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={`page-${currentPage}-${sortBy}-${selectedCategories.join()}-${searchQuery}`}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={staggerContainer}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
                >
                    {blogs.length > 0 ? (
                        blogs.map((article) => (
                            <CardBlogAnimate
                                key={article.id}
                                article={article}
                            />
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-full flex flex-col items-center justify-center py-12 text-center"
                        >
                            <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-6 mb-4">
                                <Search className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Aucun résultat trouvé</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                                Aucun article ne correspond à vos critères de recherche. Essayez d'autres termes ou filtres.
                            </p>
                            <Button onClick={handleClearFilters}>Réinitialiser les filtres</Button>
                        </motion.div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Pagination */}
            {
                <TablePagination page={currentPage} setPage={setCurrentPage} count={count} pageSize={9} isLoading={isLoading} debouncedSearchQuery={searchQuery} />
            }
        </div>
    )
}
