"use client";

import { cn } from "@/lib/utils";
import { icons } from "lucide-react";
import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";

export function AdminMenu() {
  const menuItems = [
    {
      title: "文章管理",
      href: "/admin/posts/create",
      iconName: "StickyNote",
    },
    {
      title: "标签管理",
      href: "/admin/tags",
      iconName: "Tag",
    },
    {
      title: "文件管理",
      href: "/admin/files",
      iconName: "File",
    },
    {
      title: "设置",
      href: "/admin/settings",
      iconName: "Settings",
    },
  ];

  const segs = useSelectedLayoutSegments();

  return (
    <div className="nui-slimscroll relative flex w-full grow flex-col overflow-y-auto py-6 px-6">
      <ul className="py-2">
        {menuItems.map((e) => {
          const LucideIcon = icons[e.iconName];
          const isSelected =
            ["admin"].concat(segs).slice(0, 2).toString() ===
            e.href.slice(1).split("/").slice(0, 2).toString();
          return (
            <li key={e.title}>
              <div className="group">
                <Link
                  href={e.href}
                  className={cn(
                    "nui-focus text-muted-500 dark:text-muted-400/80 hover:bg-muted-100 dark:hover:bg-muted-700/60 hover:text-muted-600 dark:hover:text-muted-200 flex w-full cursor-pointer items-center rounded-lg py-3 transition-colors duration-300 gap-4 px-4",
                    {
                      "text-primary-500": isSelected,
                    }
                  )}
                >
                  <LucideIcon className="icon w-5 h-5  shrink-0" />
                  <span className="block whitespace-nowrap font-sans text-sm block">
                    {e.title}
                  </span>
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

