"use client"
import { Input } from '@/components/ui/input';
import GetImage from '@/hooks/use-getImage';
import { useOrigin } from '@/hooks/use-origin';
import { Label } from '@radix-ui/react-dropdown-menu';
import { SquareDashedMousePointer } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';

const VideoBuilder = ({ value, onChangeValue }: any) => {
    const [valRec, setValRec] = useState(value ?? "")
    const [val, setVal] = useState("")
    const translate = useTranslations("Blogs")
    const inputRef = useRef<HTMLInputElement>(null)

    const handleChangeWidth = (e: any) => {
        if (!e.target.value) return
        if (parseFloat(e.target.value) < 1 || parseFloat(e.target.value) > 100) {
            toast.error(translate("widthbetween"))
        }

        const newVal = { ...valRec, width: e.target.value }
        setValRec(newVal);
        if (parseFloat(e.target.value) < 100 && parseFloat(e.target.value) > 0) {
            if (onChangeValue)
                onChangeValue(newVal);
        }
    }

    return <div className='p-2 border rounded-md flex flex-col gap-4'>
        <div onClick={() => inputRef.current?.click()} className='p-2 border rounded-md cursor-pointer hover:shadow-md'>
            <SquareDashedMousePointer />{translate("videoplaceholder")} {value && value?.file && value?.file.name}
        </div>
        <div>
            <Label className='mb-2'>{translate("width")}</Label>
            <Input type="number" value={valRec.width ?? 0} onChange={handleChangeWidth} className='' />
        </div>
        <Input ref={inputRef} accept='video/*' type='file' onChange={(e) => {
            if (e.target.files) {
                setVal(e.target.value);
                if (onChangeValue) onChangeValue({ ...valRec, file: e.target.files[0] });
            }
        }} value={val} className='hidden' />
    </div>
};

export const VideoPreview = ({ value }: any) => {
    const origin = useOrigin()
    const [preview, setPreview] = useState("/not_found.jpg")

    useEffect(() => {
        setVideo()
    }, [value]);

    const setVideo = async () => {
        if (value && value.file) {
            setPreview(URL.createObjectURL(value.file))
        }
        else if (value && value.url) {
            if (!origin) return
            const response = await fetch(origin + "/api/files/" + value.url + "?allFile=true");

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setPreview(url);
        }
    }

    return (value && (value.file || value.url))
        ?
        ((preview !== "/not_found.png") ?
            <video
                controls
                src={preview}
                style={{
                    width: (value.width ?? 100) + "%",
                    height: "auto",
                    marginLeft: "auto",
                    marginRight: "auto"
                }}
            />
            :
            <Image
                alt='imagepreview'
                src={preview}
                width={0}
                height={0}
                style={{
                    width: (value.width ?? 100) + "%",
                    height: "auto",
                    marginLeft: "auto",
                    marginRight: "auto"
                }}
            />
        )
        :
        <div className='w-full h-20 bg-border flex justify-center items-center'>
            <SquareDashedMousePointer />
        </div>
}

export default VideoBuilder
