import AddElement from '@/components/myui/elements-builder/elements-add'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DndContext,closestCenter } from '@dnd-kit/core'
import { useLocale, useTranslations } from 'next-intl'
import React from 'react'

const ContentCardProject = ({ showComponents, duplicateContents, sensors, handleDragEnd, addComponent, lang }: any) => {
    const locale=useLocale()
    const translate = useTranslations('Projects')

    return (
        <Card dir={locale === "ar" ? "rtl" : "ltr"}>
            <CardHeader>
                <CardTitle>
                    <div className='flex justify-between items-center'>
                        <div>
                            {translate("contentproject")}
                        </div>
                        <div className='flex gap-2 font-normal text-xs'>
                            {lang !== "en" && <div onClick={() => duplicateContents("en", lang)} className='border py-1 px-2 rounded hover:bg-accent cursor-pointer'>{translate("getfromen")}</div>}
                            {lang !== "fr" && <div onClick={() => duplicateContents("fr", lang)} className='border py-1 px-2 rounded hover:bg-accent cursor-pointer'>{translate("getfromfr")}</div>}
                            {lang !== "ar" && <div onClick={() => duplicateContents("ar", lang)} className='border py-1 px-2 rounded hover:bg-accent cursor-pointer'>{translate("getfromar")}</div>}
                        </div>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2" dir={lang === "ar" ? "rtl" : "ltr"}>
                <div className='border rounded p-2'>
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        {showComponents(lang)}
                    </DndContext>
                </div>
                <AddElement onAdd={addComponent} langage={lang} />
            </CardContent>
        </Card>
    )
}

export default ContentCardProject
