"use client"
import { incrementBlogView } from '@/actions/blog/update';
import React, { useEffect } from 'react'

const AddViewBlog = ({id}: any) => {

    useEffect(() => {
        handleAddView()
    }, []);

    const handleAddView = async () => {
        const viewedPosts = JSON.parse(localStorage.getItem('viewedPosts') || '[]') as string[];
        if (!viewedPosts.includes(id)) {
            await incrementBlogView(id)
            // Et on enregistre dans localStorage
            viewedPosts.push(id);
            localStorage.setItem('viewedPosts', JSON.stringify(viewedPosts));
        }
    }

    return (
        <>
        </>
    )
}

export default AddViewBlog
