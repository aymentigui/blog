"use client"
import { removefavoris } from '@/actions/blog/favoris/delete'
import { useSession } from '@/hooks/use-session'
import { Heart } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { FaHeart } from 'react-icons/fa'

const RemoveFavorites = ({idBlog}:any) => {

    const {session} = useSession()
    const e = useTranslations("Error")
    const route = useRouter()

    const handleRemoveavorite = async () => {
        if (!session && !session.data && !session.data.user) {
          toast.error(e("unauthorized"))
          return
        }
        const resFavoris = await removefavoris(idBlog)
        if (resFavoris.status !== 200) {
          toast.error(e("error"))
          return
        }
        route.refresh()
      }

    return (
        <FaHeart onClick={handleRemoveavorite} size={18} className="cursor-pointer text-red-500" />
    )
}

export default RemoveFavorites
