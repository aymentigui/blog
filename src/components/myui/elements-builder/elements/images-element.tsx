"use client"
import ListFilesForm from '@/app/admin/files/_component/list-files-form';
import { useOrigin } from '@/hooks/use-origin';
import { Image as ImagePrev } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'
import MyImage from '../../my-image';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { getFileFromLocalHost } from '@/actions/localstorage/util-client';

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

const ImagesBuilder = ({ value, onChangeValue }: any) => {
    const [files, setFiles] = useState<any[] | []>(value && value.files ? value.files : [])
    const origin = useOrigin()
    const [ isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!origin) return
        setIsLoading(false)
        if (value && value.urls) {
            value.urls.forEach((url: any) => {
                getFileFromLocalHost(url.url, origin + "/api/files/").then((val) => {
                    if (val) {
                        setFiles((p) => [...p, { id: url.url, file: val }])
                    }
                })
               
            })
        }
    }, [origin])

    useEffect(() => {
        if(isLoading) return
        if (onChangeValue) {
            onChangeValue({ files: files })
        }
    }, [files])



    return <div className='p-2 border rounded-md flex flex-col gap-4'>
        <ListFilesForm acceptedFileTypes={acceptedFileTypes} multiple={true} havetype='image' filesSelected={files} setFilesSelected={setFiles} />
    </div>
};


export const ImagesPreview = ({ value }: any) => {
    const [files, setFiles] = useState<string[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");

    useEffect(() => {
        setImage();
    }, [value]);

    const setImage = async () => {
        if (value && value.files) {
            // Réinitialise les fichiers avant de les ajouter
            setFiles([]);
            value.files.forEach((f: any) => {
                setFiles((p) => [...p, URL.createObjectURL(f.file)]);
            });
        }
    };

    const handleImageClick = (image: string) => {
        setSelectedImage(image);
        setIsDialogOpen(true);
    };

    return value && (value.files || value.urls) ? (
        <>
            {value.files ? (
                <div className="flex flex-wrap justify-center">
                    {files.map((image: any, index: any) => {
                        return (
                            <div key={index} className="cursor-pointer" onClick={() => handleImageClick(image)}>
                                <Image
                                    alt="imagepreview"
                                    src={image}
                                    width={1000}
                                    height={1000}
                                    className="w-auto h-40 lg:h-80 object-contain"
                                />
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-wrap justify-center">
                    {value.urls.map((image: any, index: any) => {
                        return (
                            <div key={index} className="cursor-pointer" onClick={() => handleImageClick(image)}>
                                <MyImage
                                    alt="imagepreview"
                                    image={image.url}
                                    classNameProps="object-contain h-40 lg:h-80 w-auto"
                                />
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Dialog pour afficher l'image en plein écran */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTitle></DialogTitle>
                <DialogContent className="max-w-6xl max-h-[80vh] p-2">
                    {selectedImage && (
                        value.files ? (
                            <Image
                                alt="image fullscreen"
                                src={selectedImage}
                                width={1920}
                                height={1080}
                                className="w-full h-auto object-contain"
                            />
                        ) : (
                            <MyImage
                                alt="image fullscreen"
                                image={selectedImage}
                                classNameProps="object-contain w-full h-auto"
                            />
                        )
                    )}
                </DialogContent>
            </Dialog>
        </>
    ) : (
        <div className="w-full h-20 bg-border flex justify-center items-center">
            <ImagePrev />
        </div>
    );
};

export default ImagesBuilder
