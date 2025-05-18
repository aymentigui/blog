"use client";
import { Card} from '@/components/ui/card';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslations } from 'next-intl';
import PreviewBuilder, { PreviewBuilderHtml } from '@/components/myui/elements-builder/preview-builder';
import ElementBuilder from '@/components/myui/elements-builder/element-builder';
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
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Select from "react-select";
import { useOrigin } from '@/hooks/use-origin';
import axios from 'axios';
import TitleCard from './title-card';
import DescriptionCard from './description-card';
import ImageProject from './image-project';
import { Label } from '@/components/ui/label';
import ContentCardProject from './content-card';

const AddProjectForm = ({ project, isAdd, categories, selectedCategories }: any) => {

    return <ProjectEditor isAdd={isAdd} project={project ?? {}} categories={categories} selectedCategories={selectedCategories} />;
};

const ProjectEditor = ({ project, isAdd, categories, selectedCategories }: any) => {

    const router = useRouter();
    const origin = useOrigin();
    const [components, setComponents] = useState<any>([]);
    const [htmlContent, setHtmlContent] = useState<any[]>([]);

    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [categoriesSelected, setCategoriesSelected] = useState<any[]>(selectedCategories ?? []);

    const [title, setTitle] = useState("");
    const [titleFr, setTitleFr] = useState("");
    const [titleAr, setTitleAr] = useState("");

    const [description, setDescription] = useState("");
    const [descriptionFr, setDescriptionFr] = useState("");
    const [descriptionAr, setDescriptionAr] = useState("");

    const translate = useTranslations("Projects")
    const translateSystem = useTranslations("System")

    useEffect(() => {
        fetchdata()
    }, [origin])

    useEffect(() => {

    }, [])

    const fetchdata = async () => {
        if (!origin) return
        if (project && project.image) {
            const res = await fetch(origin + "/api/files/" + project.image + "?allFile=true");
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            setImagePreview(url);
        }
        if (project && project.contents) {
            const newComponents = project.contents.map((comp: any, index: number) => ({ id: Date.now() + index, focus: false, value: JSON.parse(comp.data), type: comp.type, langage: comp.language }));
            setComponents(newComponents);
        }
        if (project && project.titles) {
            if (project.titles.find((title: any) => title.language === "en")) setTitle(project.titles.find((title: any) => title.language === "en").title)
            if (project.titles.find((title: any) => title.language === "fr")) setTitleFr(project.titles.find((title: any) => title.language === "fr").title)
            if (project.titles.find((title: any) => title.language === "ar")) setTitleAr(project.titles.find((title: any) => title.language === "ar").title)
        }
        if (project && project.description) {
            if (project.description.find((desc: any) => desc.language === "en")) setDescription(project.description.find((desc: any) => desc.language === "en").description)
            if (project.description.find((desc: any) => desc.language === "fr")) setDescriptionFr(project.description.find((desc: any) => desc.language === "fr").description)
            if (project.description.find((desc: any) => desc.language === "ar")) setDescriptionAr(project.description.find((desc: any) => desc.language === "ar").description)
        }
    }

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const addComponent = (type: any, langage: any) => {
        setComponents([...components, { id: Date.now(), type, langage }]);
    };

    const removeComponent = (id: any) => {
        setComponents(components.filter((comp: any) => comp.id !== id));
    };

    const handleSubmit = async () => {
        const titlesproject = []
        if (title) titlesproject.push({ value: title, language: "en" })
        if (titleFr) titlesproject.push({ value: titleFr, language: "fr" })
        if (titleAr) titlesproject.push({ value: titleAr, language: "ar" })
        const descriptionsproject = []
        if (description) descriptionsproject.push({ value: description, language: "en" })
        if (descriptionFr) descriptionsproject.push({ value: descriptionFr, language: "fr" })
        if (descriptionAr) descriptionsproject.push({ value: descriptionAr, language: "ar" })

        const formdata = new FormData();
        if (image) {
            formdata.append("file", image);
        }
        if (!isAdd && !imagePreview)
            formdata.append("deleteImage", "true");
        else
            formdata.append("deleteImage", "false");
        formdata.append("titles", JSON.stringify(titlesproject));
        formdata.append("descriptions", JSON.stringify(descriptionsproject));
        formdata.append("slug", "");
        formdata.append("categories", JSON.stringify(categoriesSelected));

        const contentsString = components.map((component: any) => {
            if (component.type === "image" || component.type === "video" || component.type === "file") {
                if (component.value.file) {
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
                    }
                } else {
                    return {
                        ...component,
                        value: {
                            ...component.value,
                            url: component.value.url
                        }
                    }
                }
            } else if (component.type === "files" || component.type === "images") {
                if (component.value.files) {
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
                    }
                } else {
                    return {
                        ...component,
                        value: {
                            ...component.value,
                            urls: component.value.urls
                        }
                    }
                }
            }
            else {
                return component
            }
        })
        formdata.append("contents", JSON.stringify(contentsString));

        for (let i = 0; i < components.length; i++) {
            if (components[i].type === "image" || components[i].type === "video" || components[i].type === "file") {
                formdata.append("files", components[i].value.file);
            }
        }

        if (isAdd) {
            const res = await axios.post(`${origin}/api/admin/project`, formdata)
            if (res.data.status === 200 && res.data.data && res.data.data.message) {
                toast.success(translateSystem("createsuccess"))
                router.push("/admin/projects")
            }
        } else {
            const res = await axios.put(`${origin}/api/admin/project/${project.id}`, formdata)
            if (res.data.status === 200 && res.data.data && res.data.data.message) {
                toast.success(translateSystem("updatesuccess"))
                router.push("/admin/projects")
            }
        }

        setHtmlContent(components);
    };

    const handleChangeValue = (id: any, value: any) => {
        const newComponents = components.map((comp: any) => {
            if (comp.id === id) {
                return { ...comp, value };
            }
            return comp;
        });
        setComponents(newComponents);
    }

    const showComponents = (lang: string) => {
        const setFocus = (id: any) => {
            const newComponents = components.map((comp: any) => {
                if (comp.id === id) {
                    return { ...comp, focus: true };
                }
                return { ...comp, focus: false };
            });
            setComponents(newComponents);
        }

        const setBlur = (id: any) => {
            const newComponents = components.map((comp: any) => {
                if (comp.id === id) {
                    return { ...comp, focus: false };
                }
                return comp;
            });
            setComponents(newComponents);
        }

        return <SortableContext
            items={components.map((component: any) => component.id)}
            strategy={verticalListSortingStrategy}
        >

            {components.map(({ id, type, langage, value, focus }: any) => (
                langage === lang && (
                    (focus === true) ? (
                        <ElementBuilder key={id} id={id} type={type} value={value} removeComponent={removeComponent} setBlur={setBlur} handleChangeValue={handleChangeValue} />
                    ) : (
                        <PreviewBuilder key={id} type={type} id={id} value={value} setFocus={setFocus} handleChangeValue={handleChangeValue} translate={translate} langage={langage} removeComponent={removeComponent} duplicateComponent={duplicateComponent} />
                    )
                )
            ))}

        </SortableContext>

    }

    const duplicateContents = (lang1: string, lang2: string) => {
        const newComponents: any[] = []
        components.forEach((comp: any, index: number) => {
            if (comp.langage === lang1) {
                newComponents.push({ ...comp, id: Date.now() + index, langage: lang2 });
            }
        })
        setComponents([...components, ...newComponents]);
    }

    const duplicateComponent = (id: any) => {
        const comp = components.find((comp: any) => comp.id === id)
        setComponents([...components, { ...comp, id: Date.now() }]);
    }

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event) {
            const file = event.target.files?.[0];
            if (file && file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreview(reader.result as string);
                    setImage(file);
                };
                reader.readAsDataURL(file);
            }
        } else {
            setImage(null);
            setImagePreview(null);
        }
    }

    const handleDragEnd = async (event: any) => {
        const { active, over } = event

        if (active.id !== over.id) {
            setComponents((items: any) => {
                const oldIndex = items.findIndex((item: any) => item.id === active.id)
                const newIndex = items.findIndex((item: any) => item.id === over.id)

                const newItems = arrayMove(items, oldIndex, newIndex)
                return newItems
            })
        }
    }

    const labelCategoryName = (category: any) => {
        return category.name + (category.namefr ? " (" + category.namefr + ")" : "") + (category.namear ? " (" + category.namear + ")" : "");
    }

    return (
        <Card className='p-4'>
            <div className='mb-4 flex flex-col gap-2'>
                <ImageProject imagePreview={imagePreview} fileInputRef={fileInputRef} handleImageChange={handleImageChange} setImagePreview={setImagePreview} />
                <Tabs defaultValue="en" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="en">{translate("titleen")}</TabsTrigger>
                        <TabsTrigger value="ar">{translate("titlear")}</TabsTrigger>
                        <TabsTrigger value="fr">{translate("titlefr")}</TabsTrigger>
                    </TabsList>
                    <TabsContent value="en">
                        <TitleCard title={title} setTitle={setTitle} lang="en" />
                    </TabsContent>
                    <TabsContent value="ar">
                        <TitleCard title={titleAr} setTitle={setTitleAr} lang="ar" />
                    </TabsContent>
                    <TabsContent value="fr">
                        <TitleCard title={titleFr} setTitle={setTitleFr} lang="fr" />
                    </TabsContent>
                </Tabs>
            </div>
            <div className='flex flex-col gap-2 my-2 border rounded p-4'>
                <Label className='font-semibold text-lg'>{translate("categories")}</Label>
                <Select
                    isMulti
                    options={
                        categories?.map((category: any) => ({
                            value: category.id,
                            label: category.name + (category.namefr ? " (" + category.namefr + ")" : "") + (category.namear ? " (" + category.namear + ")" : ""),
                        }))
                    }
                    value={categoriesSelected?.map((category) => ({
                        value: category,
                        label: labelCategoryName(categories?.find((ctg: any) => ctg.id === category)),
                    }))}
                    onChange={(selectedOptions) => {
                        setCategoriesSelected(selectedOptions.map((option: any) => option.value));
                    }}
                    placeholder={translate("selectcategories")}
                />
            </div>
            <div className='mb-4 flex flex-col gap-2'>
                <Tabs defaultValue="en" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="en">{translate("descriptionen")}</TabsTrigger>
                        <TabsTrigger value="ar">{translate("descriptionar")}</TabsTrigger>
                        <TabsTrigger value="fr">{translate("descriptionfr")}</TabsTrigger>
                    </TabsList>
                    <TabsContent value="en">
                        <DescriptionCard description={description} setDescription={setDescription} lang="en" />
                    </TabsContent>
                    <TabsContent value="ar">
                        <DescriptionCard description={descriptionAr} setDescription={setDescriptionAr} lang="ar" />
                    </TabsContent>
                    <TabsContent value="fr">
                        <DescriptionCard description={descriptionFr} setDescription={setDescriptionFr} lang="fr" />
                    </TabsContent>
                </Tabs>
            </div>
            <div className='flex flex-col gap-4'>
                <Tabs defaultValue="en" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="en">{translate("contentprojecten")}</TabsTrigger>
                        <TabsTrigger value="ar">{translate("contentprojectar")}</TabsTrigger>
                        <TabsTrigger value="fr">{translate("contentprojectfr")}</TabsTrigger>
                    </TabsList>
                    <TabsContent value="en">
                        <ContentCardProject showComponents={showComponents} duplicateContents={duplicateContents} sensors={sensors} handleDragEnd={handleDragEnd} addComponent={addComponent} lang="en" />
                    </TabsContent>
                    <TabsContent value="ar">
                        <ContentCardProject showComponents={showComponents} duplicateContents={duplicateContents} sensors={sensors} handleDragEnd={handleDragEnd} addComponent={addComponent} lang="ar" />
                    </TabsContent>
                    <TabsContent value="fr">
                        <ContentCardProject showComponents={showComponents} duplicateContents={duplicateContents} sensors={sensors} handleDragEnd={handleDragEnd} addComponent={addComponent} lang="fr" />
                    </TabsContent>
                </Tabs>

                <Button onClick={handleSubmit} variant='primary' className='mt-4'>{isAdd ? translate("addproject") : translate("updateproject")}</Button>
                <div>
                    {htmlContent.length > 0 &&
                        htmlContent.map((comp: any) => (
                            comp.langage === "en" && <PreviewBuilderHtml key={comp.id} type={comp.type} value={comp.value} />
                        ))
                    }
                </div>
            </div>
        </Card>
    );
};



export default AddProjectForm;
