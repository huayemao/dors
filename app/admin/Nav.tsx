"use client";
import { AdminMenu } from "@/components/Menu";
import Logo from "@/components/Nav/Logo";
import { cn } from "@/lib/utils";
import { BaseThemeToggle } from "@shuriken-ui/react";
import { Dialog } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";

export const Nav = ({ children }) => {
  const [collapse, setCollapse] = useState(true);
  const isDeskTop = useMediaQuery("only screen and (min-width : 960px)");

  const Content = <>

    <button
      type="button"
      onClick={() => setCollapse((v) => !v)}
      className="flex size-10 items-center justify-center md:hidden self-start"
    >
      <div className="relative size-5 scale-90">
        <span
          className={cn(
            "bg-primary-500 dark:bg-muted-100 absolute block h-0.5 w-full transition-all duration-300  max-w-[75%]  top-0.5",
            { "-rotate-45 rtl:rotate-45 top-1": !collapse }
          )}
        ></span>
        <span className={
          cn(
            "bg-primary-500 dark:bg-muted-100 absolute top-1/2 block h-0.5 w-full max-w-[50%] transition-all duration-300 ",
            { " opacity-0 translate-x-4 rtl:-translate-x-4": !collapse }
          )}></span>
        <span className={
          cn("bg-primary-500 dark:bg-muted-100 absolute block h-0.5 w-full transition-all duration-300  max-w-[75%]  bottom-0",
            { 'bottom-1 rotate-45 rtl:-rotate-45': !collapse })
        }></span>
      </div>
    </button>
    <div className="px-4 lg:py-6 w-36">
      <Logo></Logo>
    </div>
    <AdminMenu /></>

  return (
    <div>
      <AnimatePresence>
        {!isDeskTop && !collapse && (
          <Dialog
            open={!collapse}
            onClose={() => setCollapse(true)}
            className="fixed inset-0 z-[30]"
          >
            <Dialog.Overlay
              as={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-muted-800/70 dark:bg-muted-900/80"
            />
            <Dialog.Panel
              as={motion.div}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, }}
              className={cn(
                "dark:bg-muted-800 border-muted-200 dark:border-muted-700 fixed start-0 top-0 z-[30] flex h-full flex-col items-center border-r bg-white w-[240px] lg:translate-x-0"
              )}
            >
              {Content}
            </Dialog.Panel>
          </Dialog>
        )}
        {isDeskTop && <div className="dark:bg-muted-800 border-muted-200 dark:border-muted-700 fixed start-0 top-0 z-[30] flex h-full flex-col items-center border-r bg-white  w-[240px]">
          {Content}
        </div>}
      </AnimatePresence>
      <div className="bg-muted-100 dark:bg-muted-900 relative min-h-screen w-full px-4 transition-all duration-300 xl:px-10 lg:max-w-[calc(100%_-_240px)] lg:ms-[240px]">
        <div className="relative mb-5 flex h-16 items-center gap-2">
          <button
            type="button"
            onClick={() => setCollapse((v) => !v)}
            className="flex size-10 items-center justify-center md:hidden"
          >
            <div className="relative size-5 scale-90">
              <span
                className={cn(
                  "bg-primary-500 dark:bg-muted-100 absolute block h-0.5 w-full transition-all duration-300  max-w-[75%]  top-0.5",
                  { "-rotate-45 rtl:rotate-45 top-1": !collapse }
                )}
              ></span>
              <span className={
                cn(
                  "bg-primary-500 dark:bg-muted-100 absolute top-1/2 block h-0.5 w-full max-w-[50%] transition-all duration-300 ",
                  { " opacity-0 translate-x-4 rtl:-translate-x-4": !collapse }
                )}></span>
              <span className={
                cn("bg-primary-500 dark:bg-muted-100 absolute block h-0.5 w-full transition-all duration-300  max-w-[75%]  bottom-0",
                  { 'bottom-1 rotate-45 rtl:-rotate-45': !collapse })
              }></span>
            </div>
          </button>
          <h1 className="nui-heading nui-heading-2xl nui-weight-light nui-lead-normal text-muted-800 hidden md:block dark:text-white">
            {/* Apex Charts */}
          </h1>
          <div className="ms-auto"></div>
          <div className="group inline-flex items-center justify-center text-right">
            <BaseThemeToggle></BaseThemeToggle>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};
