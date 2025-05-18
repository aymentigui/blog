"use client"
import React from 'react'
import { motion } from "framer-motion"
import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Eye } from 'lucide-react'
import { useTranslations } from 'next-intl'
import MyImage from '@/components/myui/my-image'

const CardBlogAnimate = ({ article }: any) => {

    const translate = useTranslations("HomePage")
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 },
        },
    }


    return (
        <motion.div key={article.id} variants={fadeIn} whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
            <Link href={"/blogs/"+article.slug}>
                <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow duration-300">
                    <div className="relative h-48 w-full">
                        <MyImage
                            alt={article.title}
                            image={article.image}
                            load
                            classNameProps="w-full h-[150px] md:h-[200px] bg-accent"
                            objet_fit='object-contain'
                        />
                        <div className="absolute top-4 left-4">
                            {article.categories.map((category: any, index: number) => (
                                <Badge key={index} className="bg-purple-600 hover:bg-purple-700">{category.title}</Badge>
                            ))}
                        </div>
                    </div>
                    <CardContent className="pt-6">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 theme-ocean:text-gray-400 mb-2">
                            <span>{new Date(article.created_at).toLocaleString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/\/|,|\:/g, ' ')}</span>
                            <span className="mx-2">•</span>
                            <span className="flex gap-2 items-center">
                                <Eye size={15} />
                                {article.views}
                            </span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 line-clamp-2">{article.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 theme-ocean:text-gray-400 line-clamp-3">{article.description}</p>
                    </CardContent>
                    <CardFooter className="pt-0">
                        <span className="text-purple-600 dark:text-purple-400 theme-ocean:text-purple-400 font-medium flex items-center">
                            {translate("readarticle")}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </span>
                    </CardFooter>
                </Card>
            </Link>
        </motion.div>
    )
}

export default CardBlogAnimate
