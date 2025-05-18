import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Camera, Trash2, Upload } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const ImageProject = ({ imagePreview, fileInputRef, handleImageChange, setImagePreview }: any) => {
    return (
        <div className="relative w-full h-48" >
            <Input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageChange}
            />
            <div 
            onClick={()=>{
                handleImageChange(null);
                setImagePreview(null);
            }}
            className='absolute right-2 top-2 border bg-accent rounded hover:bg-red-500 hover:text-white cursor-pointer z-10 p-2'>
                <Trash2 size={20} />
            </div>
            <div
                className={cn(
                    "border flex items-center justify-center cursor-pointer relative overflow-hidden",
                    "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 transition-all",
                    "rounded-md",
                    "w-full h-48"
                )}
                onClick={() => fileInputRef.current?.click()}
            >
                {imagePreview ?
                    <Image
                        height={100}
                        width={100}
                        src={imagePreview}
                        alt="Avatar"
                        className="object-contain w-full h-48"
                    />
                    : (
                        <Upload className="w-10 h-10 text-gray-500" />
                    )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                    <Camera className="w-8 h-8 text-white" />
                </div>
            </div>
        </div>
    )
}

export default ImageProject
