"use client"

import React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Eye } from 'lucide-react'

const ViewBlogButton = ({ id }: { id: string }) => {
    const router = useRouter();
    const pathname = usePathname(); // Utilisation de usePathname pour obtenir le chemin actuel

    const handleViewBlog = () => {
        // ici vous pouvez ajouter des paramètres supplémentaires à l'URL si vous en avez besoin.

        // Redirection vers la page du blog avec l'ID et les paramètres de recherche actuels
        router.push(`${pathname.includes("admin")?pathname:origin+"/blogs"}/${id}}`);
    };

    return (
        <div
            onClick={handleViewBlog}
            className='cursor-pointer border rounded bg-accent hover:bg-blue-500 hover:text-white p-2'
        >
            <Eye size={16} />
        </div>
    );
}

export default ViewBlogButton;
