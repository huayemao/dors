"use client";
import { CategoriesContext } from "@/contexts/categories";
import { cn } from "@/lib/utils";
import { BaseDropdown, BaseDropdownItem } from "@shuriken-ui/react";
import clsx from "clsx";
import {
  GlobeLockIcon,
  HandshakeIcon,
  HomeIcon,
  LinkIcon,
  LucideProps,
  Settings2,
  TagIcon,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import react, {
  FC,
  PropsWithRef,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Avatar } from "../Avatar";
import { NavigationItem, NavigationItemProps } from "./NavigationItem";
import { MenuButton } from "./MenuButton";
import useScrolled from "./useScroll";

const ThemeButton = dynamic(() => import("@/components/ThemeButton"), {
  ssr: false,
});

export const Nav = ({
  resourceItems = [],
}: {
  resourceItems?: {
    title: string;
    subtitle: string;
    url: string;
  }[];
}) => {
  const categories = useContext(CategoriesContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrolled = useScrolled(60);

  useEffect(() => {
    if (mobileOpen) {
      window.document.body.style.overflow = "hidden";
    } else {
      window.document.body.style.overflow = "auto";
    }
  }, [mobileOpen]);

  const closeMobileNav = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const menuItems: NavigationItemProps[] = [
    {
      title: "主页",
      href: "/",
      icon: HomeIcon,
    },
    {
      title: "关于",
      href: "/about",
      icon: HandshakeIcon,
    },
    {
      title: "标签",
      href: "/tags",
      icon: TagIcon,
    },
    {
      title: "自留地",
      href: "/protected",
      icon: GlobeLockIcon,
      prefetch: false,
    },
    {
      title: "资源",
      icon: LinkIcon,
      children: categories
        .filter((e) => !!e.hidden)
        .map((e) => ({ title: e.name!, href: "/categories/" + e.id, text: e.description || "" }))
        .concat([
          {
            title: "小记",
            href: "/notes",
            text: "本地记录功能",
          },
          {
            title: "随手记",
            href: "https://www.yuque.com/huayemao/yuque/dc_213",
            text: "语雀链接",
          },
        ])
        .concat(
          ...resourceItems.map((e) => {
            return {
              title: e.title,
              text: e.subtitle,
              href: e.url,
            };
          })
        ),
    },
    {
      title: "管理",
      icon: Settings2,
      children: [
        {
          title: "后台",
          href: "admin",
          text: "后台管理页面",
        },
        {
          title: "部署",
          href: "https://vercel.com/huayemaos-projects/dors/deployments",
          text: "vercel 部署页面",
        },
      ],
    },
  ];

  return (
    <nav
      className={clsx(
        "fixed z-10 top-0 w-full transition-all duration-300 ease-in-out flex flex-col lg:flex-row lg:items-center flex-shrink-0 px-5 print:hidden",
        {
          "bg-white dark:bg-muted-800 shadow-lg shadow-muted-400/10 dark:shadow-muted-800/10":
            scrolled || mobileOpen,
          "h-screen lg:h-fit": mobileOpen,
          "dark:bg-muted-900": !scrolled && !mobileOpen,
        }
      )}
    >
      <div
        className="w-full max-w-6xl mx-auto flex flex-wrap py-3 flex-row items-center sm:justify-between
    "
      >
        <div className="flex justify-between items-center w-full lg:w-1/5">
          <Link
            href="/"
            className="flex title-font font-medium items-center text-muted-900 dark:text-muted-100
        "
            onClick={closeMobileNav}
          >
            <Avatar alt />
            <span className="font-heading font-bold text-2xl ml-3">Dors</span>
          </Link>
          <MenuButton
            setMobileOpen={setMobileOpen}
            mobileOpen={mobileOpen}
          ></MenuButton>
        </div>
        <div
          id="nav-content"
          className={cn(
            "flex  justify-center lg:relative lg:flex lg:text-left opacity-100 flex-grow ease-in-out",
            {
              hidden: !mobileOpen,
              "absolute inset-12 items-center": mobileOpen,
            }
          )}
        >
          <ul className="flex flex-col lg:items-center justify-between mt-3 mb-1 lg:flex-row  lg:mx-auto lg:mt-0 lg:mb-0 lg:gap-x-5">
            {menuItems.map((e) => (
              <NavigationItem
                key={e.href}
                {...e}
                onClick={closeMobileNav}
              ></NavigationItem>
            ))}
          </ul>
          <div className="lg:hidden absolute bottom-4 flex justify-center">
            <ThemeButton />
          </div>
        </div>

        <div className="hidden lg:flex items-center lg:w-1/5 lg:justify-end lg:gap-x-4">
          <button
            type="button"
            className=" group h-12 w-12 rounded-full flex items-center justify-center tw-accessibility"
          >
            <div
              className="h-10 w-10 flex items-center justify-center rounded-full text-muted-400 group-hover:text-muted-500 group-hover:bg-muted-100 dark:group-hover:bg-muted-700 dark:group-hover:text-muted-100 transition-colors duration-300
          "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                data-icon="lucide:search"
                className="iconify w-4 h-4 iconify--lucide"
              >
                <g
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21l-4.35-4.35"></path>
                </g>
              </svg>
            </div>
          </button>
          <ThemeButton />
        </div>
      </div>
    </nav>
  );
};
