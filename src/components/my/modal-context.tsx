import { AddUpdateBlogsCategoryDialogProvider } from '@/context/add-update-blogs-category-dialog-context'
import { AddUpdateUserDialogProvider } from '@/context/add-update-dialog-context'
import { AddUpdateBlogsCategoryDialog } from '@/modals/add-update-blogs-category-dialog'
import { AddUpdateUserDialog } from '@/modals/add-update-dialog'
import React from 'react'

const ModalContext = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <AddUpdateUserDialogProvider>
                <AddUpdateBlogsCategoryDialogProvider>
                    {children}
                    <AddUpdateUserDialog />
                    <AddUpdateBlogsCategoryDialog />
                </AddUpdateBlogsCategoryDialogProvider>
            </AddUpdateUserDialogProvider>
        </>
    )
}

export default ModalContext
