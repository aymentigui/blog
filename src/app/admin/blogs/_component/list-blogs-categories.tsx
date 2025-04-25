"use client"
import { DataTable } from "./data-table-blogs-categories/data-table";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { Columns } from "./data-table-blogs-categories/columns-table";
import { DeleteBlogsCategories } from "@/actions/blog/categories/delete";

type BlogsCategoriesPageProps = {
  data: Columns[]
};

export default function BlogsCategoriesPageList({ data }: BlogsCategoriesPageProps) {
  const translate = useTranslations("BlogsCategories")
  const systemTranslate = useTranslations("System")

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [open,setOpen] = useState(false)

  const router = useRouter()

  const hadnleConfirm = async () => {
    if (selectedIds.length === 0) {
      toast.error(translate("selectcategory"))
      return
    }
    setOpen(!open)
  }

  const handleDelete = async () => {
    if(selectedIds.length === 0) return
    selectedIds.forEach(async (id) => {
      await DeleteBlogsCategories(id)
    })
    toast.success(systemTranslate("deletesuccess"))
    setOpen(false)
    router.refresh()
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold mb-4">{translate("title")}</h1>
        <AlertDialog open={open} onOpenChange={hadnleConfirm}>
          <AlertDialogTrigger asChild>
            <Button variant="outline">{translate("deletecategories")}</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{translate("confermationdelete")}</AlertDialogTitle>
              <AlertDialogDescription>
              {translate("confermationdeletemessage")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setOpen(false)}>{systemTranslate("cancel")}</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>{systemTranslate("confirm")}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <DataTable
        getData={data}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
      />
    </div>
  );
}