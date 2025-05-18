"use client"
import React, { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { motion } from "framer-motion"
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { subscribe } from '@/actions/blog/subscribe'
import toast from 'react-hot-toast'

const FooterPublic = () => {
  const translate = useTranslations("HomePage")
  const translateSystem = useTranslations("System")

  const email =useRef<HTMLInputElement>(null)


  const subscribeOrUnsubscribe = async () => {
    const res = await subscribe(email.current?.value || "")
    if(res.status === 200) {
      toast.success(translateSystem("subscribesuccess"))
      if (email.current) {
        email.current.value = ""
      }
    }else {
      toast.error(translateSystem("subscribefail"))
    }
  }

  return (
    <section className="py-16 bg-white theme-ocean:bg-gray-950 dark:bg-gray-950">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 theme-ocean:from-purple-900/40  dark:to-pink-900/40 theme-ocean:to-pink-900/40 rounded-2xl p-8 md:p-12 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{translate("stayinformed")}</h2>
          <p className="text-gray-700 dark:text-gray-300 theme-ocean:text-gray-300 mb-8">
            {translate("stayinformedtext")}
          </p>

          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input type="email" ref={email} placeholder={translate("emailplaceholder")} className="flex-1" required />
            <Button
              type="submit"
              onClick={(e) => {
                e.preventDefault()
                subscribeOrUnsubscribe()
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              {translate("subscribe")}
            </Button>
          </form>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            {translate("subscribeinfo")}
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default FooterPublic
