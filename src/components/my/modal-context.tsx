import { AddUpdateBlogsCategoryDialogProvider } from '@/context/add-update-blogs-category-dialog-context'
import { AddUpdateUserDialogProvider } from '@/context/add-update-dialog-context'
import { AddUpdateProjectssCategoryDialogProvider } from '@/context/add-update-projects-category-dialog-context'
import { AddUpdateBlogsCategoryDialog } from '@/modals/add-update-blogs-category-dialog'
import { AddUpdateUserDialog } from '@/modals/add-update-dialog'
import { AddUpdateProjectsCategoryDialog } from '@/modals/add-update-projects-category-dialog'
import React from 'react'

const ModalContext = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <AddUpdateUserDialogProvider>
                <AddUpdateBlogsCategoryDialogProvider>
                    <AddUpdateProjectssCategoryDialogProvider>
                        {children}
                        <AddUpdateUserDialog />
                        <AddUpdateBlogsCategoryDialog />
                        <AddUpdateProjectsCategoryDialog />
                    </AddUpdateProjectssCategoryDialogProvider>
                </AddUpdateBlogsCategoryDialogProvider>
            </AddUpdateUserDialogProvider>
        </>
    )
}

export default ModalContext
