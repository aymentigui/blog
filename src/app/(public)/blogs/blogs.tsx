"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter, ArrowUpDown, Eye, Clock, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTranslations } from "next-intl"
import { fetchBlogs, fetchCategories } from "@/actions/blog/util-client"
import Loading from "@/components/myui/loading"
import TablePagination from "@/components/myui/table/pagination"
import CardBlogAnimate from "@/components/my/public/card-blog-animate"
import AddViewPage from "@/components/my/public/add-view-page"

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

    const articlesPerPage = 9

    // Effet pour mettre à jour la recherche debouncée
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearchQuery(searchQuery), 500)
        return () => clearTimeout(timer)
    }, [searchQuery])

    // Effet pour filtrer les articles
    useEffect(() => {
        fetchBlogs(setBlogs, setIsLoading, currentPage, articlesPerPage, setCount, debouncedSearchQuery, selectedCategories, sortBy)
    }, [debouncedSearchQuery, selectedCategories, sortBy,currentPage])

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
        <div className="container mx-auto py-12 px-4 md:px-6 relative">
            <AddViewPage name="blogs" />
            <div className="absolute inset-0 bg-[url('/blog-landing.webp?height=100&width=100')] bg-repeat opacity-5 -z-10" />
            <motion.div initial="hidden" animate="visible" variants={fadeIn} className="text-center mb-12">
                <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mb-4"></div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {translate("title")}
                </h1>
                <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mb-8"></div>
                <p className="text-gray-700 dark:text-gray-300 theme-ocean:text-gray-300 max-w-2xl mx-auto">
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
                        className="pl-10 pr-4 py-6 rounded-full border-gray-300 dark:border-gray-700 theme-ocean:border-gray-700"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 theme-ocean:hover:text-gray-200"
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
                                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 theme-ocean:bg-gray-800 dark:text-gray-100 theme-ocean:text-gray-100 opacity-70"
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
                            {count} {count > 1 ? translate("articles") : translate("article")}{" "}
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
                            <div className="rounded-full bg-gray-100 dark:bg-gray-800 theme-ocean:bg-gray-800 p-6 mb-4">
                                <Search className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">{translate("noresult")}</h3>
                            <p className="text-gray-600 dark:text-gray-400 theme-ocean:text-gray-400 mb-6 max-w-md">
                                {translate("noresultsearch")}
                            </p>
                            <Button onClick={handleClearFilters}>{translate("resetfilters")}</Button>
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
