import { cn } from "@/lib/utils";
import { Dialog, Transition } from "@headlessui/react";
import { BaseButtonClose } from "@glint-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { forwardRef } from "react";

export const Modal = forwardRef<HTMLDivElement, {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  classes?: {
    wrapper?: string;
  };
}>(function Modal({
  open,
  onClose,
  children,
  title,
  actions,
  className,
  size,
  classes,
}, ref) {
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
      onClose={onClose}
      className={cn(
        "z-50 fixed inset-0 bg-muted-800/70 dark:bg-muted-900/80",
        classes?.wrapper
      )}
      open={open}
    >
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <Dialog.Panel
          ref={ref}
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
                <div className="flex w-full items-center justify-between p-4 md:px-6 border-b gap-4">
                  <Dialog.Title
                    as="h3"
                    className="w-1/2 flex-1 font-heading text-muted-900 text-lg font-medium leading-6 dark:text-white"
                  >
                    {title}
                  </Dialog.Title>
                  <div className="flex flex-shrink-0 gap-4 items-center">
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
});

Modal.displayName = "Modal";
