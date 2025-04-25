"use client"
import React from 'react'
import CardBlog from './card-blog'
import BackPagination from '@/components/myui/table/back-pagination';
import NextPagination from '@/components/myui/table/next-pagination';
import SearchTable from '@/components/myui/table/search-table';

interface Props {
    datas: any[];
    page?: number;
    debouncedSearchQuery?: string;
    setDebouncedSearchQuery: (query: string) => void;
    isLoading?: boolean;
    count?: number;
    pageSize?: number;
    setPage?: (page: any) => void
    showSearch?: boolean;
    showPagination?: boolean;
    showAction?: boolean;
}
const DataCards = ({
    datas,
    page,
    debouncedSearchQuery,
    setDebouncedSearchQuery,
    isLoading,
    count,
    pageSize,
    setPage,
    showSearch = false,
    showPagination=false,
    showAction = true
}: Props) => {


    return (
        <div>
            {showSearch && <SearchTable page={page} debouncedSearchQuery={debouncedSearchQuery} setDebouncedSearchQuery={setDebouncedSearchQuery} />}
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
                {datas.map((data: any, index: number) => (
                    <CardBlog blog={data} key={index} showAction={showAction} />
                ))}
            </div>
            {!isLoading && showPagination && <div className="flex items-center justify-end space-x-2 py-4">
                <BackPagination page={page} setPage={setPage} searchQuery={debouncedSearchQuery} isLoading={isLoading} />
                <NextPagination page={page} setPage={setPage} count={count} pageSize={pageSize} isLoading={isLoading} searchQuery={debouncedSearchQuery} />
            </div>}
        </div>
    )
}

export default DataCards
