"use client"
import React from 'react'
import Image from 'next/image'
import GetImage from '@/hooks/use-getImage'
import { LzyImage } from './lazy-image'

const BlogImage = ({ image }: { image: string }) => {

    return (
        <LzyImage
            src={GetImage(image)}
            alt="blog"
            load
            className="w-full h-[150px] md:h-[200px] bg-accent"
            objet_fit='object-contain'
        />
    )
}

export default BlogImage