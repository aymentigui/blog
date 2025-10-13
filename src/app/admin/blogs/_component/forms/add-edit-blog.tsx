"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import axios from 'axios';
import Select from "react-select";

// Dnd-kit imports
import {
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'

// Component imports
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';

// Custom components
import PreviewBuilder from '@/components/myui/elements-builder/preview-builder';
import ElementBuilder from '@/components/myui/elements-builder/element-builder';
import { useOrigin } from '@/hooks/use-origin';

// Form sections
import TitleCard from './title-card';
import DescriptionCard from './description-card';
import ImageBlog from './image-blog';
import ContentCardBlog from './content-card';
import ImageBuilder, { ImagePreview } from '@/components/myui/elements-builder/elements/image-element';
import { CircleCheck, Pen } from 'lucide-react';
import Image from 'next/image';

// Types
interface BlogContent {
    id: number;
    type: string;
    langage: string;
    value: any;
    focus?: boolean;
}

interface BlogTitle {
    value: string;
    language: string;
}

interface BlogDescription {
    value: string;
    language: string;
}

interface Category {
    id: string;
    name: string;
    namefr?: string;
    namear?: string;
}

interface BlogEditorProps {
    blog?: any;
    isAdd: boolean;
    categories: Category[];
    selectedCategories?: string[];
}

// Constants
const SUPPORTED_LANGUAGES = ['en', 'fr', 'ar'] as const;
type Language = typeof SUPPORTED_LANGUAGES[number];

// Main Component
const AddBlogForm = ({ blog, isAdd, categories, selectedCategories }: BlogEditorProps) => {
    return (
        <BlogEditor
            isAdd={isAdd}
            blog={blog ?? {}}
            categories={categories}
            selectedCategories={selectedCategories}
        />
    );
};

const BlogEditor = ({ blog, isAdd, categories, selectedCategories }: BlogEditorProps) => {
    const router = useRouter();
    const origin = useOrigin();
    const translate = useTranslations("Blogs");
    const translateSystem = useTranslations("System");
    const locale = useLocale();

    // State management
    const [components, setComponents] = useState<BlogContent[]>([]);
    // const [image, setImage] = useState<File | null>(null);
    // const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [image2, setImage2] = useState<any>(null);
    const [previewImage2, setPreviewImage2] = useState<Boolean>(true);
    const [categoriesSelected, setCategoriesSelected] = useState<string[]>(selectedCategories ?? []);

    // Title states
    const [titles, setTitles] = useState({
        en: "",
        fr: "",
        ar: ""
    });

    // Description states
    const [descriptions, setDescriptions] = useState({
        en: "",
        fr: "",
        ar: ""
    });

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // Sensors for drag and drop
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Data initialization
    useEffect(() => {
        initializeBlogData();
    }, [origin]);

    const initializeBlogData = useCallback(async () => {
        if (!origin || !blog) return;

        try {
            await initializeImage();
            initializeTitles();
            initializeDescriptions();
            initializeContents();
        } catch (error) {
            console.error('Error initializing blog data:', error);
        }
    }, [blog, origin]);

    const initializeImage = async () => {
        if (blog?.image && blog.image !== "") {
            setImage2({
                id: blog.image,
                url: blog?.image,
            });
        }
    };

    const initializeTitles = () => {
        if (blog?.titles) {
            const newTitles = { ...titles };
            SUPPORTED_LANGUAGES.forEach(lang => {
                const title = blog.titles.find((t: BlogTitle) => t.language === lang);
                if (title) newTitles[lang] = title.title;
            });
            setTitles(newTitles);
        }
    };

    const initializeDescriptions = () => {
        if (blog?.description) {
            const newDescriptions = { ...descriptions };
            SUPPORTED_LANGUAGES.forEach(lang => {
                const desc = blog.description.find((d: BlogDescription) => d.language === lang);
                if (desc) newDescriptions[lang] = desc.description;
            });
            setDescriptions(newDescriptions);
        }
    };

    const initializeContents = () => {
        if (blog?.contents) {
            const newComponents = blog.contents.map((comp: any, index: number) => ({
                id: Date.now() + index,
                focus: false,
                value: JSON.parse(comp.data),
                type: comp.type,
                langage: comp.language
            }));
            setComponents(newComponents);
        }
    };

    // Component management
    const addComponent = (type: string, langage: Language) => {
        setComponents(prev => [...prev, {
            id: Date.now(),
            type,
            langage,
            value: null,
            focus: false
        }]);
    };

    const removeComponent = (id: number) => {
        setComponents(prev => prev.filter(comp => comp.id !== id));
    };

    const duplicateComponent = (id: number) => {
        const comp = components.find(comp => comp.id === id);
        if (comp) {
            setComponents(prev => [...prev, { ...comp, id: Date.now() }]);
        }
    };

    const handleChangeValue = (id: number, value: any) => {
        setComponents(prev => prev.map(comp =>
            comp.id === id ? { ...comp, value } : comp
        ));
    };

    const setComponentFocus = (id: number, focus: boolean) => {
        setComponents(prev => prev.map(comp =>
            comp.id === id ? { ...comp, focus } : comp
        ));
    };

    // Drag and drop handlers
    const handleDragEnd = (event: any) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setComponents((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    // Content duplication
    const duplicateContents = (sourceLang: Language, targetLang: Language) => {
        const newComponents = components
            .filter(comp => comp.langage === sourceLang)
            .map((comp, index) => ({
                ...comp,
                id: Date.now() + index,
                langage: targetLang
            }));
        setComponents(prev => [...prev, ...newComponents]);
    };

    // Image handlers
    // const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = event.target.files?.[0];
    //     if (file && file.type.startsWith("image/")) {
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             setImagePreview(reader.result as string);
    //             setImage(file);
    //         };
    //         reader.readAsDataURL(file);
    //     } else {
    //         setImage(null);
    //         setImagePreview(null);
    //     }
    // };

    // Form submission
    const handleSubmit = async () => {
        try {
            const formData = prepareFormData();

            const url = isAdd
                ? `${origin}/api/admin/blog`
                : `${origin}/api/admin/blog/${blog.id}`;

            const method = isAdd ? axios.post : axios.put;

            const res = await method(url, formData);

            if (res.data.status === 200 && res.data.data?.message) {
                toast.success(translateSystem(isAdd ? "createsuccess" : "updatesuccess"));
                router.push("/admin/blogs");
            }
        } catch (error) {
            console.error('Error submitting blog:', error);
            toast.error(translateSystem("error"));
        }
    };

    const prepareFormData = (): FormData => {
        const formData = new FormData();
        // Image handling
        if (image2 && image2.file && image2.file.file) {
            formData.append("file", image2.file.file);
        }
        formData.append("deleteImage", (!isAdd && !image2) ? "true" : "false");

        // Titles and descriptions
        formData.append("titles", JSON.stringify(prepareTitles()));
        formData.append("descriptions", JSON.stringify(prepareDescriptions()));
        formData.append("slug", "");
        formData.append("categories", JSON.stringify(categoriesSelected));
        formData.append("contents", JSON.stringify(prepareContents()));

        // File attachments
        attachFilesToFormData(formData);

        return formData;
    };

    const prepareTitles = (): BlogTitle[] => {
        return SUPPORTED_LANGUAGES
            .filter(lang => titles[lang])
            .map(lang => ({ value: titles[lang], language: lang }));
    };

    const prepareDescriptions = (): BlogDescription[] => {
        return SUPPORTED_LANGUAGES
            .filter(lang => descriptions[lang])
            .map(lang => ({ value: descriptions[lang], language: lang }));
    };

    const prepareContents = () => {
        return components.map(component => {
            if (['image', 'video', 'file'].includes(component.type)) {
                return processSingleFileComponent(component);
            } else if (['files', 'images'].includes(component.type)) {
                return processMultiFileComponent(component);
            }
            return component;
        });
    };

    const processSingleFileComponent = (component: BlogContent) => {
        if (component.value?.file) {
            return {
                ...component,
                value: {
                    ...component.value,
                    url: component.value.file.id,
                    filename: component.value.file.name,
                    size: component.value.file.size,
                    type: component.value.file.type,
                    mimeType: component.value.file.mimeType,
                    file: null
                }
            };
        }
        return component;
    };

    const processMultiFileComponent = (component: BlogContent) => {
        if (component.value?.files) {
            return {
                ...component,
                value: {
                    ...component.value,
                    urls: component.value.files.map((f: any) => ({
                        url: f.id,
                        filename: f.name,
                        size: f.size,
                        type: f.type,
                        mimeType: f.mimeType
                    })),
                    files: null
                }
            };
        }
        return component;
    };

    const attachFilesToFormData = (formData: FormData) => {
        components.forEach(component => {
            if (['image', 'video', 'file'].includes(component.type) && component.value?.file) {
                formData.append("files", component.value.file);
            }
        });
    };

    // Component rendering
    const renderComponents = (lang: Language) => {
        const langComponents = components.filter(comp => comp.langage === lang);

        return (
            <SortableContext
                items={langComponents.map(component => component.id)}
                strategy={verticalListSortingStrategy}
            >
                {langComponents.map(({ id, type, value, focus }) => (
                    focus ? (
                        <ElementBuilder
                            key={id}
                            id={id}
                            type={type}
                            value={value}
                            removeComponent={removeComponent}
                            setBlur={() => setComponentFocus(id, false)}
                            handleChangeValue={handleChangeValue}
                        />
                    ) : (
                        <PreviewBuilder
                            key={id}
                            type={type}
                            id={id}
                            value={value}
                            setFocus={() => setComponentFocus(id, true)}
                            handleChangeValue={handleChangeValue}
                            translate={translate}
                            langage={lang}
                            removeComponent={removeComponent}
                            duplicateComponent={duplicateComponent}
                        />
                    )
                ))}
            </SortableContext>
        );
    };

    // Helper functions
    const getCategoryLabel = (categoryId: string): string => {
        const category = categories.find(cat => cat.id === categoryId);
        if (!category) return '';

        let label = category.name;
        if (category.namefr) label += ` (${category.namefr})`;
        if (category.namear) label += ` (${category.namear})`;

        return label;
    };

    const handleTitleChange = (lang: Language, value: string) => {
        setTitles(prev => ({ ...prev, [lang]: value }));
    };

    const handleDescriptionChange = (lang: Language, value: string) => {
        setDescriptions(prev => ({ ...prev, [lang]: value }));
    };

    // Select options
    const categoryOptions = categories.map(category => ({
        value: category.id,
        label: getCategoryLabel(category.id)
    }));

    const selectedCategoryOptions = categoriesSelected.map(categoryId => ({
        value: categoryId,
        label: getCategoryLabel(categoryId)
    }));

    return (
        <Card className='p-4'>
            {/* Image Section */}
            <div className='mb-4 flex flex-col gap-2'>
                {/* <ImageBlog
                    imagePreview={imagePreview}
                    fileInputRef={fileInputRef}
                    handleImageChange={handleImageChange}
                    setImagePreview={setImagePreview}
                /> */}
                <div className='relative'>
                    {
                        previewImage2
                            ? <Button onClick={() => setPreviewImage2(false)} className={'absolute border bg-red-500 w-8 h-8 p-2 top-4 rounded-md text-white ' + (locale === "ar" ? "left-2" : "right-2 ")}>
                                <Pen />
                            </Button>
                            : <Button onClick={() => setPreviewImage2(true)} className={'absolute border bg-green-500 w-8 h-8 p-2 top-6 rounded-md text-white ' + (locale === "ar" ? "left-4" : "right-4 ")}>
                                <CircleCheck size={20} />
                            </Button>
                    }
                    {
                        previewImage2
                            ?
                            <ImagePreview value={image2} height={100} width={100} style="" className="object-contain w-full h-48" />
                            : (
                                <div className='mt-2'>
                                    <ImageBuilder
                                        widthControl={false}
                                        value={image2}
                                        onChangeValue={(val: any) => setImage2(val)}
                                    />
                                </div>
                            )
                    }
                </div>

                {/* Titles Section */}
                <Tabs defaultValue="en" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        {SUPPORTED_LANGUAGES.map(lang => (
                            <TabsTrigger key={lang} value={lang}>
                                {translate(`title${lang}`)}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {SUPPORTED_LANGUAGES.map(lang => (
                        <TabsContent key={lang} value={lang}>
                            <TitleCard
                                title={titles[lang]}
                                setTitle={(value: any) => handleTitleChange(lang, value)}
                                lang={lang}
                            />
                        </TabsContent>
                    ))}
                </Tabs>
            </div>

            {/* Categories Section */}
            <div className='flex flex-col gap-2 my-2 border rounded p-4'>
                <Label className='font-semibold text-lg'>{translate("categories")}</Label>
                <Select
                    isMulti
                    options={categoryOptions}
                    value={selectedCategoryOptions}
                    onChange={(selectedOptions) => {
                        setCategoriesSelected(selectedOptions.map(option => option.value));
                    }}
                    placeholder={translate("selectcategories")}
                />
            </div>

            {/* Descriptions Section */}
            <div className='mb-4 flex flex-col gap-2'>
                <Tabs defaultValue="en" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        {SUPPORTED_LANGUAGES.map(lang => (
                            <TabsTrigger key={lang} value={lang}>
                                {translate(`description${lang}`)}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {SUPPORTED_LANGUAGES.map(lang => (
                        <TabsContent key={lang} value={lang}>
                            <DescriptionCard
                                description={descriptions[lang]}
                                setDescription={(value: any) => handleDescriptionChange(lang, value)}
                                lang={lang}
                            />
                        </TabsContent>
                    ))}
                </Tabs>
            </div>

            {/* Content Section */}
            <div className='flex flex-col gap-4'>
                <Tabs defaultValue="en" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        {SUPPORTED_LANGUAGES.map(lang => (
                            <TabsTrigger key={lang} value={lang}>
                                {translate(`contentblog${lang}`)}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {SUPPORTED_LANGUAGES.map(lang => (
                        <TabsContent key={lang} value={lang}>
                            <ContentCardBlog
                                showComponents={() => renderComponents(lang)}
                                duplicateContents={duplicateContents}
                                sensors={sensors}
                                handleDragEnd={handleDragEnd}
                                addComponent={addComponent}
                                lang={lang}
                            />
                        </TabsContent>
                    ))}
                </Tabs>

                <Button
                    onClick={handleSubmit}
                    variant='primary'
                    className='mt-4'
                >
                    {isAdd ? translate("addblog") : translate("updateblog")}
                </Button>
            </div>
        </Card>
    );
};

export default AddBlogForm;