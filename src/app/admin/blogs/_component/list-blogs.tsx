"use client"
import React, { useEffect, useState } from 'react'
import { getBlogsCount, getBlogsDesc } from '@/actions/blog/get'
import { useLocale, useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useOrigin } from '@/hooks/use-origin'
import Loading from '@/components/myui/loading'
import { DataTable } from './data-table-blogs/data-table'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, Clock, Eye, LayoutGrid, PenLine, TableOfContents } from 'lucide-react'
import SelectFetch from '@/components/myui/select-fetch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { fetchCategories } from '@/actions/blog/util-client'

const ListBlogs = ({ hideFliterPageSize }: any) => {

    const translate = useTranslations("BlogPage")
    const translateSystem = useTranslations("System");
    const translateBlogs = useTranslations("Blogs");
    const locale = useLocale()
    const origin = useOrigin()
    const searchParams = useSearchParams();


    const [sortBy, setSortBy] = useState("recent")
    const [mine, setMine] = useState(false)
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [page, setPage] = useState(searchParams.get("page") ? Number(searchParams.get("page")) : 1);
    const [pageSize, setPageSize] = useState(10);
    const [count, setCount] = useState(0);
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(""); // Etat pour la recherche avec debounce

    const [isLoadingC, setIsLoadingC] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const [data, setData] = useState<any[]>([]);

    const handleCategoryToggle = (category: string) => {
        setSelectedCategories((prev) =>
            prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
        )
    }

    const handleClearFilters = () => {
        setDebouncedSearchQuery("")
        setSelectedCategories([])
        setSortBy("recent")
        setMine(false)
    }

    useEffect(() => {
        setMounted(true);
        fetchCategories(setCategories, setIsLoadingC)
    }, []);


    useEffect(() => {
        fetchBlogs();
    }, [page, mounted]); // Ajouter debouncedSearchQuery comme dépendance

    useEffect(() => {
        if (page === 1)
            fetchBlogs();
        else {
            setPage(1);
            const params = new URLSearchParams(searchParams.toString());
            params.set("page", "1");
        }
    }, [debouncedSearchQuery, mounted, pageSize, sortBy, mine,selectedCategories]); 

    const fetchBlogs = async () => {
        setData([]);
        setIsLoading(false);
        try {
            if (!origin) return
            setIsLoading(true);
            const res = await getBlogsDesc(page, pageSize, debouncedSearchQuery, locale, selectedCategories, sortBy, mine)

            if (res.status === 200 && res.data) {
                const newData = res.data.map((blog: any) => ({
                    ...blog,
                    categories: blog.categories.map((category: any) => category.title).join(", ")
                }))
                setData(newData);
                setCount(res.count);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!mounted && isLoading) {
        return (
            <div className="h-[300px] flex items-center justify-center">
                <Loading />
            </div>
        );
    }

    return (
        <div>
            <div className='flex items-center justify-between'>
                {!hideFliterPageSize && <div className='w-48 mb-2'>
                    <SelectFetch
                        value={pageSize.toString()}
                        onChange={(val) => setPageSize(Number(val))}
                        label={translateSystem("pagesize")}
                        placeholder={translateSystem("pagesizeplaceholder")}
                        options={[
                            { value: "1", label: "1" },
                            { value: "10", label: "10" },
                            { value: "20", label: "20" },
                            { value: "50", label: "50" },
                            { value: "100", label: "100" },
                        ]}
                    />
                </div>}

                <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4 text-gray-500" />
                    <Select value={sortBy} onValueChange={(value) => setSortBy(value as "recent" | "popular")}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder={translate("sortby")} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="recent">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span>{translate("newest")}</span>
                                </div>
                            </SelectItem>
                            <SelectItem value="popular">
                                <div className="flex items-center gap-2">
                                    <Eye className="h-4 w-4" />
                                    <span>{translate("popular")}</span>
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {/* {!isHideTable && <div className='flex justify-end m-2 gap-2'>
                    <Button variant={"outline"} className={showTable ? "bg-border" : ""} onClick={() => setShowTable(false)} ><LayoutGrid /></Button>
                    <Button variant={"outline"} className={!showTable ? "bg-border" : ""} onClick={() => setShowTable(true)} ><TableOfContents /></Button>
                </div>} */}
            </div>
            <div className='flex items-center justify-between'>
                <Button
                    onClick={() => setMine(!mine)}
                    className={
                        cn('my-2 bg-gradient-to-r text-white',
                            mine ? 'from-sky-500 to-indigo-500' : 'from-gray-900 to-black'
                        )
                    } size={"sm"}>
                    <PenLine /> {translateBlogs("myblogs")}
                </Button>
                {(debouncedSearchQuery || mine || selectedCategories.length > 0) && (
                    <Button variant="outline" size="sm" onClick={handleClearFilters}>
                        {translate("clearfilters")}
                    </Button>
                )}
            </div>
            <div className='flex items-center w-full justify-cente'>
                <div className="flex flex-wrap w-full gap-2 items-center justify-center mb-2">
                    {isLoadingC
                        ? <Loading classSizeProps="h-4 w-4" />
                        : categories.map((category) => (
                            <Badge
                                key={category.id}
                                className={`cursor-pointer ${selectedCategories.includes(category.id)
                                    ? category.color
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-800 theme-ocean:bg-gray-800 dark:text-gray-100 theme-ocean:text-gray-100 opacity-70"
                                    } hover:opacity-100 transition-opacity`}
                                onClick={() => handleCategoryToggle(category.id)}
                            >
                                {category.title}
                            </Badge>
                        ))}
                </div>
            </div>
            {<DataTable
                data={data}
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                debouncedSearchQuery={debouncedSearchQuery}
                setDebouncedSearchQuery={setDebouncedSearchQuery}
                page={page}
                setPage={setPage}
                pageSize={pageSize}
                count={count}
                showPagination
                showSearch
            />}
            {/* {!showTable && <DataCards
                datas={data}
                page={page}
                debouncedSearchQuery={debouncedSearchQuery}
                setDebouncedSearchQuery={setDebouncedSearchQuery}
                isLoading={isLoading}
                count={count}
                pageSize={pageSize}
                setPage={setPage}
                showPagination={hidePagination ? false : true}
                showSearch={hideSearch ? false : true}
                showAction={hideAction ? false : true}
            />} */}
        </div>
    )
}

export default ListBlogs
