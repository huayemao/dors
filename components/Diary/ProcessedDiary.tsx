"use client";

import { BaseCard, BaseDropdown, BaseDropdownItem } from "@glint-ui/react";
import { Note } from "@/app/(projects)/notes/constants";
import { cn } from "@/lib/utils";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Edit2 } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import LightBox from "@/components/Base/LightBox";
import Prose from "../Base/Prose";
import { useRouter } from "next/navigation";

dayjs.locale('zh-cn');

interface ProcessedDiaryProps {
  data: Note & {
    parsedContent: React.ReactNode;
  };
  postId: string | number;
}

export const ProcessedDiary: FC<ProcessedDiaryProps> = ({ data, postId }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflow, setIsOverflow] = useState(false);
  const router = useRouter();

  const checkOverflow = useCallback(() => {
    if (contentRef.current) {
      const isOverflowing = contentRef.current.scrollHeight > contentRef.current.clientHeight;
      setIsOverflow(isOverflowing);
    }
  }, []);

  useEffect(() => {
    // Initial check
    checkOverflow();

    // Listen for content changes
    const observer = new ResizeObserver(checkOverflow);
    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [data.parsedContent, checkOverflow]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleEdit = () => {
    // Navigate to the notes page with the post ID and note ID
    router.push(`/notes/${postId}/${data.id}`)
  };

  return (
    <BaseCard rounded="md" className={cn("border-none relative")}>
      <div className="p-4">
        {/* Date display and Edit dropdown */}
        <div className="flex justify-between items-center text-sm md:text-base text-slate-400 border-b pb-2">
          <div>{dayjs(data.id).format('YYYY年M月D日 dddd')}</div>
          <BaseDropdown
            variant="context"
          >
            <BaseDropdownItem
              onClick={handleEdit}
              title="编辑"
              start={<Edit2 className="h-4 w-4" />}
            />
          </BaseDropdown>
        </div>

        {/* Content area */}
        <div
          ref={contentRef}
          className={cn("relative overflow-x-auto", {
            "max-h-72 lg:max-h-96 overflow-hidden": !isExpanded,
          })}
        >
          <Prose content={data.parsedContent} className={cn("pt-2")}>
          </Prose>

          {/* Gradient layer and expand/collapse button */}
          {!isExpanded && isOverflow && (
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-gray-900 dark:via-gray-900/80">
              <button
                onClick={toggleExpand}
                className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 hover:text-primary-600 transition-colors"
              >
                更多
                <ChevronDown className="size-4" />
              </button>
            </div>
          )}
        </div>

        {/* Collapse button */}
        {isExpanded && (
          <button
            onClick={toggleExpand}
            className="mt-2 flex items-center gap-1 hover:text-primary-600 transition-colors"
          >
            收起
            <ChevronUp className="size-4" />
          </button>
        )}
      </div>
      <LightBox />
    </BaseCard>
  );
}; 