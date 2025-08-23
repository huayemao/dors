import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { FC, PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

interface SlideDialogProps extends PropsWithChildren {
  open: boolean;
  onClose: () => void;
  className?: string;
}

export const SlideDialog: FC<SlideDialogProps> = ({
  open,
  onClose,
  children,
  className,
}) => {
  return (
    <Dialog open={open} onClose={onClose} className="fixed inset-0 z-[30]">
      <DialogBackdrop
        as={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-muted-800/70 dark:bg-muted-900/80"
      />
      <DialogPanel>
        <motion.div
          className={cn(
            "dark:bg-muted-800 border-muted-200 dark:border-muted-700 fixed end-0 top-0 z-[30] flex h-full flex-col border-l bg-white w-[300px]",
            className
          )}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </DialogPanel>
    </Dialog>
  );
};
