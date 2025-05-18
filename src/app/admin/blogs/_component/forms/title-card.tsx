import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useLocale, useTranslations } from 'next-intl'
import React, { useRef } from 'react'

const TitleCard = ({ title, setTitle, lang }: any) => {
  const translate = useTranslations('Blogs')
  const ref = useRef<HTMLInputElement>(null)
  const locale = useLocale()

  return (
    <Card dir={locale === "ar" ? "rtl" : "ltr"}>
      <CardHeader>
        <CardTitle>{translate("title" + lang)}</CardTitle>
        <CardDescription>
          {translate("titledescription" + lang)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2" dir={lang === "ar" ? "rtl" : "ltr"}>
        <Input
          ref={ref}
          placeholder={translate("titleblog")}
          value={title}
          onChange={
            (e) => {
              setTitle(e.target.value)
            }
          }
        />
      </CardContent>
    </Card>
  )
}

export default TitleCard
