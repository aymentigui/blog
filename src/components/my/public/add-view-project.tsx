"use client"
import { incrementProjectView } from '@/actions/project/update';
import React, { useEffect } from 'react'

const AddViewProject = ({id}: any) => {

    useEffect(() => {
        handleAddView()
    }, []);

    const handleAddView = async () => {
        const viewedPosts = JSON.parse(localStorage.getItem('viewedProjects') || '[]') as string[];
        if (!viewedPosts.includes(id)) {
            await incrementProjectView(id)
            // Et on enregistre dans localStorage
            viewedPosts.push(id);
            localStorage.setItem('viewedProjects', JSON.stringify(viewedPosts));
        }
    }

    return (
        <>
        </>
    )
}

export default AddViewProject
