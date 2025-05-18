"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import { Pen } from 'lucide-react'

const UpdateProjectButton = ({ id }: { id: string }) => {
    const router = useRouter()

    return (
        <div onClick={() => router.push(`/admin/projects/${id}/update`)} className='cursor-pointer border rounded bg-accent hover:bg-blue-500 hover:text-white p-2'>
            <Pen size={16} />
        </div>
    )
}

export default UpdateProjectButton
