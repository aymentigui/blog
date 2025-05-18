"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useTranslations } from "next-intl"
import AddViewPage from "@/components/my/public/add-view-page"

export default function AboutPage() {
    const translate = useTranslations("AboutPage")

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
                staggerChildren: 0.2,
            },
        },
    }

    return (
        <div className="container max-w-4xl mx-auto py-12 px-4 md:px-6">
            <AddViewPage name="about" />
            <motion.div initial="hidden" animate="visible" variants={fadeIn} className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {translate("title")}
                </h1>
                <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mb-8"></div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="col-span-1 flex justify-center"
                >
                    <div className="relative w-48 h-48 md:w-64 md:h-64 overflow-hidden rounded-full border-4 border-purple-500">
                        <Image src="/me.jpg?height=300&width=300" alt="Profile" fill className="object-cover" />
                    </div>
                </motion.div>

                <motion.div
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                    className="col-span-2 flex flex-col justify-center"
                >
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">{translate("subtitle")}</h2>
                    <p className="text-gray-700 dark:text-gray-300 theme-ocean:text-gray-300 mb-4">
                        {translate("description")}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 theme-ocean:text-gray-300">
                        {translate("description2")}
                    </p>
                </motion.div>
            </div>

            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">{translate("whatishare")}</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div variants={fadeIn}>
                        <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                            <CardContent className="p-6">
                                <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900 theme-ocean:bg-purple-900 flex items-center justify-center mb-4">
                                    <span className="text-2xl text-purple-600 dark:text-purple-300 theme-ocean:text-purple-300">🚀</span>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{translate("tutonextjs")}</h3>
                                <p className="text-gray-600 dark:text-gray-400 theme-ocean:text-gray-400">
                                    {translate("tutonextjsdescription")}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={fadeIn}>
                        <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                            <CardContent className="p-6">
                                <div className="h-12 w-12 rounded-full bg-pink-100 dark:bg-pink-900 theme-ocean:bg-pink-900 flex items-center justify-center mb-4">
                                    <span className="text-2xl text-pink-600 dark:text-pink-300 theme-ocean:text-pink-300">⚛️</span>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{translate("componentsreact")}</h3>
                                <p className="text-gray-600 dark:text-gray-400 theme-ocean:text-gray-400">
                                    {translate("componentsreactdescription")}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={fadeIn}>
                        <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                            <CardContent className="p-6">
                                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 theme-ocean:bg-blue-900 flex items-center justify-center mb-4">
                                    <span className="text-2xl text-blue-600 dark:text-blue-300  theme-ocean:text-blue-300">💡</span>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{translate("tipsandtechniques")}</h3>
                                <p className="text-gray-600 dark:text-gray-400 theme-ocean:text-gray-400">
                                    {translate("tipsandtechniquesdescription")}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={fadeIn}>
                        <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                            <CardContent className="p-6">
                                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 theme-ocean:bg-green-900 flex items-center justify-center mb-4">
                                    <span className="text-2xl text-green-600 dark:text-green-300 theme-ocean:text-green-300">🌐</span>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{translate("wordpressandphp")}</h3>
                                <p className="text-gray-600 dark:text-gray-400 theme-ocean:text-gray-400">
                                    {translate("wordpressandphpdescription")}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </motion.div>

            <motion.div variants={fadeIn} initial="hidden" animate="visible" className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">{translate("wanttoknowmore")}</h2>
                <p className="text-gray-700 dark:text-gray-300 theme-ocean:text-gray-300 mb-6 max-w-2xl mx-auto">
                    {translate("wanttoknowmoredescription")}
                </p>
                <Link href="/contact">
                    <Button
                        size="lg"
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    >
                        {translate("contactme")}
                    </Button>
                </Link>
            </motion.div>
        </div>
    )
}
