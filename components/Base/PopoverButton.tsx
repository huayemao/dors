"use client";
import { BaseButton } from "@glint-ui/react";
import Icon from "@/components/Base/Icon";
import { useState } from "react";

export function PopoverButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <BaseButton
        shadow="hover"
        color="primary"
        rounded="lg"
        onClick={() => setIsOpen(true)}
        size="lg"
      >
        开始探索
      </BaseButton>

      {isOpen && (
        <div className="absolute top-0 right-0" onClick={() => setIsOpen(false)}>
          <div
            className="fixed lg:absolute top-0 lg:top-14 inset-x-0 lg:left-0 w-full lg:w-[320px] pt-2 lg:-translate-x-1/4 transition-all duration-300 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full min-h-[50vh] lg:min-h-fit px-3 pb-3 pt-12 lg:p-3 rounded-2xl bg-white dark:bg-muted-800 border border-muted-200 dark:border-muted-700 shadow-2xl shadow-muted-500/20 dark:shadow-muted-800/20">
              {/*Close button*/}
              <button
                type="button"
                className="absolute top-2 right-2 h-12 w-12 flex lg:hidden items-center justify-center text-muted-600 dark:text-muted-200"
                onClick={() => setIsOpen(false)}
              >
                <Icon
                  name="x"
                  className="w-6 h-6 flex items-center justify-center text-lg"
                />
              </button>

              {/*Grid*/}
              <div className="grid gap-1 text-left">
                {/*Grid item*/}
                <a
                  href="/about.html"
                  className="relative flex gap-2 p-4 rounded-xl hover:bg-muted-100 dark:hover:bg-muted-900 z-10 transition-colors duration-300"
                >
                  <div className="relative inline-flex items-center justify-center w-10 min-w-[2.5rem] h-10 bg-primary-100 dark:bg-primary-500 text-primary-500 dark:text-white mask mask-hexed">
                    <Icon
                      name="info"
                      className="w-5 h-5 flex items-center justify-center text-lg"
                    />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-sm text-muted-800 dark:text-white">
                      关于我们
                    </h4>
                    <p className="font-sans text-xs text-muted-500 dark:text-muted-400">
                      了解更多关于我们的信息
                    </p>
                  </div>
                </a>
                {/*Grid item*/}
                <a
                  href="/blog.html"
                  className="relative flex gap-2 p-4 rounded-xl hover:bg-muted-100 dark:hover:bg-muted-900 z-10 transition-colors duration-300"
                >
                  <div className="relative inline-flex items-center justify-center w-10 min-w-[2.5rem] h-10 bg-primary-100 dark:bg-primary-500 text-primary-500 dark:text-white mask mask-hexed">
                    <Icon
                      name="book"
                      className="w-5 h-5 flex items-center justify-center text-lg"
                    />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-sm text-muted-800 dark:text-white">
                      博客
                    </h4>
                    <p className="font-sans text-xs text-muted-500 dark:text-muted-400">
                      关注我们的最新动态
                    </p>
                  </div>
                </a>
                {/*Grid item*/}
                <a
                  href="/contact.html"
                  className="relative flex gap-2 p-4 rounded-xl hover:bg-muted-100 dark:hover:bg-muted-900 z-10 transition-colors duration-300"
                >
                  <div className="relative inline-flex items-center justify-center w-10 min-w-[2.5rem] h-10 bg-primary-100 dark:bg-primary-500 text-primary-500 dark:text-white mask mask-hexed">
                    <Icon
                      name="menu"
                      className="w-5 h-5 flex items-center justify-center text-lg"
                    />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-sm text-muted-800 dark:text-white">
                      联系我们
                    </h4>
                    <p className="font-sans text-xs text-muted-500 dark:text-muted-400">
                      想要联系我们？就在这里
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
