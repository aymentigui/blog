"use client"
import React from 'react'
import { motion } from "framer-motion"
import { ArrowRight, Code } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'


const CardCategoryAnimate = ({index,title}: {index: number, title:string}) => {
    
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
        <motion.div
            variants={fadeIn}
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-gray-800 theme-ocean:bg-blue-950 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
        >
            <div className={
                cn(
                   "h-12 w-12 rounded-full flex items-center justify-center mb-4",
                    !index || index % 4 === 0 ? "bg-purple-100 dark:bg-purple-900 theme-ocean:bg-purple-900" : index % 4 === 1 ? "bg-blue-100 dark:bg-blue-900 theme-ocean:bg-blue-900" : index % 4 === 2 ? "bg-green-100 dark:bg-green-900 theme-ocean:bg-green-900" : "bg-amber-100 dark:bg-amber-900 theme-ocean:bg-amber-900"
                )
            }>
                <Code className={
                    cn(
                        "h-6 w-6 ",
                        !index || index % 4 === 0 ? "text-purple-600 dark:text-purple-400 theme-ocean:text-purple-400" : index % 4 === 1 ? "text-blue-600 dark:text-blue-400 theme-ocean:text-blue-400" : index % 4 === 2 ? "text-green-600 dark:text-green-400 theme-ocean:text-green-400" : "text-amber-600 dark:text-amber-400 theme-ocean:text-amber-400"
                    )
                } />
            </div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <Link
                href={"/blogs?category="+title}
                className="text-purple-600 dark:text-purple-400 theme-ocean:text-purple-400 hover:underline flex items-center"
            >
                {translate("explore")}
                <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
        </motion.div>
    )
}

export default CardCategoryAnimate
