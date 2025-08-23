"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useClientMediaQuery } from "@/lib/client/hooks/useClientMediaQuery";
import { cn } from "@/lib/utils";
import { NavigationItem } from "./NavigationItem";
import { useMediaQuery } from "@uidotdev/usehooks";
import { Fragment } from "react";
import { BaseInput, BaseThemeToggle } from "@glint-ui/react";

interface ClientNavContentProps {
  menuItems: any[];
  mobileOpen: boolean;
  closeMobileNav: () => void;
  openSearchPanel?: () => void;
}

export const ClientNavContent = ({
  menuItems,
  mobileOpen,
  closeMobileNav,
  openSearchPanel
}: ClientNavContentProps) => {
  const isMobile = useClientMediaQuery("only screen and (max-width : 768px)");
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
            "flex justify-center md:relative md:flex md:text-left flex-grow overflow-hidden",
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
            <motion.ul className="flex flex-col md:items-center justify-between mt-3 mb-1 md:flex-row md:mx-auto md:mt-0 md:mb-0 md:gap-x-5 divide-y dark:divide-muted-100/60 md:divide-y-0">
              {menuItems.map((e, index) => (
                <NavigationItem
                  key={e.href || e.title}
                  {...e}
                  className="min-w-32 md:min-w-fit px-2"
                  onClick={closeMobileNav}
                  as={motion.li}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    transition: {
                      delay: 0.15 + index * 0.08,
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
              className="md:hidden absolute bottom-4 flex justify-center"
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
              <div className="flex flex-col gap-4 items-center justify-center">
                <BaseThemeToggle />
                <BaseInput
                  classes={{ wrapper: "flex-1 relative nui-autocomplete" }}
                  icon="lucide:search"
                  contrast="muted"
                  onClick={openSearchPanel}
                  placeholder="搜索"

                // clearable
                ></BaseInput>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </>
  );
};
