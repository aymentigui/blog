import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'; // Swapped Sheet with Popover
import { AlignVerticalSpaceAround, CaseSensitive, Code, Files, FileText, Image, Images, Link, Plus, Type, Video } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react'

const AddElement = ({ onAdd, langage }: any) => {
  const translate = useTranslations("Blogs")
  const translateSystem = useTranslations("System")
  const [open, setOpen] = useState(false);

  const options = [
    { label: translate("text")+" EditorJs", langage: langage, type: 'text2', icon: <FileText size={18} /> },
    { label: translate("text"), langage: langage, type: 'text', icon: <FileText size={18} /> },
    { label: translate("titlebig"), langage: langage, type: 'title', icon: <Type size={18} /> },
    { label: translate("titlemedium"), langage: langage, type: 'titleh2', icon: <Type size={18} /> },
    { label: translate("titlesmall"), langage: langage, type: 'titleh3', icon: <Type size={18} /> },
    { label: translate("paragraph"), langage: langage, type: 'paragraph', icon: <CaseSensitive size={18} /> },
    { label: translate("link"), langage: langage, type: 'link', icon: <Link size={18} /> },
    { label: translate("elementspaceplaceholder"), langage: langage, type: 'space', icon: <AlignVerticalSpaceAround size={18} /> },
    { label: translate("image"), langage: langage, type: 'image', icon: <Image size={18} /> },
    { label: translate("images"), langage: langage, type: 'images', icon: <Images size={18} /> },
    { label: translate("video"), langage: langage, type: 'video', icon: <Video size={18} /> },
    { label: translate("file"), langage: langage, type: 'file', icon: <FileText size={18} /> },
    { label: translate("files"), langage: langage, type: 'files', icon: <Files size={18} /> },
    { label: translate("code"), langage: langage, type: 'code', icon: <Code size={18} /> },
  ];

  const [filteredOptions, setFilteredOptions] = useState(options);


  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className='shadow-md'>
          <Plus size={18} />
        </Button>
      </PopoverTrigger>
      {/* The PopoverContent replaces the SheetContent. 
        It's styled for a fixed, small size for the "modern text editor" look.
      */}
      <PopoverContent className="w-96 p-0" align="start">
        <div className='p-2'>
          <Input
            type='text'
            onChange={(e) => setFilteredOptions(options.filter((option) => option.label.toLowerCase().includes(e.target.value.toLowerCase())))}
            placeholder={translateSystem("search")}
            className='font-normal h-8'
          />
        </div>
        {/* Added max-h-64 and overflow-y-auto to limit the height and allow scrolling */}
        <div className='grid grid-cols-2 gap-2 p-2 max-h-64 overflow-y-auto'>
          {filteredOptions.map(({ label, type, icon }) => (
            <Button
              key={type}
              onClick={() => { onAdd(type, langage); setOpen(false); }}
              variant='ghost' // Changed to ghost for a lighter "palette" feel
              className='flex flex-row h-10 justify-start space-x-2'
            >
              <span className='min-w-4'>{icon}</span>
              <span className='whitespace-nowrap overflow-hidden text-ellipsis'>{label}</span>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>

  );
}

export default AddElement