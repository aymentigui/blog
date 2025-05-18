"use client"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'


export const TitleBuilder = ({ value, onChangeValue, size }: any) => {

    const [val, setVal] = useState(value ?? "")
    const translate = useTranslations("Blogs")

    return <div>
        <Label className='mb-2'>{size ? translate(size) : "Titre"}</Label>
        <Input type='text' value={val} onChange={(e) => { setVal(e.target.value); if (onChangeValue) onChangeValue(e.target.value) }} placeholder={size ? translate(size + "placeholder") : "Titre..."} className='w-full p-2 border rounded-md' />
    </div>
}

export const TitlePreview = ({ value, size }: any) => {
    switch (size) {
        case "titleh3": return <h3 className='text-l font-semibold'>{value ?? "..."}</h3>
        case "titleh2": return <h2 className='text-xl font-semibold'>{value ?? "..."}</h2>
        default: return <h1 className='text-2xl font-semibold'>{value ?? "..."}</h1>
    }
}

