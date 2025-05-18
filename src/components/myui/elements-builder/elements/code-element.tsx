"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBuilderProps {
  value?: string;
  onChangeValue?: (value: string) => void;
  language?: string;
}

const CodeBuilder = ({ value, onChangeValue, language = "javascript" }: CodeBuilderProps) => {
  const [val, setVal] = useState(value ?? "");
  const translate = useTranslations("Blogs");

  return (
    <div>
      <Label className="mb-2">{translate("code")}</Label>
      <Textarea
        rows={10}
        value={val}
        onChange={(e) => {
          setVal(e.target.value);
          if (onChangeValue) onChangeValue(e.target.value);
        }}
        placeholder={translate("codeplaceholder")}
        className="w-full p-2 border rounded-md font-mono text-sm"
      />
    </div>
  );
};

interface CodePreviewProps {
  value: string;
  language?: string;
}

export const CodePreview = ({ value, language = "javascript" }: CodePreviewProps) => {
  return (
    <SyntaxHighlighter language={language} style={vscDarkPlus} wrapLines={true} wrapLongLines={true}>
      {value ?? "// No code provided"}
    </SyntaxHighlighter>
  );
};

export default CodeBuilder;
