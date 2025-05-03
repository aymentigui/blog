"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface LinkBuilderProps {
  value?: { link: string; text: string };
  onChangeValue?: (value: { link: string; text: string }) => void;
}

const LinkBuilder = ({ value, onChangeValue}: LinkBuilderProps) => {
  const [val, setVal] = useState(value ?? {link: "", text: ""});
  const translate = useTranslations("Blogs");

  return (
    <div>
      <Label className="mb-2">{translate("link")}</Label>
      <Input type="url" value={val.link} onChange={(e) => { setVal({...val, link: e.target.value}); if (onChangeValue) onChangeValue({ ...val, link: e.target.value}) }} placeholder={translate("linkplaceholder")} className="w-full p-2 mb-2 border rounded-md font-mono text-sm" />
      <Textarea
        rows={10}
        value={val.text}
        onChange={(e) => {
          setVal({...val, text: e.target.value});
          if (onChangeValue) onChangeValue({ ...val, text: e.target.value});
        }}
        placeholder={translate("linktextplaceholder")}
        className="w-full p-2 border rounded-md font-mono text-sm"
      />
    </div>
  );
};

interface LinkPreviewProps {
  value?: { link: string; text: string };
}

export const LinkPreview = ({ value }: LinkPreviewProps) => {
  return (
    <div className="p-4 border rounded-md shadow-md m-1">
      <a href={value&&value.link?value.link:"/#"} target="_blank" className="text-blue-500 hover:underline">
        {value&&value.text?value.text:"..."}
      </a>
    </div>
  );
};

export default LinkBuilder;
