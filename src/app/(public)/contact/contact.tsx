"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Github, Linkedin, Instagram, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import toast from "react-hot-toast"
import { useTranslations } from "next-intl"
import AddViewPage from "@/components/my/public/add-view-page"
import { sendMessage } from "@/actions/email"
import { useGoogleReCaptcha } from "react-google-recaptcha-v3"

export default function ContactPage() {

    const {executeRecaptcha} = useGoogleReCaptcha()
    const translate = useTranslations("ContactPage")

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        if (!executeRecaptcha) {
            setIsSubmitting(false)
            return
        }

        const token = await executeRecaptcha("contact")

        if (!token) {
            setIsSubmitting(false)
            return
        }
        // Simulate form submission
        const res = await sendMessage(formData, token)

        if (res.status !== 200) {
            setIsSubmitting(false)
            return
        }
        toast.success(translate("messagesuccess"))

        setFormData({ name: "", email: "", message: "" })
        setIsSubmitting(false)
    }

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 },
        },
    }

    const socialLinks = [
        {
            name: "GitHub",
            icon: <Github className="h-6 w-6" />,
            url: "https://github.com/aymentigui",
            color: "bg-gray-800 hover:bg-gray-900 darrk:bg-gray-700 theme-ocean:bg-gray-700 dark:hover:bg-gray-800 theme-ocean:hover:bg-gray-800",
        },
        {
            name: "LinkedIn",
            icon: <Linkedin className="h-6 w-6" />,
            url: "https://www.linkedin.com/in/aimen-abdelghafour-tighiouart-7866a725b/",
            color: "bg-blue-600 hover:bg-blue-700",
        },
        {
            name: "WhatsApp",
            icon: <MessageSquare className="h-6 w-6" />,
            url: "https://wa.me/+213540672622",
            color: "bg-green-500 hover:bg-green-600",
        },
    ]



    return (
        <div className="container max-w-4xl mx-auto py-12 px-4 md:px-6">
            <AddViewPage name="contact" />
            <motion.div initial="hidden" animate="visible" variants={fadeIn} className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {translate("title")}
                </h1>
                <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mb-8"></div>
                <p className="text-gray-700 dark:text-gray-300 theme-ocean:text-gray-300 max-w-2xl mx-auto">
                    {translate("description")}
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                    <h2 className="text-2xl font-bold mb-6">Envoyez-moi un message</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium mb-1">
                                {translate("name")}
                            </label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder={translate("nameplaceholder")}
                                required
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-1">
                                {translate("email")}
                            </label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder={translate("emailplaceholder")}
                                required
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium mb-1">
                                {translate("message")}
                            </label>
                            <Textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder={translate("messageplaceholder")}
                                required
                                className="w-full min-h-[150px]"
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                        >
                            {isSubmitting ? translate("submitloading") : translate("submit")}
                        </Button>
                    </form>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <h2 className="text-2xl font-bold mb-6">{translate("findmeon")}</h2>

                    <div className="grid grid-cols-1 gap-4 mb-8">
                        {socialLinks.map((link, index) => (
                            <motion.div
                                key={link.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <a href={link.url} target="_blank" rel="noopener noreferrer" className="block">
                                    <Card className="overflow-hidden">
                                        <CardContent className={`p-0`}>
                                            <div className={`flex items-center p-4 text-white ${link.color}`}>
                                                <div className="mr-3">{link.icon}</div>
                                                <span className="font-medium">{link.name}</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </a>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="text-xl font-semibold mb-3">{translate("instagramcontenu")}</h3>
                                <p className="text-gray-700 dark:text-gray-300 theme-ocean:text-gray-300 mb-4">
                                    {translate("instagramcontenudescription")}
                                </p>
                                <a
                                    href="https://instagram.com/tigui_tech"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 theme-ocean:text-purple-400 dark:hover:text-purple-300 theme-ocean:hover:text-purple-300"
                                >
                                    <Instagram className="h-5 w-5 mr-2" />
                                    <span>{translate("seemycontent")}</span>
                                </a>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}
