"use client";
import React, { useEffect, useRef, useMemo } from "react";
// Importer le cœur d'EditorJS
import EditorJS from "@editorjs/editorjs";

import { useTranslations } from "next-intl";

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

// ======================================================================
// 3. COMPOSANT D'ÉDITION (EditorJsBuilder) - CORRIGÉ
// ======================================================================

const EditorJsBuilder = ({
    value,
    onChangeValue,
}: {
    value?: EditorData;
    onChangeValue?: (data: EditorData) => void;
}) => {
    const editorInstance = useRef<EditorJS | null>(null);
    const editorContainerId = useMemo(() => `editorjs-${Date.now()}`, []);
    const placeholder = useTranslations("TextEditor");
    const didMount = useRef(false);

    useEffect(() => {
        if (didMount.current) return;
        didMount.current = true;

        if (!editorContainerId) return;

        if (editorInstance.current) {
            editorInstance.current.destroy();
            editorInstance.current = null;
        }

        // Chargement dynamique des outils
        const tools: EditorTools = {
            header: require("@editorjs/header"),
            list: require("@editorjs/list"),
            paragraph: require("@editorjs/paragraph"),
            table: require("@editorjs/table"),
            image: require("@editorjs/image"),
            code: require("@editorjs/code"),
            quote: require("@editorjs/quote"),
            linkTool: require("@editorjs/link"),
            checklist: require("@editorjs/checklist"),
        };
        
        const getToolClass = (tool: any) => tool.default || tool;

        const editor = new EditorJS({
            holder: editorContainerId,
            autofocus: true,
            placeholder: placeholder("placeholder"),
            data: value || { blocks: [] },
            
            tools: {
                header: { 
                    class: getToolClass(tools.header), 
                    inlineToolbar: true, 
                    config: { 
                        placeholder: "Enter a heading", 
                        levels: [1, 2, 3], 
                        defaultLevel: 2 
                    } 
                },
                list: { 
                    class: getToolClass(tools.list), 
                    inlineToolbar: true 
                }, 
                paragraph: { 
                    class: getToolClass(tools.paragraph), 
                    inlineToolbar: true 
                },
                table: { 
                    class: getToolClass(tools.table), 
                    inlineToolbar: true, 
                    config: { rows: 2, cols: 3 } 
                },
                image: {
                    class: getToolClass(tools.image),
                    config: {
                        // Configuration simplifiée et fonctionnelle pour l'image
                        uploader: {
                            // Méthode pour upload par URL
                            uploadByFile: (file: File) => {
                                return new Promise((resolve) => {
                                    // Créer une URL locale pour l'image
                                    const reader = new FileReader();
                                    reader.onload = (e) => {
                                        resolve({
                                            success: 1,
                                            file: {
                                                url: e.target?.result as string
                                            }
                                        });
                                    };
                                    reader.readAsDataURL(file);
                                });
                            },
                            // Méthode pour upload par URL
                            uploadByUrl: (url: string) => {
                                return Promise.resolve({ 
                                    success: 1, 
                                    file: { url } 
                                });
                            }
                        },
                        // Désactiver temporairement les endpoints externes si non configurés
                        endpoints: {
                            byFile: '', // Laisser vide pour utiliser uploadByFile
                            byUrl: '',  // Laisser vide pour utiliser uploadByUrl
                        }
                    }
                },
                code: { 
                    class: getToolClass(tools.code) 
                },
                quote: { 
                    class: getToolClass(tools.quote), 
                    inlineToolbar: true, 
                    config: { 
                        quotePlaceholder: 'Enter a quote', 
                        captionPlaceholder: 'Quote source' 
                    } 
                },
                linkTool: { 
                    class: getToolClass(tools.linkTool), 
                    config: { 
                        endpoint: '/api/link-data' 
                    } 
                },
                checklist: { 
                    class: getToolClass(tools.checklist), 
                    inlineToolbar: true 
                }, 
            },
            
            async onChange(api, event) {
                if (onChangeValue) {
                    try {
                        const data = await api.saver.save();
                        onChangeValue(data as EditorData);
                    } catch (error) {
                        console.error('Error saving editor data:', error);
                    }
                }
            },

            onReady: () => {
                // console.log('Editor.js is ready');
            },
        });

        editorInstance.current = editor;

        return () => {
            if (editorInstance.current) {
                editorInstance.current.destroy();
                editorInstance.current = null;
            }
        };
    }, []);

    return (
        <div>
            <div
                id={editorContainerId}
                className="bg-white p-4 border border-gray-300 rounded-md text-black min-h-[200px]"
                dir="ltr"
            />
        </div>
    );
};

export default EditorJsBuilder