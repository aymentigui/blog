"use client"
import { getFileFromLocalHost } from '@/actions/localstorage/util-client';
import ListFilesForm from '@/app/admin/files/_component/list-files-form';
import { Input } from '@/components/ui/input';
import GetImage from '@/hooks/use-getImage';
import { useOrigin } from '@/hooks/use-origin';
import { Label } from '@radix-ui/react-dropdown-menu';
import { SquareDashedMousePointer } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';

const acceptedFileTypes = {
    'video/*': [
        '.mp4',
        '.mov',
        '.wmv',
        '.flv',
        '.avi',
        '.mkv',
        '.webm',
        '.ogv',
        '.3gp',
        '.m4v',
    ]
}

const VideoBuilder = ({ value, onChangeValue }: any) => {
    const [valRec, setValRec] = useState(value ?? "")
    const [files, setFiles] = useState<any[] | []>([])
    const translate = useTranslations("Blogs")
    // const inputRef = useRef<HTMLInputElement>(null)
    const [isLoading, setIsLoading] = useState(true)

    const handleChangeWidth = (e: any) => {
        if (isLoading) return
        if (!e.target.value) return
        if (parseFloat(e.target.value) < 1 || parseFloat(e.target.value) > 100) {
            toast.error(translate("widthbetween"))
        }

        setValRec((p: any) => {
            if (parseFloat(e.target.value) < 100 && parseFloat(e.target.value) > 0) {
                if (onChangeValue)
                    onChangeValue({ ...p, width: e.target.value });
            }
            return { ...p, width: e.target.value }
        });
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
        }
    }, [files])

    return <div className='p-2 border rounded-md flex flex-col gap-4'>
        <ListFilesForm acceptedFileTypes={acceptedFileTypes} multiple={false} havetype='video' filesSelected={files} setFilesSelected={setFiles} />
        <div>
            <Label className='mb-2'>{translate("width")}</Label>
            <Input type="number" value={valRec.width ?? 0} onChange={handleChangeWidth} className='' />
        </div>
        {/* <Input ref={inputRef} accept='video/*' type='file' onChange={(e) => {
            if (e.target.files) {
                setVal(e.target.value);
                if (onChangeValue) onChangeValue({ ...valRec, file: e.target.files[0] });
            }
        }} value={val} className='hidden' /> */}
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
        ((preview !== "/not_found.jpg") ?
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
