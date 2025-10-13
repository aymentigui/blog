"use client"

import React, { useEffect, useRef, useMemo } from "react";
import { useTranslations } from "next-intl";
import exp from "constants";


// Définir la structure pour les données EditorJS
interface EditorData {
    blocks: any[];
    time?: number;
    version?: string;
}

// Définition de type pour les outils chargés dynamiquement
interface EditorTools {
    header: any;
    list: any;
    paragraph: any;
    table: any;
    image: any;
    code: any;
    quote: any;
    linkTool: any;
    checklist: any; 
}

const renderBlocksToHTML = (data: EditorData): string => {
    if (!data || !data.blocks || data.blocks.length === 0) {
        return "";
    }

    return data.blocks
        .map((block) => {
            switch (block.type) {
                case "header":
                    const level = block.data.level || 2;
                    // Adaptation du texte aux thèmes (text-white/text-gray-800)
                    return `<h${level} class="font-bold my-4 text-gray-800 dark:text-white theme-ocean:text-white">
                                ${block.data.text}
                            </h${level}>`;
                case "paragraph":
                    // Texte général (Dark/Ocean/White)
                    return `<p class="mb-3 leading-relaxed text-gray-700 dark:text-gray-300 theme-ocean:text-gray-300">${block.data.text}</p>`;
                
                // GESTION UNIFIÉE DES LISTES (ordered, unordered, checklist)
                case "list":
                    const style = block.data.style;
                    const items = block.data.items;

                    if (style === "checklist") {
                        // Rendu du style Checklist avec design amélioré pour 'disabled'
                        const itemsHtml = items
                            .map((item: { text: string, checked: boolean, content: string, meta: { checked: boolean } }) => {
                                const text = item.text || item.content; 
                                const checked = item.checked || (item.meta && item.meta.checked); 
                                const checkedAttr = checked ? 'checked' : '';
                                
                                // Classes pour la case à cocher (Utilise l'accent Ocean/Blue)
                                // Le design est géré par la classe "appearance-none" et l'arrière-plan/bordure
                                const checkboxDesign = checked
                                    ? 'bg-blue-600 border-blue-600 dark:bg-blue-500 dark:border-blue-500 theme-ocean:bg-blue-500 theme-ocean:border-blue-500' // Checked
                                    : 'bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-600 theme-ocean:bg-gray-700 theme-ocean:border-gray-600 '; // Unchecked

                                return `
                                    <div class="flex items-start mb-2">
                                        <div class="flex items-center h-5">
                                            <input type="checkbox" ${checkedAttr} disabled
                                                class="appearance-none w-4 h-4 rounded border-2 ${checkboxDesign} focus:ring-0 cursor-default relative top-0.5">
                                            ${checked ? '<svg class="absolute w-4 h-4 text-white pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>' : ''}
                                        </div>
                                        <span class="ml-3 text-sm font-medium ${checked ? 'text-gray-700 dark:text-gray-300 theme-ocean:text-gray-300' : 'text-gray-700 dark:text-gray-300'}">${text}</span>
                                    </div>
                                `;
                            })
                            .join('');
                        // Fond légèrement différent pour le bloc checklist
                        return `<div class="my-4 p-3 border border-gray-200 rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-700 theme-ocean:bg-gray-800 theme-ocean:border-gray-700">${itemsHtml}</div>`;

                    } else {
                        // Rendu des listes Ordered (ol) et Unordered (ul)
                        const tag = style === "ordered" ? "ol" : "ul";
                        const listItems = items
                            .map((item: any) => `<li class="ml-5 mb-1 text-gray-700 dark:text-gray-300 theme-ocean:text-gray-300">${item.content}</li>`)
                            .join("");
                        
                        const listClass = style === "ordered" ? 'list-decimal' : 'list-disc';
                        return `<${tag} class="${listClass} list-inside my-3">${listItems}</${tag}>`;
                    }
                
                case "table":
                    const rowsHtml = block.data.content
                        .map((row: string[], rowIndex: number) => {
                            const cellTag = rowIndex === 0 && block.data.withHeadings ? 'th' : 'td';
                            // Adaptation du fond et du texte aux thèmes
                            const cellClasses = cellTag === 'th' 
                                ? 'bg-gray-100 dark:bg-gray-700 font-semibold text-gray-800 dark:text-gray-100 theme-ocean:text-gray-100 theme-ocean:bg-gray-700' 
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 theme-ocean:text-gray-300 theme-ocean:bg-gray-800';
                            
                            const cells = row.map((cell) => 
                                `<${cellTag} class="px-4 py-2 border border-gray-300 dark:border-gray-600 theme-ocean:border-gray-600 ${cellClasses}">${cell}</${cellTag}>`
                            ).join('');
                            return `<tr>${cells}</tr>`;
                        }).join('');

                    return `<div class="editorjs-table-wrapper my-4 overflow-x-auto">
                                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-600 theme-ocean:divide-gray-600 border-collapse border border-gray-300 dark:border-gray-600 theme-ocean:border-gray-600">
                                    <tbody>${rowsHtml}</tbody>
                                </table>
                            </div>`;

                case "image":
                    const caption = block.data.caption ? `<figcaption class="text-center text-sm text-gray-500 dark:text-gray-400 theme-ocean:text-gray-400 mt-1">${block.data.caption}</figcaption>` : '';
                    return `
                        <figure class="my-6">
                            <img src="${block.data.file.url}" alt="${block.data.caption || 'Image content'}" class="rounded-lg shadow-md mx-auto" style="max-width: 100%; height: auto;"/>
                            ${caption}
                        </figure>
                    `;
                
                case "code":
                    // Fond Dark pour le code, fonctionne pour tous les thèmes
                    return `
                        <pre class="bg-gray-900 text-white p-4 rounded-md overflow-x-auto my-4">
                            <code class="language-${block.data.language || 'text'}">${block.data.code}</code>
                        </pre>
                    `;

                case "quote":
                    const cite = block.data.caption ? `<cite class="block text-sm font-medium text-gray-500 dark:text-gray-400 theme-ocean:text-gray-400 mt-2">— ${block.data.caption}</cite>` : '';
                    // Bordure et fond utilisant l'accent Blue/Ocean
                    return `
                        <figure class="my-4 p-4 border-l-4 border-blue-600 bg-blue-50 dark:bg-gray-700 theme-ocean:bg-gray-700 dark:border-blue-500 theme-ocean:border-blue-500 text-gray-700 dark:text-gray-200 theme-ocean:text-gray-200">
                            <blockquote class="italic text-lg">${block.data.text}</blockquote>
                            ${cite}
                        </figure>
                    `;

                case "linkTool":
                    const linkData = block.data.meta || {};
                    // Adaptation du fond et des bordures
                    return `
                        <div class="my-4 p-3 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition duration-200 flex space-x-4 bg-white dark:bg-gray-800 theme-ocean:bg-gray-800 dark:border-gray-700 theme-ocean:border-gray-700">
                            ${linkData.image ? `<img src="${linkData.image.url}" class="w-20 h-20 object-cover rounded-md flex-shrink-0">` : ''}
                            <div class="flex-grow">
                                <h4 class="text-blue-600 hover:text-blue-700 dark:text-blue-400 theme-ocean:text-blue-400 font-semibold text-base">
                                    <a href="${block.data.link}" target="_blank">${linkData.title || block.data.link}</a>
                                </h4>
                                <p class="text-gray-500 dark:text-gray-400 theme-ocean:text-gray-400 text-sm line-clamp-2">${linkData.description || 'Lien externe.'}</p>
                            </div>
                        </div>
                    `;

                default:
                    return "";
            }
        })
        .join("");
};


// ======================================================================
// 2. COMPOSANT D'AFFICHAGE (EditorJsPreview)
// ======================================================================

const EditorJsPreview = ({ value }: { value?: EditorData }) => {
    const t = useTranslations("Blogs");

    const htmlContent = useMemo(() => {
        if (!value) return "";
        return renderBlocksToHTML(value);
    }, [value]);

    return (
        <div>
            {
                (htmlContent) ?
                    // Le conteneur parent doit supporter les classes 'dark:' pour que les styles s'appliquent
                    <div className='editorjs-preview-content' dangerouslySetInnerHTML={{ __html: htmlContent }} />
                    :
                    <div className='text-gray-400 p-2'>{t("text")}</div>
            }
        </div>
    );
};


export default EditorJsPreview;