import { cn } from "@/lib/utils";
import { Dialog, Transition } from "@headlessui/react";
import { BaseButtonClose } from "@shuriken-ui/react";
import { AnimatePresence, motion } from "framer-motion";

export const Modal = ({
  open,
  onClose,
  children,
  title,
  actions,
  className,
  size,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
}) => {
  const dialogClasses = (() => {
    const classes: string[] = [];

    switch (size) {
      case "sm":
        classes.push("max-w-sm");
        break;
      case "md":
        classes.push("max-w-md");
        break;
      case "lg":
        classes.push("max-w-xl");
        break;
      case "xl":
        classes.push("max-w-2xl");
        break;
      case "2xl":
        classes.push("max-w-3xl");
        break;
      case "3xl":
        classes.push("max-w-5xl");
        break;
    }

    return classes;
  })();

  return (
    <Dialog
      key={String(open)}
      unmount={false}
      onClose={onClose}
      className="z-50 fixed inset-0 bg-muted-800/70 dark:bg-muted-900/80"
      open={open}
      as={motion.div}
      // initial={{ opacity: 0 }}
      // animate={{ opacity: 1 }}
      // exit={{ opacity: 0 }}
    >
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <Dialog.Panel
          className={cn(
            "dark:bg-muted-800 w-full bg-white text-left align-middle shadow-xl rounded-md max-w-5xl",
            dialogClasses,
            className
          )}
          as={motion.div}
          initial={{ scale: 0.75, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.6, opacity: 0 }}
        >
          <div className="">
            <div className="">
              {title && (
                <div className="flex w-full items-center justify-between p-4 md:p-6 border-b">
                  <Dialog.Title
                    as="h3"
                    className="font-heading text-muted-900 text-lg font-medium leading-6 dark:text-white"
                  >
                    {title}
                  </Dialog.Title>
                  <div className="flex gap-4 items-center">
                    {actions}
                    <BaseButtonClose onClick={onClose}></BaseButtonClose>
                  </div>
                </div>
              )}
              <div
                className={cn(
                  "p-4 max-h-[82vh] overflow-y-auto overflow-x-hidden break-all"
                )}
              >
                {children}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
