"use client"
import { downloadFileFromLocalHost, ViewFileFromLocalHost } from '@/actions/localstorage/util-client';
import { useOrigin } from '@/hooks/use-origin';
import { File as FilePrev } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'
import FilePreview from '../../file-preview';
import FilePreview2 from '../../file-preview2';
import ListFilesForm from '@/app/admin/files/_component/list-files-form';

const FileBuilder = ({ value, onChangeValue }: any) => {
    const [files, setFiles] = useState<any[] | []>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!origin) return
        setIsLoading(false)
        if (value && value.file) {
            setFiles((p) => [...p, value.file])
        } else if (value && value.url) {
            setFiles((p) => [...p, { id: value.url, name: value.filename, mimeType: value.mimeType }])
        }
    }, [origin])

    useEffect(() => {
        if (isLoading) return
        if (files.length > 0) {
            if (onChangeValue) {
                onChangeValue({ file: files[0] })
            };
        }
    }, [files])

    return <div className='p-2 border rounded-md flex flex-col gap-4'>
        <ListFilesForm multiple={false} filesSelected={files} setFilesSelected={setFiles} notAllFiles={true} />
    </div>
};



export const FilePreviewBuilder = ({ value }: any) => {
    const [preview, setPreview] = useState("/not_found.jpg")
    const [File, setFile] = useState<any>(null)
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
            setFile({ id: value.url, name: value.filename, mimeType: value.mimeType })
        }
        setIsLoadin(false)
    }
    const handleDownloadDirect = async (id: string) => {
        if (!origin) return
        downloadFileFromLocalHost(id, File.name , origin + "/api/files/")
    }

    const handleView = async (id: string) => {
        if (!origin) return
        ViewFileFromLocalHost(id, origin + "/api/files/")
    }

    return (!isLoading && value && (value.file || value.url))
        ?
        <div className='flex justify-center items-center p-2'>
            {((File)
                ? <FilePreview2
                    file={{ fileid: File.id, filename: File.name, filetype: File.mimeType }}
                    onDownload={handleDownloadDirect}
                    onView={handleView}
                    size='w-40 h-48'
                />
                :
                <Image
                    alt='imagepreview'
                    src={preview}
                    width={100}
                    height={100}
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
