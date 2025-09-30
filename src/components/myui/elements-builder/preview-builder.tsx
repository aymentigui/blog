"use client"
import React, { useState } from 'react'
import VideoUploader from './elements/video-element'
import { ImagePreview } from './elements/image-element';
import { VideoPreview } from './elements/video-element';
import { useTranslations } from 'next-intl';
import { ParagraphPreview } from './elements/paragraph-element';
import { TitlePreview } from './elements/title-element';
import { TextPreview } from './elements/text-element';
import { SortableItem } from '@/components/ui/SortableItem';
import { Copy, Pen, Trash2 } from 'lucide-react';
import { SpacePreview } from './elements/space-element';
import { CodePreview } from './elements/code-element';
import { FilePreviewBuilder } from './elements/file-elements';
import { FilesPreviewBuilder } from './elements/files-elements';
import { ImagesPreview } from './elements/images-element';
import { LinkPreview } from './elements/link-element';
import { EditorJsPreview } from './elements/text2-element';

const PreviewBuilder = ({ id, type, value, setFocus, removeComponent, langage, duplicateComponent }: any) => {

    const translate = useTranslations("Blogs")
    const [hover, setHover] = useState(false)

    return (
        <div
            onMouseLeave={() => { setHover(false) }}
            onMouseEnter={() => { setHover(true) }}
            className='hover:border hover:rounded hover:p-2 hover:shadow-sm cursor-pointer min-h-1 relative'
            key={id}
        >

            { hover && <div className={'absolute top-2 text-xs text-gray-500 border rounded p-1 z-10 cursor-pointer flex gap-2 ' + (langage !== 'ar' ? 'right-2' : 'left-2')}>
                <div className='flex items-center p-1 border rounded hover:bg-border hover:text-white'
                    onClick={() => { setFocus(id) }}
                >
                    <Pen size={16} />
                </div>
                <div className='flex items-center p-1 border rounded hover:bg-border hover:text-white'
                     onClick={() => removeComponent(id)}
                >
                    <Trash2 size={16} />
                </div>
                <div className='flex items-center p-1 border rounded hover:bg-border hover:text-white'
                     onClick={() => duplicateComponent(id)}
                >
                    <Copy size={16} />
                </div>
            </div>
            }
            <SortableItem key={id} id={id} onClick={() => { setFocus(id) }}>
                {type === 'text' && <TextPreview value={value} />}
                {type === 'text2' && <EditorJsPreview value={value} />}
                {type === 'image' && <ImagePreview value={value} />}
                {type === 'images' && <ImagesPreview value={value} />}
                {type === 'video' && <VideoPreview value={value} />}
                {type === 'file' && <FilePreviewBuilder value={value} />}
                {type === 'files' && <FilesPreviewBuilder value={value} />}
                {type === 'title' && <TitlePreview value={value} size="title" />}
                {type === 'titleh2' && <TitlePreview value={value} size="titleh2" />}
                {type === 'titleh3' && <TitlePreview value={value} size="titleh3" />}
                {type === 'paragraph' && <ParagraphPreview value={value} />}
                {type === 'space' && <SpacePreview value={value} />}
                {type === 'code' && <CodePreview value={value} />}
                {type === 'link' && <LinkPreview value={value} />}
            </SortableItem>
        </div>
    )
}

export const PreviewBuilderHtml = ({ type, value }: any) => {
    return (
        <>
            {type === 'text' && <TextPreview value={value} />}
            {type === 'text2' && <EditorJsPreview value={value} />}
            {type === 'image' && <ImagePreview value={value} />}
            {type === 'images' && <ImagesPreview value={value} />}
            {type === 'video' && <VideoUploader value={value} />}
            {type === 'file' && <FilePreviewBuilder value={value} />}
            {type === 'files' && <FilesPreviewBuilder value={value} />}
            {type === 'title' && <TitlePreview value={value} size="title" />}
            {type === 'titleh2' && <TitlePreview value={value} size="titleh2" />}
            {type === 'titleh3' && <TitlePreview value={value} size="titleh3" />}
            {type === 'paragraph' && <ParagraphPreview value={value} />}
            {type === 'space' && <SpacePreview value={value} />}
            {type === 'code' && <CodePreview value={value} />}
            {type === 'link' && <LinkPreview value={value} />}
        </>
    )
}


export default PreviewBuilder
