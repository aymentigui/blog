"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { addComment } from "@/actions/blog/comments/set"
import toast from "react-hot-toast"
import { useTranslations } from "next-intl"

interface CommentFormProps {
    blogId: string
    parentId?: string
    onSuccess?: () => void
    placeholder?: string
}

export default function CommentForm({
    blogId,
    parentId,
    onSuccess,
    placeholder,
}: CommentFormProps) {
    const [content, setContent] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const translate = useTranslations("Blogs")
    const translateSystem = useTranslations("System")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!content.trim()) return

        setIsSubmitting(true)

        try {
            const result = await addComment({
                content,
                blogId,
                parentId: parentId || null,
            })

            if (result.status !== 200) {
                toast.error(result.data?.message ?? "")
            } else {
                setContent("")
                toast.success(translate("commmentpostsuccess"))

                if (onSuccess) {
                    onSuccess()
                }
            }
        } catch (error) {
            toast.error(translate("commmentpostfail"))
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={!placeholder|| placeholder === "" ? translate("commentplaceholder") : placeholder}
                className="min-h-[100px] w-full"
                disabled={isSubmitting}
            />
            <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting || !content.trim()}>
                    {isSubmitting ? translateSystem("loading")+"..." : parentId ? translate("reply") : translate("postcomment")}
                </Button>
            </div>
        </form>
    )
}
