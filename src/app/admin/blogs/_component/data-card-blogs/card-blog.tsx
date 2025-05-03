"use client"
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import React from 'react'
import UpdateBlogButton from '../buttons/update-blog'
import { Eye, Trash2 } from 'lucide-react'
import { useSession } from '@/hooks/use-session'
import { usePathname } from 'next/navigation'
import { useOrigin } from '@/hooks/use-origin'
import Loading from '@/components/myui/loading'
import MyImage from '@/components/myui/my-image'

const CardBlog = ({ blog, showAction = true }: { blog: any , showAction?: boolean }) => {
    const { session } = useSession()
    const hasPermissionDelete = (session?.user?.permissions.find((permission: string) => permission === "blogs_delete") ?? false) || session?.user?.isAdmin;
    const hasPermissionUpdate = (session?.user?.permissions.find((permission: string) => permission === "blogs_update") ?? false) || session?.user?.isAdmin;
    const pathname = usePathname();
    const origin= useOrigin();

    if(!origin){
        return <Loading />
    }

    return (
        <Card className='hover:shadow-xl overflow-hidden h-[250px] md:h-[300px]' key={blog.id}>
            <Link href={`${pathname.includes("admin")?pathname:origin+"/blogs"}/${blog.id}`} className='flex flex-col gap-2 cursor-pointer relative'>
                <div className='absolute top-2 right-2 z-50 flex gap-2'>
                    {/* <ViewBlogButton id={blog.id} /> */}
                    {showAction && hasPermissionUpdate &&<UpdateBlogButton id={blog.id} />}
                    {showAction && hasPermissionDelete && <div className='cursor-pointer border rounded bg-accent hover:bg-red-500 hover:text-white p-2'>
                        <Trash2 size={16} />
                    </div>}
                </div>
                <MyImage image={blog.image} />
                <div className='flex flex-col p-2 gap-2'>
                    <div className='font-bold'>
                        {blog.title}
                    </div>
                    <div className='flex justify-end items-center gap-1'>
                        <div className='text-xs font-bold'>12</div>
                        <Eye className='font-bold' size={12} />
                    </div>
                    <div className='text-xs'>
                        {blog.description.length > 100 ? blog.description.substring(0, 100) + "..." : blog.description}
                    </div>
                </div>
            </Link>
        </Card>
    )
}

export default CardBlog
