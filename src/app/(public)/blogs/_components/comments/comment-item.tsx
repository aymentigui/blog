"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { fr, enUS, arDZ } from "date-fns/locale"
import { formatDistanceToNow } from "date-fns/formatDistanceToNow"
import { MessageSquare, MoreVertical, Trash, Edit, ThumbsUp, Heart, Smile } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import CommentForm from "./comment-form"
import CommentList from "./comment-list"
import { getCommentReplies } from "@/actions/blog/comments/get"
import { addReaction } from "@/actions/blog/comments/set"
import { updateComment } from "@/actions/blog/comments/update"
import { deleteComment } from "@/actions/blog/comments/delete"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useSession } from "@/hooks/use-session"
import toast from "react-hot-toast"
import { useLocale, useTranslations } from "next-intl"
import MyImage from "@/components/myui/my-image"

interface CommentItemProps {
    comment: any
    blogId: string
}

export default function CommentItem({ comment, blogId }: CommentItemProps) {
    const [showReplyForm, setShowReplyForm] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editContent, setEditContent] = useState(comment.content)
    const [showReplies, setShowReplies] = useState(false)
    const [replies, setReplies] = useState<any[]>([])
    const [isLoadingReplies, setIsLoadingReplies] = useState(false)
    const locale = useLocale()
    const translate = useTranslations("Blogs")
    const translateSystem = useTranslations("System")


    const { session } = useSession()

    const isAuthor = session?.user?.id === comment.author.id
    const isAdmin = session?.user?.isAdmin

    // Group reactions by type
    const reactionCounts: Record<string, number> = {}
    const userReactions: Record<string, boolean> = {}

    comment.reactions.forEach((reaction: any) => {
        reactionCounts[reaction.type] = (reactionCounts[reaction.type] || 0) + 1

        if (session?.user?.id === reaction.user.id) {
            userReactions[reaction.type] = true
        }
    })

    const toggleReplies = async () => {
        setIsLoadingReplies(true)
        try {
            const result = await getCommentReplies(comment.id)
            if (result.status === 200 && result.data) {
                // @ts-ignore
                setReplies(result.data || [])
            }
        } catch (error) {
            console.error("Error loading replies:", error)
        } finally {
            setIsLoadingReplies(false)
        }
        setShowReplies(true)
    }

    const handleReaction = async (type: string) => {
        if (!session.data?.user) {
            toast.error(translate("mustsignintoreact"))
            return
        }

        try {
            const result = await addReaction({
                commentId: comment.id,
                type,
            })


            if (result.status !== 200) {
                if (result.data?.message) {
                    toast.error(result.data?.message)
                }
            } else {
                // Optimistically update UI
                if (result.removed) {
                    // Remove reaction
                    comment.reactions = comment.reactions.filter((r: any) => !(r.user.id === session.data.user.id && r.type === type))
                } else if (result.reaction) {
                    // Add or update reaction
                    const existingIndex = comment.reactions.findIndex((r: any) => r.user.id === session.data.user.id)

                    if (existingIndex >= 0) {
                        comment.reactions[existingIndex].type = type
                    } else {
                        comment.reactions.push({
                            id: result.reaction.id,
                            type,
                            user: {
                                id: session.data.user.id,
                                username: session.data.user.name,
                            },
                        })
                    }
                }
            }
        } catch (error) {
            toast.error(translate("failedtoreaction"))
        }
    }

    const handleUpdate = async () => {
        if (!editContent.trim()) return

        try {
            const result = await updateComment({
                id: comment.id,
                content: editContent,
            })

            if (result.status != 200 && result.data?.message) {
                toast.error(result.data.message)
            } else {
                comment.content = editContent
                setIsEditing(false)
                toast.success(translate("commentupdatesuccess"))
            }
        } catch (error) {
            toast.error(translate("commentupdatefail"))
        }
    }

    const handleDelete = async () => {
        try {
            const result = await deleteComment(comment.id)

            if (result.status !== 200) {
                // Handle error
                // @ts-ignore
                toast.error(result.data?.message)
            } else {
                toast.success(translate("commentdeletesuccess"))
                // Remove from UI
                comment.deleted_at = new Date()
            }
        } catch (error) {
            toast.error(translate("commentdeletefail"))
        }
    }

    if (comment.deleted_at) {
        return (
            <Card className="bg-muted/50">
                <CardContent className="p-4 text-muted-foreground italic">{translate("commentdeleted")}</CardContent>
            </Card>
        )
    }


    const isReply = !!comment.parent_id

    return (
        <Card>
            <CardHeader className="p-4 pb-2 flex flex-row items-start space-y-0">
                <div className="flex items-start gap-2 flex-1">
                    <Avatar className="h-8 w-8">
                        {comment.author.image && <MyImage image={comment.author.image || ""} alt={comment.author.username || translateSystem("user")} classNameProps="h-8 w-8" />}
                        {!comment.author.image && <AvatarFallback>{(comment.author.username || "U").charAt(0).toUpperCase()}</AvatarFallback>}
                    </Avatar>
                    <div>
                        <p className="font-medium text-sm">{comment.author.username || translateSystem("anonymous")}</p>
                        <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: locale === "fr" ? fr : locale === "ar" ? arDZ : enUS })}
                        </p>
                    </div>
                </div>

                {(isAuthor || isAdmin) && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {isAuthor && (
                                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    {translateSystem("edit")}
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                                <Trash className="h-4 w-4 mr-2" />
                                {translateSystem("delete")}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </CardHeader>

            <CardContent className="p-4 pt-2">
                {isEditing ? (
                    <div className="space-y-2">
                        <Textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="min-h-[100px] w-full"
                        />
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                                {translateSystem("cancel")}
                            </Button>
                            <Button size="sm" onClick={handleUpdate}>
                                {translateSystem("save")}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm">{comment.content}</p>
                )}
            </CardContent>

            <CardFooter className="p-4 pt-0 flex flex-col items-start">
                <div className="flex items-center gap-2 w-full">
                    <div className="flex gap-1">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant={userReactions["like"] ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => handleReaction("like")}
                                        className="h-8"
                                    >
                                        <ThumbsUp className="h-4 w-4 mr-1" />
                                        {reactionCounts["like"] ? reactionCounts["like"] : ""}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Like</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant={userReactions["love"] ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => handleReaction("love")}
                                        className="h-8"
                                    >
                                        <Heart className="h-4 w-4 mr-1" />
                                        {reactionCounts["love"] ? reactionCounts["love"] : ""}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Love</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant={userReactions["smile"] ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => handleReaction("smile")}
                                        className="h-8"
                                    >
                                        <Smile className="h-4 w-4 mr-1" />
                                        {reactionCounts["smile"] ? reactionCounts["smile"] : ""}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Smile</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    {!isReply && <div className="ml-auto flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setShowReplyForm(!showReplyForm)} className="h-8">
                            {translate("reply")}
                        </Button>

                        {comment._count.replies > 0 && (
                            <Button variant="ghost" size="sm" onClick={toggleReplies} className="h-8" disabled={isLoadingReplies}>
                                <MessageSquare className="h-4 w-4 mr-1" />
                                {comment._count.replies} {comment._count.replies === 1 ? translate("replycomment") : translate("replies")}
                            </Button>
                        )}
                    </div>}
                </div>

                {showReplyForm && (
                    <div className="mt-4 w-full">
                        <CommentForm
                            blogId={blogId}
                            parentId={comment.id}
                            onSuccess={() => {
                                setShowReplyForm(false)
                                toggleReplies()
                            }}
                            placeholder={translate("writeareplay")}
                        />
                    </div>
                )}

                {showReplies && replies.length > 0 && <CommentList comments={replies} blogId={blogId} isReplies={true} />}
            </CardFooter>
        </Card>
    )
}
