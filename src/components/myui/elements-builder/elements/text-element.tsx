"use client";
import React, { useEffect, useRef, useState } from "react";
import "quill/dist/quill.snow.css"; // Import du thème CSS de Quill
import { useTranslations } from "next-intl";

const TextBuilder = ({ value, onChangeValue }: { value?: string, onChangeValue?: any }) => {
    const quillRef = useRef<HTMLDivElement | null>(null);
    const [content, setContent] = useState<string>("");
    const placeholder = useTranslations("TextEditor")

    useEffect(() => {
        const Quill = require("quill").default;
        const Widget = require("quill-table-widget").default;

        Quill.register("modules/tableWidget", Widget);

        const quill = new Quill(quillRef.current, {
            theme: "snow",
            modules: {
                toolbar: [
                    [{ font: ["Cario", "serif", "sans-serif", "monospace"] }],
                    [{ size: ["small", false, "large", "huge"] }],
                    [{ color: [] }, { background: [] }],
                    [{ header: "1" }, { header: "2" }, { header: "3" }],
                    [{ header: [1, 2, 3, false] }],
                    ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    [{ align: [] }],
                    ["link"],
                    ["clean"],
                ],
                table: true,
                tableWidget: {
                    toolbarOffset: -1,
                    maxSize: [20, 20],
                },
            },
            placeholder: placeholder("placeholder"),
        });

        if (value)
            quill.root.innerHTML = value;

        quill.on("text-change", () => {
            setContent(quill.root.innerHTML);
            if (onChangeValue)
                onChangeValue(quill.root.innerHTML)
        });

        //@ts-ignore
        quillRef.current!.quill = quill;

        return () => {
            quill.off("text-change");
        };
    }, []);

    return (
        <div>
            <div className="bg-white p-2 border border-white rounded-md text-black" dir="ltr">
                <div ref={quillRef} style={{ height: "300px" }} />
                <div className="hidden">
                    <div className='' dangerouslySetInnerHTML={{ __html: content }} />
                </div>
            </div>
        </div>
    );
};


export const TextPreview = ({ value }: { value: string }) => {

    return (
        <div>
            {
                (value && value !== undefined) ?
                    <div className='' dangerouslySetInnerHTML={{ __html: value }} />
                    :
                    <div className='text-gray-400 p-2'>{useTranslations("Blogs")("text")}</div>
            }
        </div>
    )
}

export default TextBuilder;