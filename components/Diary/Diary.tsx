"use client";

import { BaseCard, BasePlaceload } from "@shuriken-ui/react";
import { Note } from "@/app/(projects)/notes/constants";
import { cn } from "@/lib/utils";
import { getDateStr } from "@/lib/utils";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import Prose from "@/components/Base/Prose";
import { ChevronDown, ChevronUp } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";

dayjs.locale('zh-cn');

interface DiaryProps {
  data: Note;
}

export const Diary: FC<DiaryProps> = ({ data }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflow, setIsOverflow] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkOverflow = useCallback(() => {
    if (contentRef.current) {
      const isOverflowing = contentRef.current.scrollHeight > contentRef.current.clientHeight;
      setIsOverflow(isOverflowing);
    }
  }, []);

  useEffect(() => {
    // 初始检查
    checkOverflow();

    // 监听内容变化
    const observer = new ResizeObserver(checkOverflow);
    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [data.content, checkOverflow, loading]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <BaseCard rounded="md" className={cn("border-none relative ")}>
      <div className="p-4">
        {/* 日期显示 */}
        <div className="text-sm md:text-base text-slate-400 border-b pb-2">
          {dayjs(data.id).format('YYYY年M月D日 dddd')}
        </div>

        {/* 内容区域 */}
        <div
          ref={contentRef}
          className={cn("relative overflow-x-auto", {
            "max-h-72 lg:max-h-96 overflow-hidden": !isExpanded,
          })}
        >
          <Prose
            onLoadingChange={setLoading}
            key={data.id}
            content={data.content}
            className={cn("prose-sm sm:prose-base pt-2 font-LXGW_WenKai", {
              "opacity-0": loading,
              "opacity-100": !loading
            })}
          />
          {loading && <div className="h-72 lg:h-96 p-4 flex flex-col justify-center items-center">
            加载中...
          </div>}
          {/* 渐变层和展开/收起按钮 */}
          {!isExpanded && isOverflow && (
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent">
              <button
                onClick={toggleExpand}
                className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1  hover:text-primary-600 transition-colors"
              >
                更多
                <ChevronDown className="size-4" />
              </button>
            </div>
          )}
        </div>

        {/* 收起按钮 */}
        {isExpanded && (
          <button
            onClick={toggleExpand}
            className="mt-2 flex items-center gap-1  hover:text-primary-600 transition-colors"
          >
            收起
            <ChevronUp className="size-4" />
          </button>
        )}
      </div>
    </BaseCard >
  );
}; 