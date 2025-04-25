"use client"
import React, { useEffect, useState } from 'react'
import { getBlogsCount, getBlogsDesc } from '@/actions/blog/get'
import { useLocale, useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useOrigin } from '@/hooks/use-origin'
import Loading from '@/components/myui/loading'
import { DataTable } from './data-table-blogs/data-table'
import DataCards from './data-card-blogs/data-cards'
import { Button } from '@/components/ui/button'
import { LayoutGrid, TableOfContents } from 'lucide-react'
import SelectFetch from '@/components/myui/select-fetch'

const ListBlogs = ({ isHideTable, hideAction, hidePagination, hideSearch, hideFliterPageSize }: any) => {

    const locale = useLocale()
    const origin = useOrigin()
    const searchParams = useSearchParams();
    const translateSystem = useTranslations("System");

    const [showTable, setShowTable] = useState(!isHideTable);
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [page, setPage] = useState(searchParams.get("page") ? Number(searchParams.get("page")) : 1);
    const [pageSize, setPageSize] = useState(10);
    const [count, setCount] = useState(0);
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(""); // Etat pour la recherche avec debounce


    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        setMounted(true);
    }, []);
    

    useEffect(() => {
        fetchBlogs();
    }, [page, debouncedSearchQuery, mounted, pageSize]); // Ajouter debouncedSearchQuery comme dépendance


    const fetchBlogs = async () => {
        setData([]);
        setIsLoading(false);
        try {
            if (!origin) return
            setIsLoading(true);
            const res = await getBlogsDesc(page, pageSize, debouncedSearchQuery)

            if (res.status === 200 && res.data) {
                const newBlogs = []
                for (const blog of res.data) {
                    const title = blog.titles.find((title: any) => title.language === locale)?.title ??
                        blog.titles.find((title: any) => title.language === 'en')?.title ??
                        blog.titles ? blog.titles[0].title : ""
                    const description = blog.description.find((desc: any) => desc.language === locale)?.description ??
                        blog.description.find((desc: any) => desc.language === 'en')?.description ??
                        blog.description[0] ? blog.description[0].description : ""

                    newBlogs.push({
                        id: blog.id,
                        title: title,
                        description: description,
                        image: (blog.image && blog.image !== "") ? blog.image : null,
                        categories: blog.categories.map((category: any) => {
                            if (locale === "en") return category.name
                            if (locale === "fr") return category.namefr ?? category.name
                            if (locale === "ar") return category.namear ?? category.name
                        }).join(", "),
                        created_at: blog.created_at,
                        updated_at: blog.updated_at
                    })
                }
                setData(newBlogs)
            }

            const countResponse = await getBlogsCount(debouncedSearchQuery)
            if (countResponse.status === 200) {
                setCount(countResponse.data);
            }

        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!mounted || isLoading) {
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
                {!isHideTable && <div className='flex justify-end m-2 gap-2'>
                    <Button variant={"outline"} className={showTable ? "bg-border" : ""} onClick={() => setShowTable(false)} ><LayoutGrid /></Button>
                    <Button variant={"outline"} className={!showTable ? "bg-border" : ""} onClick={() => setShowTable(true)} ><TableOfContents /></Button>
                </div>}
            </div>
            {!isHideTable && showTable && <DataTable
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
            {!showTable && <DataCards
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
            />}
        </div>
    )
}

export default ListBlogs
