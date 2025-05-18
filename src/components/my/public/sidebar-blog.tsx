"use client"
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react'
import { motion } from "framer-motion"
import Link from 'next/link'
import { ArrowRight } from 'lucide-react';
import Loading from '@/components/myui/loading';
import CardBlogAnimate from './card-blog-animate';
import { fetchBlogs } from '@/actions/blog/util-client';

const SideBarBlog = () => {

    const translate = useTranslations("HomePage");

    const [blogs, setBlogs] = useState([])
    const [isLoading, setIsLoading] = useState(false)

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

    useEffect(() => {
        fetchBlogs(setBlogs,setIsLoading,1,3,undefined,"",[],"popular")
      }, [])

    return (
        <div className="w-full lg:w-1/4  p-2 min-h-full">
            <div className="container px-4 mx-auto">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="flex flex-col lg:flex-row justify-between items-center mb-12"
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
                            className="grid grid-cols-1 gap-8"
                        >
                            {blogs.map((article, index) => (
                                <CardBlogAnimate key={index} article={article} />
                            ))}
                        </motion.div>
                }
            </div>
        </div>
    )
}

export default SideBarBlog
