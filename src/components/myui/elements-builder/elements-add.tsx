import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { AlignVerticalSpaceAround, CaseSensitive, FileText, Image, Plus, Type, Video } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react'

const AddElement = ({ onAdd, langage }: any) => {
  const translate = useTranslations("Blogs")
  const translateSystem = useTranslations("System")
  const [open, setOpen] = useState(false);

  const options = [
    { label: translate("titlebig"), langage: langage, type: 'title', icon: <Type size={18} /> },
    { label: translate("titlemedium"), langage: langage, type: 'titleh2', icon: <Type size={18} /> },
    { label: translate("titlesmall"), langage: langage, type: 'titleh3', icon: <Type size={18} /> },
    { label: translate("paragraph"), langage: langage, type: 'paragraph', icon: <CaseSensitive size={18} /> },
    { label: translate("elementspaceplaceholder"), langage: langage, type: 'space', icon: <AlignVerticalSpaceAround size={18} /> },
    { label: translate("image"), langage: langage, type: 'image', icon: <Image size={18} /> },
    { label: translate("video"), langage: langage, type: 'video', icon: <Video size={18} /> },
    { label: translate("text"), langage: langage, type: 'text', icon: <FileText size={18} /> },
    { label: translate("file"), langage: langage, type: 'file', icon: <FileText size={18} /> },
  ];

  const [filteredOptions, setFilteredOptions] = useState(options);


  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className='shadow-md'>
          <Plus size={18} />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className='pt-8 pb-4'>
            <Input
              type='text'
              onChange={(e) => setFilteredOptions(options.filter((option) => option.label.toLowerCase().includes(e.target.value.toLowerCase())))}
              placeholder={translateSystem("search")}
              className='font-normal'
            />
          </SheetTitle>
        </SheetHeader>
        <div className="grid h-full py-4">
          <div className='grid grid-cols-2 gap-2 overflow-auto pb-12 px-1'>
            {filteredOptions.map(({ label, type, icon }) => (
              <Button key={type} onClick={() => { onAdd(type, langage); setOpen(false); }} variant='outline' className='flex flex-col h-20'>
                {icon} {label}
              </Button>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>

  );
}

export default AddElement
