"use client";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";

import { BaseButton } from "@glint-ui/react";
import Icon from "@/components/Base/Icon";
import { Float } from "@headlessui-float/react";

export function GuideButton() {
  return (
    <div className="relative">
      <Popover>
        <Float
          placement="bottom-start"
          offset={15}
          shift={6}
          flip={10}
          arrow={5}
          // portal
          enter="transition duration-200 ease-out"
          enterFrom="opacity-0 -translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition duration-150 ease-in"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 -translate-y-1"
        >
          <PopoverButton
            as={BaseButton}
            shadow="hover"
            color="primary"
            rounded="lg"
            size="lg"
          >
            开始探索
          </PopoverButton>
          <PopoverPanel>
            <div className="w-80 md:w-96 p-3 lg:p-3 rounded-2xl bg-white dark:bg-muted-800 border border-muted-200 dark:border-muted-700 shadow-2xl shadow-muted-500/20 dark:shadow-muted-800/20">

              {/*Grid*/}
              <div className="grid gap-1 text-left">
                {/*Grid item*/}
                <a
                  href="/posts"
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
                      博客
                    </h4>
                    <p className="font-sans text-xs text-muted-500 dark:text-muted-400">
                      数字花园之花坛。将工具探索、读书浅思、好物寻觅化作朵朵花束，盛满即时灵感与生活细碎。
                    </p>
                  </div>
                </a>
                {/*Grid item*/}
                <a
                  href="/books"
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
                      知识库
                    </h4>
                    <p className="font-sans text-xs text-muted-500 dark:text-muted-400">
                      数字花园之果园。将零散认知、实用技能、深度思考 “栽种”
                      成果树，经时间打磨褪去杂乱，留下扎实养分。
                    </p>
                  </div>
                </a>
                {/*Grid item*/}
                <a
                  href="/navigation"
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
                      导航页
                    </h4>
                    <p className="font-sans text-xs text-muted-500 dark:text-muted-400">
                      数字花园之小径。以清晰脉络串联每处精彩，消解寻觅的迷茫，指引访客避开信息
                      “杂草”。
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </PopoverPanel>
        </Float>
      </Popover>
    </div>
  );
}
