import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { useLocale, useTranslations } from 'next-intl'
import React, { useRef } from 'react'

const DescriptionCard = ({ description, setDescription, lang }: any) => {
  const translate = useTranslations('Projects')
  const ref = useRef<HTMLInputElement>(null)
  const locale = useLocale()

  return (
    <Card dir={locale === "ar" ? "rtl" : "ltr"}>
      <CardHeader>
        <CardTitle>{translate("description" + lang)}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2" dir={lang === "ar" ? "rtl" : "ltr"}>
        <Textarea
          rows={5}
          placeholder={translate("descriptionplaceholder")}
          value={description}
          onChange={
            (e) => {
              setDescription(e.target.value)
            }
          }
        />
      </CardContent>
    </Card>
  )
}

export default DescriptionCard
