"use client"
import { downloadFileFromLocalHost, getFileFromLocalHost, ViewFileFromLocalHost } from '@/actions/localstorage/util-client';
import { Input } from '@/components/ui/input';
import { useOrigin } from '@/hooks/use-origin';
import { SquareDashedMousePointer, File as FilePrev } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'
import FilePreview from '../../file-preview';

const FileBuilder = ({ value, onChangeValue }: any) => {
    const [valRec, setValRec] = useState(value ?? { file: null, url: null })
    const [val, setVal] = useState("")
    const translate = useTranslations("Blogs")
    const inputRef = useRef<HTMLInputElement>(null)


    return <div className='p-2 border rounded-md flex flex-col gap-4'>
        <div onClick={() => inputRef.current?.click()} className='p-2 border rounded-md cursor-pointer hover:shadow-md'>
            <SquareDashedMousePointer />{translate("fileplaceholder")} {value && value?.file && value?.file.name}
        </div>
        <Input ref={inputRef} type='file' onChange={(e) => {
            if (e.target.files) {
                setVal(e.target.value);
                if (onChangeValue) onChangeValue({ ...valRec, file: e.target.files[0] });
            }
        }} value={val} className='hidden' />
    </div>
};



export const FilePreviewBuilder = ({ value }: any) => {
    const [preview, setPreview] = useState("/not_found.jpg")
    const [File, setFile] = useState<File | null>(null)
    const [isLoading, setIsLoadin] = useState(true)
    const origin = useOrigin()

    useEffect(() => {
        setFileFetch()
    }, [value]);

    const setFileFetch = async () => {
        if (value && value.file) {
            setFile(value.file)
        }
        else if (value && value.url) {
            const file = await getFileFromLocalHost(value.url)
            setPreview("file")
            setFile(file)
        }
        setIsLoadin(false)
    }
    const handleDownloadDirect = async (id: string) => {
        if (!origin) return
        downloadFileFromLocalHost(id, origin + "/api/files/")
    }

    const handleView = async (id: string) => {
        if (!origin) return
        ViewFileFromLocalHost(id, origin + "/api/files/")
    }

    return (!isLoading && value && (value.file || value.url))
        ?
        <div className='flex justify-center items-center p-2'>
            {((value.file && File) ?
                <FilePreview
                    file={File}
                    size='w-40 h-48'
                />
                : (value.url && File)
                    ?
                    <FilePreview
                        file={File}
                        size='w-40 h-48'
                        onDownload={() => handleDownloadDirect(value.url)}
                        onView={() => handleView(value.url)}
                        fileId={value.url}
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
            )}
        </div>
        :
        <div className='w-full h-20 bg-border flex justify-center items-center'>
            <FilePrev />{File && File.name}
        </div>
}

export default FileBuilder
