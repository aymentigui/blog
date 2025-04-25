"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslations } from "next-intl";
import { useOrigin } from "@/hooks/use-origin";
import { useSession } from "@/hooks/use-session";
import { Eye, Settings2, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LzyImage } from "@/components/myui/lazy-image";
import GetImage from "@/hooks/use-getImage";
import { deleteBlogs } from "@/actions/blog/delete";

export type Columns = {
  id: string; // Supprimez l'`id`
  title: string;
  description: string;
  categories: string;
  image: string;
};

const headerColumn = () => {
  const translate = useTranslations("Blogs")
  return translate("title")
}
const headerColumnDescription = () => {
  const translate = useTranslations("Blogs")
  return translate("description")
}

const headerColumnCategories = () => {
  const translate = useTranslations("Blogs")
  return translate("categories")
}

const imageCell = (row: any) => {
  const preview = row.getValue("image")
  return (
    <LzyImage
      src={preview?GetImage(preview):"/placeholder.png"}
      alt="Avatar"
      load
      className="w-10 h-10 object-cover rounded"
    />
  ) 
}

const actionsCell = (row: any) => {
  const data = row.original;
  const { session } = useSession()
  const router = useRouter();
  const origin = useOrigin()
  const hasPermissionDelete = (session?.user?.permissions.find((permission: string) => permission === "blogs_delete") ?? false) || session?.user?.isAdmin;
  const hasPermissionUpdate = (session?.user?.permissions.find((permission: string) => permission === "blogs_update") ?? false) || session?.user?.isAdmin;

  return (
    <div className="flex gap-2">
      <Button
        onClick={() => {
          window.open(`${origin}/blogs/${data.id}`, '_blank')
        }}
        variant="primary"
      >
        <Eye />
      </Button>
      {hasPermissionDelete && <Button
        onClick={() => {
          deleteBlogs([data.id])
          window.location.reload()
        }}
        variant="destructive"
      >
        <Trash />
      </Button>}
      {hasPermissionUpdate && <Button variant={"outline"} onClick={() => router.push(`${origin}/admin/blogs/${data.id}/update`)}>
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
    accessorKey: "image",
    header: "image",
    cell: ({ row }) => ( imageCell(row) ),
    enableSorting: true,
  },
  {
    accessorKey: "title",
    header: headerColumn,
    cell: ({ row }) => (
      <div >
        {row.getValue("title")}
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: headerColumnDescription,
    cell: ({ row }) => (
      <div >
        {row.getValue("description")}
      </div>
    ),
  },
  {
    accessorKey: "categories",
    header: headerColumnCategories,
    cell: ({ row }) => (
      <div className="w-4/6">
        {row.getValue("categories")}
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