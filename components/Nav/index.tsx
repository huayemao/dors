"use client";
import { cn } from "@/lib/utils";
import { BaseDropdown, BaseDropdownItem, BaseThemeToggle } from "@shuriken-ui/react";
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
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ClientNavContent } from "./ClientNav";
import { useIsClient } from "@uidotdev/usehooks";
import Logo from "./Logo";

const ServerNavContent = ({
  menuItems,
  closeMobileNav,
}: {
  menuItems: any[];
  closeMobileNav: () => void;
}) => {
  return (
    <div
      id="nav-content"
      className="hidden justify-center lg:relative lg:flex lg:text-left flex-grow"
    >
      <div className="">
        <ul className="flex lg:items-center justify-between mt-3 mb-1 lg:flex-row lg:mx-auto lg:mt-0 lg:mb-0 lg:gap-x-5">
          {menuItems.map((e) => (
            <NavigationItem
              key={e.href || e.title}
              className="min-w-32 lg:min-w-fit"
              {...e}
              onClick={closeMobileNav}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export const Nav = ({
  resourceItems = [],
  simple = false,
  className
}: {
  resourceItems?: {
    title: string;
    subtitle: string;
    url: string;
  }[];
  className?: string
  simple?: boolean
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrolled = useScrolled(60);
  const isClient = useIsClient();

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
    },
    {
      title: "关于",
      href: "/about",
    },
    {
      title: "文章",
      href: "/posts",
    },
    {
      title: "集萃",
      href: "/collection",
    },
    {
      title: "工作台",
      href: "/apps",
    },
  ];
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.nav
        key={String(mobileOpen)}
        className={cn(
          "dark:bg-muted-800 fixed z-10 top-0 w-full transition-all duration-300 ease-in-out flex flex-col lg:flex-row lg:items-center flex-shrink-0 px-5 print:hidden",
          {
            "shadow-lg shadow-muted-400/10 dark:shadow-muted-800/10": scrolled && !simple,
            "bg-white": scrolled && !simple,
            "h-screen lg:h-fit z-[11]": mobileOpen,
            "dark:bg-muted-900": !scrolled,
            'static bg-muted-100': simple,
          }
          , className
        )}
      >
        {mobileOpen && (
          <motion.div
            className="absolute inset-0 bg-white dark:bg-muted-800 "
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: {
                opacity: { duration: 0.2 },
              },
            }}
            exit={{
              opacity: 0,
              transition: {
                opacity: { duration: 0.2 },
              },
            }}
          ></motion.div>
        )}
        <div
          className="w-full max-w-6xl mx-auto xl:max-w-[88%] flex flex-wrap py-3 flex-row items-center sm:justify-between
    "
        >
          <div className="flex justify-between items-center w-full lg:w-1/5">
            <Logo onClick={closeMobileNav} />
            <MenuButton
              setMobileOpen={setMobileOpen}
              mobileOpen={mobileOpen}
            ></MenuButton>
          </div>

          {isClient ? (
            <ClientNavContent
              menuItems={menuItems}
              mobileOpen={mobileOpen}
              closeMobileNav={closeMobileNav}
            />
          ) : (
            <ServerNavContent
              menuItems={menuItems}
              closeMobileNav={closeMobileNav}
            />
          )}

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
            <BaseThemeToggle />
          </div>
        </div>
      </motion.nav>
    </AnimatePresence>
  );
};
