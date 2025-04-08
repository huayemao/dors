"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useClientMediaQuery } from "@/lib/client/hooks/useClientMediaQuery";
import { cn } from "@/lib/utils";
import { NavigationItem } from "./NavigationItem";
import { useMediaQuery } from "@uidotdev/usehooks";
import { Fragment } from "react";
import { BaseThemeToggle } from "@shuriken-ui/react";

interface ClientNavContentProps {
  menuItems: any[];
  mobileOpen: boolean;
  closeMobileNav: () => void;
}

export const ClientNavContent = ({
  menuItems,
  mobileOpen,
  closeMobileNav,
}: ClientNavContentProps) => {
  const isMobile = useClientMediaQuery("only screen and (max-width : 720px)");
  return (
    <>
      {(mobileOpen || !isMobile) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: 1,
            height: "auto",
            transition: {
              height: { duration: 0.3 },
              opacity: { duration: 0.2 },
            },
          }}
          exit={{
            opacity: 0,
            height: 0,
            transition: {
              height: { duration: 0.3 },
              opacity: { duration: 0.2 },
            },
          }}
          id="nav-content"
          className={cn(
            "flex justify-center lg:relative lg:flex lg:text-left flex-grow overflow-hidden",
            {
              "absolute inset-12": mobileOpen,
            }
          )}
        >
          <motion.div
            initial={{ y: -20 }}
            animate={{
              y: 0,
            }}
            exit={{
              y: -20,
            }}
            className={cn({ "m-8 w-full space-y-4": isMobile })}
          >
            <motion.ul className="flex flex-col lg:items-center justify-between mt-3 mb-1 lg:flex-row lg:mx-auto lg:mt-0 lg:mb-0 lg:gap-x-5 divide-y dark:divide-muted-100/60 lg:divide-y-0">
              {menuItems.map((e, index) => (
                <NavigationItem
                  key={e.href || e.title}
                  {...e}
                  className="min-w-32 lg:min-w-fit px-2"
                  onClick={closeMobileNav}
                  as={motion.li}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    transition: {
                      delay: 0.2 + index * 0.1,
                    },
                  }}
                  exit={{
                    opacity: 0,
                    x: -20,
                    transition: { duration: 0.2 },
                  }}
                />
              ))}
            </motion.ul>
            <motion.div
              className="lg:hidden absolute bottom-4 flex justify-center"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { delay: 0.3 },
              }}
              exit={{
                opacity: 0,
                transition: { duration: 0.2 },
              }}
            ></motion.div>
            {isMobile && (
              <div className="flex justify-center">
                <BaseThemeToggle />
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </>
  );
};
