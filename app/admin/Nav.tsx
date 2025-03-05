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
          "dark:bg-muted-800 border-muted-200 dark:border-muted-700 fixed start-0 top-0 z-[30] flex h-full flex-col border-r bg-white transition-all duration-300 w-[240px] lg:translate-x-0",
          { "translate-x-0": !collapse, "-translate-x-full": collapse }
        )}
      >
        <button
          type="button"
          onClick={() => setCollapse((v) => !v)}
          className="flex size-10 items-center justify-center md:hidden"
        >
          <div className="relative size-5 scale-90">
            <span
              className={cn(
                "bg-primary-500 absolute block h-0.5 w-full transition-all duration-300  max-w-[75%]  top-0.5",
                { "-rotate-45 rtl:rotate-45 top-1": !collapse }
              )}
            ></span>
            <span className={
              cn(
                "bg-primary-500 absolute top-1/2 block h-0.5 w-full max-w-[50%] transition-all duration-300 ",
                { " opacity-0 translate-x-4 rtl:-translate-x-4": !collapse }
              )}></span>
            <span className={
              cn("bg-primary-500 absolute block h-0.5 w-full transition-all duration-300  max-w-[75%]  bottom-0",
                { 'bottom-1 rotate-45 rtl:-rotate-45': !collapse })
            }></span>
          </div>
        </button>
        <AdminMenu />
      </div >
      <div className="bg-muted-100 dark:bg-muted-900 relative min-h-screen w-full px-4 transition-all duration-300 xl:px-10 lg:max-w-[calc(100%_-_240px)] lg:ms-[240px]">
        <div className="relative mb-5 flex h-16 items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setCollapse((v) => !v)}
            className="flex size-10 items-center justify-center"
          >
            <div className="relative size-5 scale-90">
              <span
                className={cn(
                  "bg-primary-500 absolute block h-0.5 w-full transition-all duration-300  max-w-[75%]  top-0.5",
                  { "-rotate-45 rtl:rotate-45 top-1": !collapse }
                )}
              ></span>
              <span className={
                cn(
                  "bg-primary-500 absolute top-1/2 block h-0.5 w-full max-w-[50%] transition-all duration-300 ",
                  { " opacity-0 translate-x-4 rtl:-translate-x-4": !collapse }
                )}></span>
              <span className={
                cn("bg-primary-500 absolute block h-0.5 w-full transition-all duration-300  max-w-[75%]  bottom-0",
                  { 'bottom-1 rotate-45 rtl:-rotate-45': !collapse })
              }></span>
            </div>
          </button>
          <h1 className="nui-heading nui-heading-2xl nui-weight-light nui-lead-normal text-muted-800 hidden md:block dark:text-white">
            {/* Apex Charts */}
          </h1>
          <div className="ms-auto"></div>
          <div className="group inline-flex items-center justify-center text-right">
            <div data-headlessui-state="" className="relative size-9 text-left">
              <div
                id="headlessui-menu-button-98"
                aria-haspopup="menu"
                aria-expanded="false"
                data-headlessui-state=""
              >
                <a href="/"
                  className="group-hover:ring-muted-200 dark:group-hover:ring-muted-700 dark:ring-offset-muted-900 inline-flex size-9 items-center justify-center rounded-full ring-1 ring-transparent transition-all duration-300 group-hover:ring-offset-4"
                >
                  首页
                </a>
              </div>
              {/**/}
            </div>
          </div>
        </div>
        {children}
      </div>
    </div >
  );
};
