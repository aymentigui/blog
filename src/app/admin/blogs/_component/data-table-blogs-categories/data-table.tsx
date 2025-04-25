"use client";

import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { columns } from "./columns-table"; // Importez les colonnes
import { Columns } from "./columns-table";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { useTranslations } from "next-intl";
import { useSession } from "@/hooks/use-session";

interface DataTableProps {
    getData: Columns[];
    selectedIds?: string[];
    setSelectedIds: (prodcutsCategoryIds: string[]) => void;
}

export function DataTable({
    getData,
    selectedIds,
    setSelectedIds
}: DataTableProps) {

    const [selectedLanguage, setSelectedLanguage] = useState("");
    const [selectedData, setSelectedData] = useState<string[]>([]);
    const { session } = useSession()
    const hasPermissionAction = (session?.user?.permissions.find((permission: string) => permission === "blogs_categories_update" || permission === "blogs_categories_delete") ?? false) ||
        session?.user?.isAdmin;

    const s = useTranslations('System')
    useEffect(() => {
        setSelectedLanguage(Cookies.get('lang') || 'en')
    }, [])

    const table = useReactTable({
        data: getData,
        columns, // Utilisez les colonnes importées
        getCoreRowModel: getCoreRowModel(),
        state: {
            rowSelection: selectedIds
                ? selectedIds.reduce((acc, id) => {
                    const index = getData.findIndex((productsCategory) => productsCategory.id === id);
                    if (index === -1) {
                        return acc;
                    }
                    acc[index] = true;
                    return acc;
                }, {} as Record<string, boolean>)
                : selectedData.reduce((acc, id) => {
                    acc[id] = true;
                    return acc;
                }, {} as Record<string, boolean>),
        },
        onRowSelectionChange: (updaterOrValue) => {
            const newRowSelection =
                typeof updaterOrValue === "function"
                    ? updaterOrValue(table.getState().rowSelection)
                    : updaterOrValue;
            const selectedIndexes = Object.keys(newRowSelection).filter(
                (name) => newRowSelection[name]
            );
            const selectedIds2 = selectedIndexes.map((id) => table.getRowModel().rows.find((row) => row.id === id)?.original.id || '')
            setSelectedIds(selectedIds2)
            setSelectedData(selectedIndexes);
        },
    });

    return (
        <div className="rounded-md border p-2">
            <Table className="border">
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                (header.id !== "actions" || hasPermissionAction)
                                    ? <TableHead key={header.id}
                                        className={`
                                    ${selectedLanguage == "ar" ? "text-right " : ""} 
                                    ${header.id === "actions" ? "w-1/12" : ""} 
                                    `}>
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </TableHead>
                                    : null
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                {s("noresults")}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}