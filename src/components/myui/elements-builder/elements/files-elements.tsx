"use client"
import { downloadFileFromLocalHost, getFileFromLocalHost, ViewFileFromLocalHost } from '@/actions/localstorage/util-client';
import { useOrigin } from '@/hooks/use-origin';
import { File as FilePrev } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'
import FilePreview2 from '../../file-preview2';
import ListFilesForm from '@/app/admin/files/_component/list-files-form';

const FilesBuilder = ({ value, onChangeValue }: any) => {
    const [files, setFiles] = useState<any[] | []>(value && value.files ? value.files : [])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!origin) return
        setIsLoading(false)
        if (value && value.urls) {
            value.urls.forEach(async (val: any) => {
                if (val) {
                    setFiles((p) => [...p, { id: val.url, name: val.filename, mimeType: val.mimeType }])
                }
            })
        }
    }, [origin, value])

    useEffect(() => {
        if (isLoading) return
        if (onChangeValue) {
            onChangeValue({ files: files })
        }
    }, [files])

    return <div className='p-2 border rounded-md flex flex-col gap-4'>
        <ListFilesForm multiple={true} filesSelected={files} setFilesSelected={setFiles} notAllFiles={true} />
    </div>
};



export const FilesPreviewBuilder = ({ value }: any) => {
    const [preview, setPreview] = useState("/not_found.jpg")
    const [Files, setFiles] = useState<any[]>([])
    const [isLoading, setIsLoadin] = useState(true)
    const origin = useOrigin()

    useEffect(() => {
        setFileFetch()
    }, []);

    const setFileFetch = async () => {
        if (value && value.files) {
            value.files.forEach((f: any) => {
                setFiles((p) => [...p, f])
            })
        }
        else if (value && value.urls) {
            value.urls.forEach((val: any) => {
                if (val) {
                    setFiles((p) => [...p, { id: val.url, name: val.filename, mimeType: val.mimeType }])
                }
            })
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

    return (!isLoading && value && (value.files || value.urls))
        ?
        <div className='flex justify-center items-center p-2'>
            {((Files)
                ? <div className='flex gap-2 items-center justify-center'>
                    {
                        Files.map((f: any, index) => {
                            return (
                                <FilePreview2
                                    key={index}
                                    file={{ fileid: f.id, filename: f.name, filetype: f.mimeType }}
                                    onDownload={handleDownloadDirect}
                                    onView={handleView}
                                    size='w-40 h-48'
                                />
                            )
                        })
                    }
                </div>
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

export default FilesBuilder
