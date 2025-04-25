import React from 'react'
import VideoUploader from './elements/video-builder'
import FileBuilder from './elements/file-builder'
import ImageBuilder from './elements/image-builder';
import { useTranslations } from 'next-intl';
import ParagraphBuilder from './elements/paragraph-element';
import { TitleBuilder } from './elements/title-element';
import { SpaceBuilder } from './elements/space-element';
import TextBuilder from './elements/text-element';
import { Button } from '@/components/ui/button';
import { BadgeCheck, Trash2 } from 'lucide-react';

const ElementBuilder = ({ id, type, value, removeComponent, setBlur, handleChangeValue }: any) => {

    return (
        <div key={id} className='border p-4 rounded-md relative'>
            {type === 'text' && <TextBuilder value={value} onChangeValue={(val: any) => handleChangeValue(id, val)} />}
            {type === 'image' && <ImageBuilder value={value} onChangeValue={(val: any) => handleChangeValue(id, val)} />}
            {type === 'video' && <VideoUploader value={value} onChangeValue={(val: any) => handleChangeValue(id, val)} />}
            {type === 'file' && <FileBuilder  value={value} onChangeValue={(val: any) => handleChangeValue(id, val)}/>}
            {type === 'title' && <TitleBuilder size="titlebig" value={value} onChangeValue={(val: any) => handleChangeValue(id, val)} />}
            {type === 'titleh2' && <TitleBuilder size="titlemedium" value={value} onChangeValue={(val: any) => handleChangeValue(id, val)} />}
            {type === 'titleh3' && <TitleBuilder size="titlesmall" value={value} onChangeValue={(val: any) => handleChangeValue(id, val)} />}
            {type === 'paragraph' && <ParagraphBuilder value={value} onChangeValue={(val: any) => handleChangeValue(id, val)} />}
            {type === 'space' && <SpaceBuilder size="space" value={value} onChangeValue={(val: any) => handleChangeValue(id, val)}/>}
            <div className='flex justify-between'>
                <Button className='mt-4' variant='destructive' size='sm' onClick={() => removeComponent(id)}>
                    <Trash2 size={16} />
                </Button>
                <Button className='mt-4' variant='primary' size='sm' onClick={() => setBlur(id)}>
                    <BadgeCheck size={16} />
                </Button>
            </div>
        </div>
    )
}

export default ElementBuilder
