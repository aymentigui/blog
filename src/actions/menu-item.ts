"use server"
import { ChartBarStacked, CircleEllipsis, CirclePlus, Download, File, FileSpreadsheet, Heart, Home, Newspaper, Settings, UserRoundCog, Users } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { getUserPermissions, verifySession } from "./permissions";


const itemsMenu = async () => {
    const Menu = await getTranslations('Menu');
    const items = [
        {
            title: Menu('home'),
            url: "/admin",
            icon: Home,
            admin: true,
            permissions: [],
        },
        {
            title: Menu("users"),
            url: "/admin/users",
            icon: Users,
            admin: false,
            permissions: ["users_view"],
        },
        {
            title: Menu("roles"),
            url: "/admin/roles",
            icon: UserRoundCog,
            admin: false,
            permissions: ["roles_view"],
        },
        {
            title: Menu("blog"),
            url: "/admin/blogs",
            icon: Newspaper,
            admin: false,
            permissions: [],
            subItems: [
                {
                    title: Menu("blog"),
                    url: "/admin/blogs",
                    icon: Newspaper,
                    admin: false,
                    permissions: [],
                },
                {
                    title: Menu("blog_add"),
                    url: "/admin/blogs/blog",
                    icon: CirclePlus,
                    admin: false,
                    permissions: ["blogs_create"],
                },
                {
                    title: Menu("blog_categories"),
                    url: "/admin/blogs/categories",
                    icon: ChartBarStacked,
                    admin: false,
                    permissions: ["blogs_categories_view"],
                },
            ],
        },
        {
            title: Menu("blogsreaction"),
            url: "/admin/reactions",
            icon: Heart,
            admin: false,
            permissions: [],
        },
        {
            title: Menu("project"),
            url: "/admin/projects",
            icon: Newspaper,
            admin: false,
            permissions: [],
            subItems: [
                {
                    title: Menu("project"),
                    url: "/admin/projects",
                    icon: Newspaper,
                    admin: false,
                    permissions: [],
                },
                {
                    title: Menu("project_add"),
                    url: "/admin/projects/project",
                    icon: CirclePlus,
                    admin: false,
                    permissions: ["projects_create"],
                },
                {
                    title: Menu("projects_categories"),
                    url: "/admin/projects/categories",
                    icon: ChartBarStacked,
                    admin: false,
                    permissions: ["projects_categories_view"],
                },
            ],
        },
        {
            title: Menu("files"),
            url: "/admin/files",
            icon: File,
            admin: false,
            permissions: [],
            subItems: [
                {
                    title: Menu("files"),
                    url: "/admin/files",
                    icon: File,
                    admin: false,
                    permissions: [],
                },
                {
                    title: Menu("files_upload"),
                    url: "/admin/files/upload-files",
                    icon: Download,
                    admin: false,
                    permissions: ["files_create"],
                },
            ],
        },
        {
            title: Menu("settings"),
            url: "/admin/settings",
            icon: Settings,
            admin: false,
            permissions: [],
        },
    ]
    return items
}

export async function getMenuItems() {
    const items = await itemsMenu()

    const session = await verifySession();
    if (!session || !session.data || !session.data.user) return []

    if (session.data.user.isAdmin) return items

    const permissions = await getUserPermissions(session.data.user.id)
    if (!permissions || permissions.status !== 200 || !permissions.data) return []

    const userPermissions = permissions.data

    const filteredItems = (items: any) => {
        return items.filter((item: any) => {
            if (item.admin) return false;

            if (!item.permissions.every((permission: string) => userPermissions.includes(permission))) return false;
            if (item.subItems) {
                item.subItems = filteredItems(item.subItems); // Filtre récursif des sous-menus
                // Si après filtrage, il n'y a plus de sous-menus valides, on filtre l'élément parent
                if (item.subItems.length === 0) return false;
            }

            // On vérifie que l'utilisateur a toutes les permissions requises pour cet élément
            return item.permissions.every((permission: string) => userPermissions.includes(permission));
        });
    };

    const newItems = filteredItems(items);
    return newItems
} 
