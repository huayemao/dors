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
  SearchIcon, // ✅ 新增
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
import { SearchPanel } from "./SearchPanel";

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
      className="hidden justify-center md:relative md:flex md:text-left flex-grow"
    >
      <div className="">
        <ul className="flex md:items-center justify-between mt-3 mb-1 md:flex-row md:mx-auto md:mt-0 md:mb-0 md:gap-x-5">
          {menuItems.map((e) => (
            <NavigationItem
              key={e.href || e.title}
              className="min-w-32 md:min-w-fit"
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const scrolled = useScrolled(60);
  const isClient = useIsClient();

  useEffect(() => {
    if (mobileOpen) {
      window.document.body.style.overflowY = "hidden";
    } else {
      window.document.body.style.overflowY = "auto";
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
      title: "博客",
      href: "/posts",
    },
    {
      title: "知识库",
      href: "/books",
    },
    {
      title: "工作台",
      href: "/apps",
    },
    {
      title: "集萃",
      href: "/collection",
    },
    {
      title: "友链",
      href: "/friends",
    },
    {
      title: "关于",
      href: "/about",
    },
  ];
  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        <motion.nav
          key={String(mobileOpen)}
          className={cn(
            "dark:bg-muted-800 fixed z-10 top-0 w-full transition-all duration-300 ease-in-out flex flex-col md:flex-row md:items-center flex-shrink-0 px-5 print:hidden",
            {
              "shadow-md shadow-muted-400/10 dark:shadow-muted-800/10": scrolled && !simple,
              "bg-white": scrolled && !simple,
              "h-screen md:h-fit z-[11]": mobileOpen,
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
            className="w-full max-w-6xl mx-auto xl:max-w-[88%] flex py-3 flex-row items-center sm:justify-between
    "
          >
            <div className="flex justify-between items-center w-full md:w-1/5">
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
                openSearchPanel={() => {
                  closeMobileNav();
                  setIsSearchOpen(true)
                }}
              />
            ) : (
              <ServerNavContent
                menuItems={menuItems}
                closeMobileNav={closeMobileNav}
              />
            )}

            <div className="hidden md:flex items-center md:w-1/5 md:justify-end md:gap-x-4">
              <button
                type="button"
                className="group h-12 w-12 rounded-full flex items-center justify-center tw-accessibility"
                onClick={() => setIsSearchOpen(true)}
              >
                <div
                  className="h-10 w-10 flex items-center justify-center rounded-full text-muted-400 group-hover:text-muted-500 group-hover:bg-muted-100 dark:group-hover:bg-muted-700 dark:group-hover:text-muted-100 transition-colors duration-300"
                >
                  <SearchIcon
                    role="img"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                    data-icon="lucide:search"
                    className="iconify w-4 h-4 iconify--lucide"
                  />
                </div>
              </button>
              <BaseThemeToggle />
            </div>
          </div>
        </motion.nav>
      </AnimatePresence>
      <AnimatePresence>
        <SearchPanel key={String(isSearchOpen)} isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)}></SearchPanel>
      </AnimatePresence>
    </>
  );
};
