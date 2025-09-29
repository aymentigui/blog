"use client"
import { getFileFromLocalHost } from '@/actions/localstorage/util-client';
import ListFilesForm from '@/app/admin/files/_component/list-files-form';
import { Input } from '@/components/ui/input';
import { useOrigin } from '@/hooks/use-origin';
import { Label } from '@radix-ui/react-dropdown-menu';
import { Image as ImagePrev, SquareDashedMousePointer } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';

const acceptedFileTypes = {
    'image/*': [
        '.png',
        '.gif',
        '.jpeg',
        '.jpg',
        '.webp',
        '.bmp',
        '.ico',
        '.svg',
        '.tiff',
    ]
}

const ImageBuilder = ({ value, onChangeValue, widthControl=true }: any) => {
    const [files, setFiles] = useState<any[] | []>([])
    const [valRec, setValRec] = useState(value ?? "")
    const translate = useTranslations("Blogs")
    const origin = useOrigin()
    const [isLoading, setIsLoading] = useState(true)
    // const inputRef = useRef<HTMLInputElement>(null)

    const handleChangeWidth = (e: any) => {
        if (isLoading) return
        if (!e.target.value) return
        if (parseFloat(e.target.value) < 1 || parseFloat(e.target.value) > 100) {
            toast.error(translate("widthbetween"))
        }
        if (parseFloat(e.target.value) < 100 && parseFloat(e.target.value) > 0) {
            if (onChangeValue)
                onChangeValue({ ...valRec, width: e.target.value })
            setValRec({ ...valRec, width: e.target.value });
        }
    }

    useEffect(() => {
        if (!origin) return
        setIsLoading(false)
        if (value && value.file) {
            setValRec({ ...valRec, file: { id: value.file.id, file: value.file.file } })
            setFiles((p) => [...p, { id: value.file.id, file: value.file.file }])
        } else if (value && value.url) {
            getFileFromLocalHost(value.url, origin + "/api/files/").then((val) => {
                if (val) {
                    setValRec({ ...valRec, file: { id: value.url, file: val } })
                    setFiles((p) => [...p, { id: value.url, file: val }])
                }
            });
        }
    }, [origin])

    useEffect(() => {
        if (isLoading) return
        if (files.length > 0) {
            setValRec({ ...valRec, file: files[0] })
            if (onChangeValue) {
                onChangeValue({ ...valRec, file: files[0] })
            };
        }else{
            setValRec({ ...valRec, file: null })
            if (onChangeValue) {
                onChangeValue({ ...valRec, file: null, url: "" })
            };
        }
    }, [files])

    return <div className='p-2 border rounded-md flex flex-col gap-4'>
        <ListFilesForm acceptedFileTypes={acceptedFileTypes} multiple={false} havetype='image' filesSelected={files} setFilesSelected={setFiles} />
        {widthControl && <div>
            <Label className='mb-2'>{translate("width")}</Label>
            <Input type="number" value={valRec.width ?? 0} onChange={handleChangeWidth} className='' />
        </div>}
        {/* <Input ref={inputRef} accept='image/*' type='file' onChange={(e) => {
            if (e.target.files) {
                setVal(e.target.value);
                if (onChangeValue) onChangeValue({ ...valRec, file: e.target.files[0] });
            }
        }} value={val} className='hidden' /> */}
    </div>
};

export const ImagePreview = ({ value, width,height, className,style }: any) => {
    const origin = useOrigin()
    const [preview, setPreview] = useState<string>("/not_found.jpg")

    useEffect(() => {
        setImage()
    }, [value, origin]);

    const setImage = async () => {
        if (value && value.file) {
            setPreview(URL.createObjectURL(value.file.file))
        }
        else if (value && value.url && value.url !== "") {
            if (!origin) return
            const response = await fetch(origin + "/api/files/" + value.url + "?allFile=true");

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setPreview(url);
        }

    }

    return (value && (value.file || value.url))
        ? <Image
            alt='imagepreview'
            src={preview}
            className={className ?? ""}
            width={width ?? 1000}
            height={height ?? 1000}
            style={style??{
                width: (value.width ?? 100) + "%",
                height: "auto",
                marginLeft: "auto",
                marginRight: "auto"
            }}
        />
        : <div className='w-full h-20 bg-border flex justify-center items-center'>
            <ImagePrev />
        </div>
}

export default ImageBuilder
