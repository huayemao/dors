"use client";
import { cn } from "@/lib/utils";
import clsx from "clsx";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Avatar } from "./Avatar";

const ThemeButton = dynamic(() => import("@/components/ThemeButton"), {
  ssr: false,
});

export const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [megamenuOpened, setMegamenuOpened] = useState(false);

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

  return (
    <nav
      className={clsx(
        "fixed top-0 w-full  z-50 transition-all duration-300 ease-in-out flex flex-col lg:flex-row lg:items-center flex-shrink-0 px-5",
        {
          "bg-white dark:bg-muted-800 shadow-lg shadow-muted-400/10 dark:shadow-muted-800/10":
            scrolled || megamenuOpened,
          "dark:bg-muted-900": !scrolled && !megamenuOpened,
        }
      )}
    >
      <div
        className="w-full max-w-7xl mx-auto flex flex-wrap py-3 flex-row items-center sm:justify-between
    "
      >
        <div className="flex justify-between items-center w-full lg:w-1/5">
          <Link
            href="/"
            className="flex title-font font-medium items-center text-muted-900 dark:text-muted-100
        "
          >
            <Avatar alt />
            <span className="font-heading font-bold text-2xl ml-3">Dors</span>
          </Link>

          <button
            onClick={() => setMegamenuOpened((open) => !open)}
            className="flex relative justify-center items-center ml-auto w-10 h-10 focus:outline-none lg:hidden"
          >
            <div className="block top-1/2 left-6 w-4 -translate-x-1/2 -translate-y-1/2">
              <span className="block absolute w-7 h-0.5 text-primary-500 bg-current transition duration-500 ease-in-out -translate-y-2"></span>
              <span className="block absolute w-5 h-0.5 text-primary-500 bg-current transition duration-500 ease-in-out"></span>
              <span className="block absolute w-7 h-0.5 text-primary-500 bg-current transition duration-500 ease-in-out translate-y-2"></span>
            </div>
          </button>
        </div>
        <div
          className={cn(
            {
              hidden: !megamenuOpened,
            },
            "text-center lg:text-left lg:flex flex-grow"
          )}
        >
          <ul
            className="
            flex flex-col
            mt-3
            mb-1
            lg:flex-row lg:mx-auto lg:mt-0 lg:mb-0 lg:gap-x-4
          "
          >
            {/* <li className="relative">
              <button
                type="button"
                className="relative inline-flex items-center gap-1 text-base font-sans text-muted-600 hover:text-primary-500 dark:text-muted-200 dark:hover:text-primary-400 py-2 md:mx-2 tw-accessibility z-50"
              >
                <span>Product</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  role="img"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                  data-icon="lucide:chevron-down"
                  className="iconify w-5 h-5 text-muted-400 dark:text-muted-300 transition-transform duration-300 iconify--lucide"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m6 9l6 6l6-6"
                  ></path>
                </svg>
              </button>

              <div className="fixed lg:absolute top-0 lg:top-14 inset-x-0 lg:left-0 w-full lg:w-[640px] h-screen lg:h-auto pt-2 lg:-translate-x-1/4 transition-all duration-300 opacity-0 translate-y-1 pointer-events-none z-0">
                <div
                  className="
                  relative
                  w-full
                  px-3
                  pb-3
                  pt-12
                  lg:p-3
                  rounded-2xl
                  bg-white
                  dark:bg-muted-800
                  border border-muted-200
                  dark:border-muted-700
                  shadow-2xl shadow-muted-500/20
                  dark:shadow-muted-800/20
                "
                >
                  <button
                    type="button"
                    className="
                    absolute
                    top-2
                    right-2
                    h-12
                    w-12
                    flex
                    lg:hidden
                    items-center
                    justify-center
                    text-muted-600
                    dark:text-muted-200
                  "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      role="img"
                      width="1em"
                      height="1em"
                      viewBox="0 0 24 24"
                      data-icon="lucide:x"
                      className="iconify w-6 h-6 iconify--lucide"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M18 6L6 18M6 6l12 12"
                      ></path>
                    </svg>
                  </button>

                  <div
                    className="
                    grid
                    md:grid-cols-2
                    gap-1
                    md:gap-2
                    text-left
                    overflow-y-auto
                    slimscroll
                    ptablet:pb-10
                    ltablet:pb-10
                  "
                  >
                    <a
                      href="/product.html"
                      className="
                      relative
                      flex
                      gap-2
                      p-4
                      rounded-xl
                      hover:bg-muted-100
                      dark:hover:bg-muted-900
                      z-10
                      transition-colors
                      duration-300
                    "
                    >
                      <div
                        className="
                        relative
                        inline-flex
                        items-center
                        justify-center
                        w-10
                        min-w-[2.5rem]
                        h-10
                        bg-primary-100
                        dark:bg-primary-500
                        text-primary-500
                        dark:text-white
                        mask mask-hexed
                      "
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          role="img"
                          width="1em"
                          height="1em"
                          viewBox="0 0 256 256"
                          data-icon="ph:ear-duotone"
                          className="iconify w-5 h-5 iconify--ph"
                        >
                          <path
                            fill="currentColor"
                            d="M161.9 216A44 44 0 0 1 84 188c0-41.5-36-28-36-84a80 80 0 0 1 160 0c0 40 1 65-46.1 112Z"
                            opacity=".2"
                          ></path>
                          <path
                            fill="currentColor"
                            d="M188 152a28 28 0 0 1-56 0c0-15.7 9.3-23.7 16.8-30.1s11.2-10 11.2-17.9a32 32 0 0 0-64 0a8 8 0 0 1-16 0a48 48 0 0 1 96 0c0 15.7-9.3 23.7-16.8 30.1S148 144.1 148 152a12 12 0 0 0 24 0a8 8 0 0 1 16 0ZM128 16a88.1 88.1 0 0 0-88 88c0 33.5 12.5 45.5 22.5 55.2c7.8 7.5 13.5 13 13.5 28.8a52 52 0 0 0 92.1 33.1a8.1 8.1 0 0 0-1.1-11.3a7.9 7.9 0 0 0-11.2 1.1A36 36 0 0 1 92 188c0-22.6-9.8-32-18.4-40.4S56 130.7 56 104a72 72 0 0 1 144 0a8 8 0 0 0 16 0a88.1 88.1 0 0 0-88-88Z"
                          ></path>
                        </svg>
                      </div>
                      <div>
                        <h4
                          className="
                          font-heading font-semibold
                          text-sm text-muted-800
                          dark:text-white
                        "
                        >
                          Interview management
                        </h4>
                        <p className="font-sans text-xs text-muted-500 dark:text-muted-400">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit tum Torquatus.
                        </p>
                      </div>
                    </a>
                    <a
                      href="/product.html"
                      className="
                      relative
                      flex
                      gap-2
                      p-4
                      rounded-xl
                      hover:bg-muted-100
                      dark:hover:bg-muted-900
                      z-10
                      transition-colors
                      duration-300
                    "
                    >
                      <div
                        className="
                        relative
                        inline-flex
                        items-center
                        justify-center
                        w-10
                        min-w-[2.5rem]
                        h-10
                        bg-lime-100
                        dark:bg-lime-500
                        text-lime-500
                        dark:text-white
                        mask mask-hexed
                      "
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          role="img"
                          width="1em"
                          height="1em"
                          viewBox="0 0 256 256"
                          data-icon="ph:magnifying-glass-duotone"
                          className="iconify w-5 h-5 iconify--ph"
                        >
                          <circle
                            cx="116"
                            cy="116"
                            r="84"
                            fill="currentColor"
                            opacity=".2"
                          ></circle>
                          <path
                            fill="currentColor"
                            d="m229.7 218.3l-43.3-43.2a92.2 92.2 0 1 0-11.3 11.3l43.2 43.3a8.2 8.2 0 0 0 11.4 0a8.1 8.1 0 0 0 0-11.4ZM40 116a76 76 0 1 1 76 76a76.1 76.1 0 0 1-76-76Z"
                          ></path>
                        </svg>
                      </div>
                      <div>
                        <h4
                          className="
                          font-heading font-semibold
                          text-sm text-muted-800
                          dark:text-white
                        "
                        >
                          Advanced search
                        </h4>
                        <p className="font-sans text-xs text-muted-500 dark:text-muted-400">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit tum Torquatus.
                        </p>
                      </div>
                    </a>
                    <a
                      href="/product.html"
                      className="
                      relative
                      flex
                      gap-2
                      p-4
                      rounded-xl
                      hover:bg-muted-100
                      dark:hover:bg-muted-900
                      z-10
                      transition-colors
                      duration-300
                    "
                    >
                      <div
                        className="
                        relative
                        inline-flex
                        items-center
                        justify-center
                        w-10
                        min-w-[2.5rem]
                        h-10
                        bg-violet-100
                        dark:bg-violet-500
                        text-violet-500
                        dark:text-white
                        mask mask-hexed
                      "
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          role="img"
                          width="1em"
                          height="1em"
                          viewBox="0 0 256 256"
                          data-icon="ph:sparkle-duotone"
                          className="iconify w-5 h-5 iconify--ph"
                        >
                          <path
                            fill="currentColor"
                            d="m195.6 151.5l-52.1 19.2a8.1 8.1 0 0 0-4.8 4.8l-19.2 52.1a8 8 0 0 1-15 0l-19.2-52.1a8.1 8.1 0 0 0-4.8-4.8l-52.1-19.2a8 8 0 0 1 0-15l52.1-19.2a8.1 8.1 0 0 0 4.8-4.8l19.2-52.1a8 8 0 0 1 15 0l19.2 52.1a8.1 8.1 0 0 0 4.8 4.8l52.1 19.2a8 8 0 0 1 0 15Z"
                            opacity=".2"
                          ></path>
                          <path
                            fill="currentColor"
                            d="m198.4 129l-52.2-19.2L127 57.6a16 16 0 0 0-30 0l-19.2 52.2L25.6 129a16 16 0 0 0 0 30l52.2 19.2L97 230.4a16 16 0 0 0 30 0l19.2-52.2l52.2-19.2a16 16 0 0 0 0-30Zm-57.7 34.2a15.9 15.9 0 0 0-9.5 9.5L112 224.9l-19.2-52.2a15.9 15.9 0 0 0-9.5-9.5L31.1 144l52.2-19.2a15.9 15.9 0 0 0 9.5-9.5L112 63.1l19.2 52.2a15.9 15.9 0 0 0 9.5 9.5l52.2 19.2ZM144 40a8 8 0 0 1 8-8h16V16a8 8 0 0 1 16 0v16h16a8 8 0 0 1 0 16h-16v16a8 8 0 0 1-16 0V48h-16a8 8 0 0 1-8-8Zm104 48a8 8 0 0 1-8 8h-8v8a8 8 0 0 1-16 0v-8h-8a8 8 0 0 1 0-16h8v-8a8 8 0 0 1 16 0v8h8a8 8 0 0 1 8 8Z"
                          ></path>
                        </svg>
                      </div>
                      <div>
                        <h4
                          className="
                          font-heading font-semibold
                          text-sm text-muted-800
                          dark:text-white
                        "
                        >
                          Hotlist / Talent pool
                        </h4>
                        <p className="font-sans text-xs text-muted-500 dark:text-muted-400">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit tum Torquatus.
                        </p>
                      </div>
                    </a>
                    <a
                      href="/product.html"
                      className="
                      relative
                      flex
                      gap-2
                      p-4
                      rounded-xl
                      hover:bg-muted-100
                      dark:hover:bg-muted-900
                      z-10
                      transition-colors
                      duration-300
                    "
                    >
                      <div
                        className="
                        relative
                        inline-flex
                        items-center
                        justify-center
                        w-10
                        min-w-[2.5rem]
                        h-10
                        bg-teal-100
                        dark:bg-teal-500
                        text-teal-500
                        dark:text-white
                        mask mask-hexed
                      "
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          role="img"
                          width="1em"
                          height="1em"
                          viewBox="0 0 256 256"
                          data-icon="ph:microsoft-excel-logo-duotone"
                          className="iconify w-5 h-5 iconify--ph"
                        >
                          <path
                            fill="currentColor"
                            d="M152 80v96a8 8 0 0 1-8 8H40a8 8 0 0 1-8-8V80a8 8 0 0 1 8-8h104a8 8 0 0 1 8 8Z"
                            opacity=".2"
                          ></path>
                          <path
                            fill="currentColor"
                            d="M200 24H72a16 16 0 0 0-16 16v24H40a16 16 0 0 0-16 16v96a16 16 0 0 0 16 16h16v24a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16V40a16 16 0 0 0-16-16Zm-40 80h40v48h-40Zm40-16h-40v-8a16 16 0 0 0-16-16V40h56ZM72 40h56v24H72ZM40 80h104v96H40Zm32 112h56v24H72Zm72 24v-24a16 16 0 0 0 16-16v-8h40v48Zm-76.4-68.8L82 128l-14.4-19.2a8 8 0 1 1 12.8-9.6L92 114.7l11.6-15.5a8 8 0 0 1 12.8 9.6L102 128l14.4 19.2a8 8 0 0 1-1.6 11.2a7.7 7.7 0 0 1-4.8 1.6a8 8 0 0 1-6.4-3.2L92 141.3l-11.6 15.5A8 8 0 0 1 74 160a7.7 7.7 0 0 1-4.8-1.6a8 8 0 0 1-1.6-11.2Z"
                          ></path>
                        </svg>
                      </div>
                      <div>
                        <h4
                          className="
                          font-heading font-semibold
                          text-sm text-muted-800
                          dark:text-white
                        "
                        >
                          CSV import / export
                        </h4>
                        <p className="font-sans text-xs text-muted-500 dark:text-muted-400">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit tum Torquatus.
                        </p>
                      </div>
                    </a>
                    <a
                      href="/product.html"
                      className="
                      relative
                      flex
                      gap-2
                      p-4
                      rounded-xl
                      hover:bg-muted-100
                      dark:hover:bg-muted-900
                      z-10
                      transition-colors
                      duration-300
                    "
                    >
                      <div
                        className="
                        relative
                        inline-flex
                        items-center
                        justify-center
                        w-10
                        min-w-[2.5rem]
                        h-10
                        bg-rose-100
                        dark:bg-rose-500
                        text-rose-500
                        dark:text-white
                        mask mask-hexed
                      "
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          role="img"
                          width="1em"
                          height="1em"
                          viewBox="0 0 256 256"
                          data-icon="ph:circles-three-plus-duotone"
                          className="iconify w-5 h-5 iconify--ph"
                        >
                          <circle
                            cx="76"
                            cy="76"
                            r="36"
                            fill="currentColor"
                            opacity=".2"
                          ></circle>
                          <circle
                            cx="180"
                            cy="76"
                            r="36"
                            fill="currentColor"
                            opacity=".2"
                          ></circle>
                          <circle
                            cx="76"
                            cy="180"
                            r="36"
                            fill="currentColor"
                            opacity=".2"
                          ></circle>
                          <path
                            fill="currentColor"
                            d="M76 32a44 44 0 1 0 44 44a44 44 0 0 0-44-44Zm0 72a28 28 0 1 1 28-28a28.1 28.1 0 0 1-28 28Zm104 16a44 44 0 1 0-44-44a44 44 0 0 0 44 44Zm0-72a28 28 0 1 1-28 28a28.1 28.1 0 0 1 28-28ZM76 136a44 44 0 1 0 44 44a44 44 0 0 0-44-44Zm0 72a28 28 0 1 1 28-28a28.1 28.1 0 0 1-28 28Zm132-36h-20v-20a8 8 0 0 0-16 0v20h-20a8 8 0 0 0 0 16h20v20a8 8 0 0 0 16 0v-20h20a8 8 0 0 0 0-16Z"
                          ></path>
                        </svg>
                      </div>
                      <div>
                        <h4
                          className="
                          font-heading font-semibold
                          text-sm text-muted-800
                          dark:text-white
                        "
                        >
                          Task management
                        </h4>
                        <p className="font-sans text-xs text-muted-500 dark:text-muted-400">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit tum Torquatus.
                        </p>
                      </div>
                    </a>
                    <a
                      href="/product.html"
                      className="
                      relative
                      flex
                      gap-2
                      p-4
                      rounded-xl
                      hover:bg-muted-100
                      dark:hover:bg-muted-900
                      z-10
                      transition-colors
                      duration-300
                    "
                    >
                      <div
                        className="
                        relative
                        inline-flex
                        items-center
                        justify-center
                        w-10
                        min-w-[2.5rem]
                        h-10
                        bg-primary-100
                        dark:bg-primary-500
                        text-primary-500
                        dark:text-white
                        mask mask-hexed
                      "
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          role="img"
                          width="1em"
                          height="1em"
                          viewBox="0 0 256 256"
                          data-icon="ph:gift-duotone"
                          className="iconify w-5 h-5 iconify--ph"
                        >
                          <path
                            fill="currentColor"
                            d="M216 72h-35a32 32 0 0 0-47.3-42.9a29.2 29.2 0 0 0-5.7 8.2a29.2 29.2 0 0 0-5.7-8.2A32 32 0 0 0 75 72H40a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16v64a16 16 0 0 0 16 16h144a16 16 0 0 0 16-16v-64a16 16 0 0 0 16-16V88a16 16 0 0 0-16-16Zm-71-31.6A16 16 0 1 1 167.6 63c-4.9 5-19.2 7.7-31.3 8.7c1-12.1 3.7-26.4 8.7-31.3Zm-56.6 0a16.1 16.1 0 0 1 22.6 0c5 4.9 7.7 19.2 8.7 31.3c-12.1-1-26.4-3.7-31.3-8.7a16.1 16.1 0 0 1 0-22.6ZM40 88h80v32H40Zm16 48h64v64H56Zm144 64h-64v-64h64Zm16-80h-80V88h80v32Z"
                          ></path>
                          <path
                            fill="currentColor"
                            d="M208 128v72a8 8 0 0 1-8 8H56a8 8 0 0 1-8-8v-72Z"
                            opacity=".2"
                          ></path>
                        </svg>
                      </div>
                      <div>
                        <h4
                          className="
                          font-heading font-semibold
                          text-sm text-muted-800
                          dark:text-white
                        "
                        >
                          All Features
                        </h4>
                        <p className="font-sans text-xs text-muted-500 dark:text-muted-400">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit tum Torquatus.
                        </p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </li> */}
            {/* <li className="relative">
              <button
                type="button"
                className="relative inline-flex items-center gap-1 text-base font-sans text-muted-600 hover:text-primary-500 dark:text-muted-200 dark:hover:text-primary-400 py-2 md:mx-2 tw-accessibility z-50"
              >
                <span>Company</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  role="img"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                  data-icon="lucide:chevron-down"
                  className="iconify w-5 h-5 text-muted-400 dark:text-muted-300 transition-transform duration-300 iconify--lucide"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m6 9l6 6l6-6"
                  ></path>
                </svg>
              </button>
              <div className="fixed lg:absolute top-0 lg:top-14 inset-x-0 lg:left-0 w-full lg:w-[320px] pt-2 lg:-translate-x-1/4 transition-all duration-300 opacity-0 translate-y-1 pointer-events-none z-0">
                <div
                  className="
                  relative
                  w-full
                  min-h-[50vh]
                  lg:min-h-fit
                  px-3
                  pb-3
                  pt-12
                  lg:p-3
                  rounded-2xl
                  bg-white
                  dark:bg-muted-800
                  border border-muted-200
                  dark:border-muted-700
                  shadow-2xl shadow-muted-500/20
                  dark:shadow-muted-800/20
                "
                >
                  <button
                    type="button"
                    className="
                    absolute
                    top-2
                    right-2
                    h-12
                    w-12
                    flex
                    lg:hidden
                    items-center
                    justify-center
                    text-muted-600
                    dark:text-muted-200
                  "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      role="img"
                      width="1em"
                      height="1em"
                      viewBox="0 0 24 24"
                      data-icon="lucide:x"
                      className="iconify w-6 h-6 iconify--lucide"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M18 6L6 18M6 6l12 12"
                      ></path>
                    </svg>
                  </button>

                  <div className="grid gap-1 text-left">
                    <a
                      href="/about.html"
                      className="
                      relative
                      flex
                      gap-2
                      p-4
                      rounded-xl
                      hover:bg-muted-100
                      dark:hover:bg-muted-900
                      z-10
                      transition-colors
                      duration-300
                    "
                    >
                      <div
                        className="
                        relative
                        inline-flex
                        items-center
                        justify-center
                        w-10
                        min-w-[2.5rem]
                        h-10
                        bg-primary-100
                        dark:bg-primary-500
                        text-primary-500
                        dark:text-white
                        mask mask-hexed
                      "
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          role="img"
                          width="1em"
                          height="1em"
                          viewBox="0 0 256 256"
                          data-icon="ph:buildings-duotone"
                          className="iconify w-5 h-5 iconify--ph"
                        >
                          <path
                            fill="currentColor"
                            d="M144 216V40a8 8 0 0 0-8-8H40a8 8 0 0 0-8 8v176"
                            opacity=".2"
                          ></path>
                          <path
                            fill="currentColor"
                            d="M240 208h-8V104a16 16 0 0 0-16-16h-64V40a16 16 0 0 0-16-16H40a16 16 0 0 0-16 16v168h-8a8 8 0 0 0 0 16h224a8 8 0 0 0 0-16Zm-24-104v104h-64V104ZM40 40h96v168H40Zm16 32a8 8 0 0 1 8-8h32a8 8 0 0 1 0 16H64a8 8 0 0 1-8-8Zm64 64a8 8 0 0 1-8 8H80a8 8 0 0 1 0-16h32a8 8 0 0 1 8 8Zm-16 40a8 8 0 0 1-8 8H64a8 8 0 0 1 0-16h32a8 8 0 0 1 8 8Zm96 0a8 8 0 0 1-8 8h-16a8 8 0 0 1 0-16h16a8 8 0 0 1 8 8Zm-32-40a8 8 0 0 1 8-8h16a8 8 0 0 1 0 16h-16a8 8 0 0 1-8-8Z"
                          ></path>
                        </svg>
                      </div>
                      <div>
                        <h4
                          className="
                          font-heading font-semibold
                          text-sm text-muted-800
                          dark:text-white
                        "
                        >
                          About Us
                        </h4>
                        <p className="font-sans text-xs text-muted-500 dark:text-muted-400">
                          Learn more about us and our company
                        </p>
                      </div>
                    </a>
                    <a
                      href="/blog.html"
                      className="
                      relative
                      flex
                      gap-2
                      p-4
                      rounded-xl
                      hover:bg-muted-100
                      dark:hover:bg-muted-900
                      z-10
                      transition-colors
                      duration-300
                    "
                    >
                      <div
                        className="
                        relative
                        inline-flex
                        items-center
                        justify-center
                        w-10
                        min-w-[2.5rem]
                        h-10
                        bg-primary-100
                        dark:bg-primary-500
                        text-primary-500
                        dark:text-white
                        mask mask-hexed
                      "
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          role="img"
                          width="1em"
                          height="1em"
                          viewBox="0 0 256 256"
                          data-icon="ph:note-duotone"
                          className="iconify w-5 h-5 iconify--ph"
                        >
                          <path
                            fill="currentColor"
                            d="M216 160h-56v56l56-56z"
                            opacity=".2"
                          ></path>
                          <path
                            fill="currentColor"
                            d="M96 104h64a8 8 0 0 0 0-16H96a8 8 0 0 0 0 16Zm0 32h64a8 8 0 0 0 0-16H96a8 8 0 0 0 0 16Zm32 16H96a8 8 0 0 0 0 16h32a8 8 0 0 0 0-16Z"
                          ></path>
                          <path
                            fill="currentColor"
                            d="M224 156.7V48a16 16 0 0 0-16-16H48a16 16 0 0 0-16 16v160a16 16 0 0 0 16 16h108.7a15.9 15.9 0 0 0 11.3-4.7l51.3-51.3a16.3 16.3 0 0 0 3.3-4.9h.1a17.4 17.4 0 0 0 1.3-6.4ZM48 48h160v104h-48a8 8 0 0 0-8 8v48H48Zm148.7 120L168 196.7V168Z"
                          ></path>
                        </svg>
                      </div>
                      <div>
                        <h4
                          className="
                          font-heading font-semibold
                          text-sm text-muted-800
                          dark:text-white
                        "
                        >
                          Blog
                        </h4>
                        <p className="font-sans text-xs text-muted-500 dark:text-muted-400">
                          Stay tuned for our latest news
                        </p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </li> */}
            <li>
              <Link
                href="/about"
                className="
                block
                text-base
                font-sans
                text-muted-600
                hover:text-primary-500
                dark:text-muted-200 dark:hover:text-primary-400
                py-2
                md:mx-2
                tw-accessibility
              "
              >
                关于
              </Link>
            </li>
            <li>
              <Link
                href="/tags"
                className="
                block
                text-base
                font-sans
                text-muted-600
                hover:text-primary-500
                dark:text-muted-200 dark:hover:text-primary-400
                py-2
                md:mx-2
                tw-accessibility
              "
              >
                标签
              </Link>
            </li>
            <li>
              <a
                href="/admin"
                className="
                block
                text-base
                font-sans
                text-muted-600
                hover:text-primary-500
                dark:text-muted-200 dark:hover:text-primary-400
                py-2
                md:mx-2
                tw-accessibility
              "
              >
                管理
              </a>
            </li>
            <li className="lg:hidden flex justify-center">
              <ThemeButton />
            </li>
          </ul>
        </div>

        <div className="hidden lg:flex lg:w-1/5 lg:justify-end lg:gap-x-4">
          <button
            type="button"
            className="
          group
          h-12
          w-12
          rounded-full
          flex
          items-center
          justify-center
          tw-accessibility
        "
          >
            <div
              className="
            h-10
            w-10
            flex
            items-center
            justify-center
            rounded-full
            text-muted-400
            group-hover:text-muted-500 group-hover:bg-muted-100
            dark:group-hover:bg-muted-700 dark:group-hover:text-muted-100
            transition-colors
            duration-300
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
