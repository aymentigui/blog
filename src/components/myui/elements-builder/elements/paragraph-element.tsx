"use client"
import { Label } from '@/components/ui/label'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'


const ParagraphBuilder = ({ value, onChangeValue }: any) => {


    const [val, setVal] = useState(value ?? "")
    const translate = useTranslations("Blogs")

    return <div>
        <Label className='mb-2'>{translate("paragraph")}</Label>
        <textarea
            rows={6}
            value={val}
            onChange={(e) => {
                setVal(e.target.value);
                if (onChangeValue) onChangeValue(e.target.value)
            }}
            placeholder={translate("paragraphplaceholder")}
            className='w-full p-2 border rounded-md'
        />
    </div>
}

export const ParagraphPreview = ({ value }: any) => {
    return <p style={{ whiteSpace: "pre-wrap" }}>{value ?? "..."}</p>
}


export default ParagraphBuilder