"use client"
import { incrementPageView } from '@/actions/helpers';
import React, { useEffect } from 'react'

const AddViewPage = ({name}: any) => {

    useEffect(() => {
        handleAddView()
    }, []);

    const handleAddView = async () => {
        const viewedPages = JSON.parse(localStorage.getItem('viewedPages') || '[]') as string[];
        if (!viewedPages.includes(name)) {
            await incrementPageView(name)
            // Et on enregistre dans localStorage
            viewedPages.push(name);
            localStorage.setItem('viewedPages', JSON.stringify(viewedPages));
        }
    }

    return (
        <>
        </>
    )
}

export default AddViewPage
