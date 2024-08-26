"use client";
import { AdminMenu } from "@/components/Menu";
import { cn } from "@/lib/utils";
import { useState } from "react";

export const Nav = ({ children }) => {
  const [collapse, setCollapse] = useState(true);
  return (
    <div>
      <div
        className={cn(
          "dark:bg-muted-800 border-muted-200 dark:border-muted-700 fixed start-0 top-0 z-[60] flex h-full flex-col border-r bg-white transition-all duration-300 w-[240px] lg:translate-x-0",
          { "translate-x-0": !collapse, "-translate-x-full": collapse }
        )}
      >
        <button
          type="button"
          onClick={() => setCollapse((v) => !v)}
          className="flex size-10 items-center justify-center -ms-3"
        >
          <div className="relative size-5 scale-90">
            <span
              className={cn(
                "bg-primary-500 absolute block h-0.5 w-full transition-all duration-300  max-w-[75%]  rtl:rotate-45 top-0.5",
                { "-rotate-45 top-1": collapse }
              )}
            ></span>
            <span className="bg-primary-500 absolute top-1/2 block h-0.5 w-full max-w-[50%] transition-all duration-300 translate-x-4 opacity-0 rtl:-translate-x-4"></span>
            <span className="bg-primary-500 absolute block h-0.5 w-full transition-all duration-300 bottom-1 max-w-[75%] rotate-45 rtl:-rotate-45 bottom-0"></span>
          </div>
        </button>
        <AdminMenu />
      </div>
      <div className="bg-muted-100 dark:bg-muted-900 relative min-h-screen w-full px-4 transition-all duration-300 xl:px-10 lg:max-w-[calc(100%_-_240px)] lg:ms-[240px]">
        <div className="relative mb-5 flex h-16 items-center gap-2">
          <button
            type="button"
            onClick={() => setCollapse((v) => !v)}
            className="flex size-10 items-center justify-center -ms-3"
          >
            <div className="relative size-5 scale-90">
              <span className="bg-primary-500 absolute block h-0.5 w-full transition-all duration-300 top-1 max-w-[75%] -rotate-45 rtl:rotate-45 top-0.5"></span>
              <span className="bg-primary-500 absolute top-1/2 block h-0.5 w-full max-w-[50%] transition-all duration-300 translate-x-4 opacity-0 rtl:-translate-x-4"></span>
              <span className="bg-primary-500 absolute block h-0.5 w-full transition-all duration-300 bottom-1 max-w-[75%] rotate-45 rtl:-rotate-45 bottom-0"></span>
            </div>
          </button>
          <h1 className="nui-heading nui-heading-2xl nui-weight-light nui-lead-normal text-muted-800 hidden md:block dark:text-white">
            {/* Apex Charts */}
          </h1>
          <div className="ms-auto"></div>
          <label
            className="nui-theme-toggle"
            htmlFor="nui-input-692a1041-a9be-4b16-8580-1d50447cfe4a"
          >
            <input
              type="checkbox"
              className="nui-theme-toggle-input"
              id="nui-input-692a1041-a9be-4b16-8580-1d50447cfe4a"
            />
            <span className="nui-theme-toggle-inner">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="nui-sun">
                <g
                  fill="currentColor"
                  stroke="currentColor"
                  className="stroke-2"
                >
                  <circle cx="12" cy="12" r="5"></circle>
                  <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
                </g>
              </svg>
              <svg aria-hidden="true" viewBox="0 0 24 24" className="nui-moon">
                <path
                  fill="currentColor"
                  stroke="currentColor"
                  d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                  className="stroke-2"
                ></path>
              </svg>
            </span>
          </label>
          <button
            type="button"
            className="border-muted-200 hover:ring-muted-200 dark:hover:ring-muted-700 dark:border-muted-700 dark:bg-muted-800 dark:ring-offset-muted-900 flex size-9 items-center justify-center rounded-full border bg-white ring-1 ring-transparent transition-all duration-300 hover:ring-offset-4"
          ></button>
          <div className="group inline-flex items-center justify-center text-right">
            <div data-headlessui-state="" className="relative size-9 text-left">
              <div
                id="headlessui-menu-button-98"
                aria-haspopup="menu"
                aria-expanded="false"
                data-headlessui-state=""
              >
                <button
                  type="button"
                  className="group-hover:ring-muted-200 dark:group-hover:ring-muted-700 dark:ring-offset-muted-900 inline-flex size-9 items-center justify-center rounded-full ring-1 ring-transparent transition-all duration-300 group-hover:ring-offset-4"
                >
                  <span className="border-muted-200 dark:border-muted-700 dark:bg-muted-800 flex size-9 items-center justify-center rounded-full border bg-white">
                    <svg
                      data-v-b4402e20=""
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      role="img"
                      className="icon text-muted-400 size-5"
                      width="1em"
                      height="1em"
                      viewBox="0 0 256 256"
                    >
                      <g fill="currentColor">
                        <path
                          d="M208 192H48a8 8 0 0 1-6.88-12C47.71 168.6 56 139.81 56 104a72 72 0 0 1 144 0c0 35.82 8.3 64.6 14.9 76a8 8 0 0 1-6.9 12"
                          opacity=".2"
                        ></path>
                        <path d="M221.8 175.94c-5.55-9.56-13.8-36.61-13.8-71.94a80 80 0 1 0-160 0c0 35.34-8.26 62.38-13.81 71.94A16 16 0 0 0 48 200h40.81a40 40 0 0 0 78.38 0H208a16 16 0 0 0 13.8-24.06M128 216a24 24 0 0 1-22.62-16h45.24A24 24 0 0 1 128 216m-80-32c7.7-13.24 16-43.92 16-80a64 64 0 1 1 128 0c0 36.05 8.28 66.73 16 80Z"></path>
                      </g>
                    </svg>
                  </span>
                </button>
              </div>
              {/**/}
            </div>
          </div>
          <button
            type="button"
            className="border-muted-200 hover:ring-muted-200 dark:hover:ring-muted-700 dark:border-muted-700 dark:bg-muted-800 dark:ring-offset-muted-900 flex size-9 items-center justify-center rounded-full border bg-white ring-1 ring-transparent transition-all duration-300 hover:ring-offset-4"
          >
            <svg
              data-v-b4402e20=""
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              role="img"
              className="icon text-muted-400 size-5"
              width="1em"
              height="1em"
              viewBox="0 0 256 256"
            >
              <g fill="currentColor">
                <path
                  d="M112 80a32 32 0 1 1-32-32a32 32 0 0 1 32 32m64 32a32 32 0 1 0-32-32a32 32 0 0 0 32 32m-96 32a32 32 0 1 0 32 32a32 32 0 0 0-32-32m96 0a32 32 0 1 0 32 32a32 32 0 0 0-32-32"
                  opacity=".2"
                ></path>
                <path d="M80 40a40 40 0 1 0 40 40a40 40 0 0 0-40-40m0 64a24 24 0 1 1 24-24a24 24 0 0 1-24 24m96 16a40 40 0 1 0-40-40a40 40 0 0 0 40 40m0-64a24 24 0 1 1-24 24a24 24 0 0 1 24-24m-96 80a40 40 0 1 0 40 40a40 40 0 0 0-40-40m0 64a24 24 0 1 1 24-24a24 24 0 0 1-24 24m96-64a40 40 0 1 0 40 40a40 40 0 0 0-40-40m0 64a24 24 0 1 1 24-24a24 24 0 0 1-24 24"></path>
              </g>
            </svg>
          </button>
          <div className="group relative z-20 inline-flex items-center justify-center text-end">
            <div
              data-headlessui-state=""
              className="relative z-20 size-9 text-left"
            >
              <button
                className="group-hover:ring-primary-500 dark:ring-offset-muted-900 inline-flex size-9 items-center justify-center rounded-full ring-1 ring-transparent transition-all duration-300 group-hover:ring-offset-4"
                id="headlessui-menu-button-100"
                aria-haspopup="menu"
                aria-expanded="false"
                data-headlessui-state=""
                type="button"
              >
                <div className="relative inline-flex size-9 items-center justify-center rounded-full"></div>
              </button>
              {/**/}
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};
