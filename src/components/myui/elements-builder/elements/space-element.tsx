"use client"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'


export const SpaceBuilder = ({ value, onChangeValue }: any) => {

    const [val, setVal] = useState(value ?? "")
    const translate = useTranslations("Blogs")

    return <div>
        <Label className='mb-2'>{translate("elementspaceplaceholder")}</Label>
        <Input type='number' value={val} onChange={(e) => { setVal(e.target.value); if (onChangeValue) onChangeValue(e.target.value) }} placeholder={translate("elementspaceplaceholder")} className='w-full p-2 border rounded-md' />
    </div>
}

export const SpacePreview = ({ value }: any) => {
    return <div style={{ height: `${value}px` }} className='text-2xl font-semibold'>{value ?"": "___"}</div>
}

