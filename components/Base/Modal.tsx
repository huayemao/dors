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
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) => {
  return (
    <Dialog
      onClose={onClose}
      className="z-50 fixed inset-0 bg-muted-800/70 dark:bg-muted-900/80"
      open={open}
      as={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className=" fixed inset-0">
        <Dialog.Panel
          className="fixed inset-0"
          as={motion.div}
          initial={{ scale: 0.75, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.6, opacity: 0 }}
        >
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <div className="dark:bg-muted-800 w-full bg-white text-left align-middle shadow-xl transition-all rounded-md max-w-5xl">
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
              <div
                className={cn(
                  "p-4 max-h-[82vh] overflow-y-auto overflow-x-hidden",
                  className
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
