"use client";
import { DeleteBlogsCategories } from "@/actions/blog/categories/delete";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAddUpdateBlogsCategoryDialog } from "@/context/add-update-blogs-category-dialog-context";
import { useSession } from "@/hooks/use-session";
import { ColumnDef } from "@tanstack/react-table";
import { Settings2, Trash } from "lucide-react";
import { useTranslations } from "next-intl";

export type Columns = {
  id: string; // Supprimez l'`id`
  name: string;
  nameFr: string;
  nameAr: string;
};

const headerColumn = () => {
  const translate = useTranslations("BlogsCategories")
  return translate("title")
}

const headerColumn2 = () => {
  const translate = useTranslations("BlogsCategories")
  return translate("namefr")
}

const headerColumn3 = () => {
  const translate = useTranslations("BlogsCategories")
  return translate("namear")
}

const actionsCell = (row: any) => {
  const productsCategory = row.original;
  const { openDialog } = useAddUpdateBlogsCategoryDialog();
  const { session } = useSession()
  const hasPermissionDelete = (session?.user?.permissions.find((permission: string) => permission === "blogs_categories_delete") ?? false) || session?.user?.isAdmin;
  const hasPermissionUpdate = (session?.user?.permissions.find((permission: string) => permission === "blogs_categories_update") ?? false) || session?.user?.isAdmin;

  const handleOpenDialogWithTitle = () => {
    openDialog(false, row.original)
  };

  return (
    <div className="flex gap-2">
      {hasPermissionDelete && <Button
        onClick={() => {
          DeleteBlogsCategories(productsCategory.id)
          window.location.reload()
        }}
        variant="destructive"
      >
        <Trash />
      </Button>}
      {hasPermissionUpdate && <Button variant={"outline"} onClick={handleOpenDialogWithTitle}>
        <Settings2 />
      </Button>}
    </div>
  );
};


export const columns: ColumnDef<Columns>[] = [
  {
    id: "actionsCheck",
    header: ({ table }) => {
      const allSelected = table.getIsAllRowsSelected(); // Vérifie si toutes les lignes sont sélectionnées

      return (
        <Checkbox
          checked={allSelected}
          onCheckedChange={(value) => {
            table.toggleAllRowsSelected(!!value); // Sélectionne ou désélectionne toutes les lignes
          }}
        />
      );
    },
    cell: ({ row }) => {
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      );
    },
  },
  {
    accessorKey: "name",
    header: headerColumn,
    cell: ({ row }) => (
      <div>
        {row.getValue("name")}
      </div>
    ),
  },
  {
    accessorKey: "namefr",
    header: headerColumn2,
    cell: ({ row }) => (
      <div>
        {row.getValue("namefr")}
      </div>
    ),
  }, {
    accessorKey: "namear",
    header: headerColumn3,
    cell: ({ row }) => (
      <div>
        {row.getValue("namear")}
      </div>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      return actionsCell(row);
    },
  },
];