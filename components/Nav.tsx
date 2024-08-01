"use client";
import { CategoriesContext } from "@/contexts/categories";
import { cn } from "@/lib/utils";
import { BaseDropdown, BaseDropdownItem } from "@shuriken-ui/react";
import clsx from "clsx";
import { GlobeLockIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useContext, useEffect, useState } from "react";
import { Avatar } from "./Avatar";

const ThemeButton = dynamic(() => import("@/components/ThemeButton"), {
  ssr: false,
});

export const Nav = () => {
  const categories = useContext(CategoriesContext);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  function scrollHeader() {
    // When the scroll is greater than 60 viewport height, add the scroll-header class to the header tag
    if (window.scrollY >= 60 && !scrolled) {
      setScrolled(true);
    } else setScrolled(false);
  }

  useEffect(() => {
    scrollHeader();
    window.addEventListener("scroll", scrollHeader);

    return () => {
      window.removeEventListener("scroll", scrollHeader);
    };
  }, []);

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

  const MenuButton = (
    <button
      onClick={() => {
        setMobileOpen((open) => !open);
      }}
      className="flex relative justify-center items-center ml-auto w-10 h-10 focus:outline-none lg:hidden"
    >
      <div
        className={cn(
          "block top-1/2 left-6 w-4 -translate-x-1/2 -translate-y-1/2"
        )}
      >
        <span
          className={cn(
            "block absolute w-7 h-0.5 text-primary-500 bg-current transition duration-500 ease-in-out",
            mobileOpen ? "rotate-45" : "-translate-y-2"
          )}
        ></span>
        <span
          className={cn(
            "block absolute w-5 h-0.5 text-primary-500 bg-current transition duration-500 ease-in-out",
            mobileOpen ? "opacity-0" : ""
          )}
        ></span>
        <span
          className={cn(
            "block absolute w-7 h-0.5 text-primary-500 bg-current transition duration-500 ease-in-out",
            mobileOpen ? "-rotate-45" : "translate-y-2"
          )}
        ></span>
      </div>
    </button>
  );

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
          {MenuButton}
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
          <ul className="flex flex-col lg:items-center justify-between mt-3 mb-1 lg:flex-row  lg:mx-auto lg:mt-0 lg:mb-0 lg:gap-x-4">
            <li>
              <Link
                href="/about"
                className="block text-base font-sans text-muted-600 hover:text-primary-500 dark:text-muted-200 dark:hover:text-primary-400 py-2 md:mx-2 tw-accessibility
              "
                onClick={closeMobileNav}
              >
                关于
              </Link>
            </li>
            <li>
              <Link
                href="/tags"
                className="block text-base font-sans text-muted-600 hover:text-primary-500 dark:text-muted-200 dark:hover:text-primary-400 py-2 md:mx-2 tw-accessibility
              "
                onClick={closeMobileNav}
              >
                标签
              </Link>
            </li>
            {categories
              .filter((e) => !!e.hidden)
              .map((e) => (
                <li key={e.id + "cat"}>
                  <Link
                    href={"/categories/" + e.id}
                    className="block text-base font-sans text-muted-600 hover:text-primary-500 dark:text-muted-200 dark:hover:text-primary-400 py-2 md:mx-2 tw-accessibility
              "
                    onClick={closeMobileNav}
                  >
                    {e.name}
                  </Link>
                </li>
              ))}
            <li className="text-base text-muted-600 hover:text-primary-500 dark:text-muted-200 dark:hover:text-primary-400 py-2 md:mx-2 tw-accessibility">
              <BaseDropdown
                label="管理"
                classes={{ wrapper: "flex item-center " }}
                variant="text"
              >
                <BaseDropdownItem
                  href="/admin"
                  title="后台"
                  text="进入后台页面"
                  rounded="sm"
                  onClick={closeMobileNav}
                />
                <BaseDropdownItem
                  href="https://vercel.com/huayemaos-projects/dors/deployments"
                  title="部署"
                  text="查看部署进度"
                  rounded="sm"
                  onClick={closeMobileNav}
                />
              </BaseDropdown>
            </li>
            <li>
              <Link
                prefetch={false}
                href="/protected"
                className="block text-base font-sans text-muted-600 hover:text-primary-500 dark:text-muted-200 dark:hover:text-primary-400 py-2 md:mx-2 tw-accessibility
              "
                onClick={closeMobileNav}
              >
                <GlobeLockIcon className="h-5 w-5" strokeWidth={1.5} />
              </Link>
            </li>
          </ul>
          <div className="lg:hidden absolute bottom-4 flex justify-center">
            <ThemeButton />
          </div>
        </div>

        <div className="hidden lg:flex lg:w-1/5 lg:justify-end lg:gap-x-4">
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
