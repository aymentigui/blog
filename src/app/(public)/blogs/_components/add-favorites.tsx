"use client"
import { addfavoris } from '@/actions/blog/favoris/set'
import { useSession } from '@/hooks/use-session'
import { Heart } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import React from 'react'
import toast from 'react-hot-toast'
import { FaHeart } from 'react-icons/fa'

const AddFavorites = ({ idBlog }: any) => {

    const { session } = useSession()
    const route = useRouter()
    const e = useTranslations("Error")

    const handleAddFavorite = async () => {
        if (!session && !session.data && !session.data.user) {
            toast.error(e("unauthorized"))
            return
        }
        const resFavoris = await addfavoris(idBlog)
        if (resFavoris.status !== 200) {
            toast.error(e("error"))
            return
        }
        route.refresh()
    }

    return (
        <Heart onClick={handleAddFavorite} className="cursor-pointer" />
    )
}

export default AddFavorites
