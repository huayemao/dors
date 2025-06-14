import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import { BaseButtonClose } from "@shuriken-ui/react";

interface PreviewModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  loading?: boolean;
}

export const PreviewModal = ({
  open,
  onClose,
  children,
  loading,
}: PreviewModalProps) => {
  return (
    <Dialog as={motion.div} open={open} className="relative z-50" onClose={onClose}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black bg-opacity-25"
      />

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="flex-1 max-w-full"
          >
            <Dialog.Panel className="min-h-[80vh] w-full transform overflow-hidden flex justify-center items-center bg-white dark:bg-muted-800 p-6 lg:p-8 text-left align-middle shadow-xl relative">
              <div className="mt-2 flex justify-center min-w-[95%] md:min-w-[75%] ">
                {loading ? (
                  <div className="flex justify-center items-center w-full h-32">
                    加载中...
                  </div>
                ) : (
                  children
                )}
              </div>
              <div className="absolute right-4 top-4">
                <BaseButtonClose
                  type="button"
                  onClick={onClose}
                />
              </div>
            </Dialog.Panel>
          </motion.div>
        </div>
      </div>
    </Dialog>
  );
}; 