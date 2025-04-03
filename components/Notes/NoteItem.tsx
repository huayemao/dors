"use client"
import Prose from "@/components/Base/Prose";
import { BaseCard, BaseTag, BaseButton } from "@shuriken-ui/react";
import { Note } from "@/app/(projects)/notes/constants";

import { cn, getDateStr } from "@/lib/utils";
import { FC, Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { useForceUpdate } from "@/lib/client/hooks/useForceupdate";

export function NoteItem({
  preview = false,
  data,
  filterTags,
  actions,
}: {
  preview?;
  data: Note;
  filterTags?: (v: string[]) => void;
  actions: Record<
    string,
    {
      title: string;
      onClick: () => void;
      start: JSX.Element;
      stopPropagation: boolean;
    }
  >;
}) {
  const forceUpdate = useForceUpdate();
  const contentRef = useRef<HTMLDivElement>(null);
  const [isOverflow, setIsOverflow] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkOverflow = useCallback(() => {
    if (preview && contentRef.current) {
      const isOverflowing = contentRef.current.scrollHeight > contentRef.current.clientHeight;
      setIsOverflow(isOverflowing);
    }
  }, [preview]);

  useEffect(() => {
    if (preview) {
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
    }
  }, [preview, data.content, checkOverflow, loading]);

  const Container = useMemo(() => {
    return preview
      ? (props) => (
        <BaseCard
          rounded="md"
          className="border-none relative break-inside-avoid"
        >
          {props.children}
        </BaseCard>
      )
      : Fragment;
  }, [preview]);

  const Main = useMemo(
    () => (
      <div
        ref={contentRef}
        className={cn("px-4 relative", {
          "min-w-[80%]": !preview,
          "lg:px-6 xs:max-h-72 xs:h-auto h-72  overflow-hidden": preview,
        })}
      >
        <Prose
          onLoadingChange={setLoading}
          key={data.id}
          content={data.content}
        />
        {preview && isOverflow && (
          <>
            <div className="absolute -bottom-1 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent" >
              {/* <span className="text-primary-500 absolute left-4 bottom-2">
                更多
              </span> */}
            </div>
          </>
        )}
      </div>
    ),
    [data.content, data.id, preview, isOverflow]
  );

  return preview ? (
    <ContextMenu>
      <ContextMenuTrigger>
        <Container>
          {Main}
          <div className=" m-2 p-2 ">
            <div className="mb-1 flex gap-2 flex-wrap items-end">
              {data.tags.length ? data.tags.map((e) => (
                <span key={e} className="cursor-pointer flex-shrink-0">
                  <BaseTag
                    key={e}
                    size="sm"
                    variant="pastel"
                    color="muted"
                    onClick={(ev) => {
                      ev.preventDefault();
                      ev.stopPropagation();
                      filterTags?.([e]);
                    }}
                  >
                    {e}
                  </BaseTag>
                </span>
              )) : <span
                className="opacity-0"
              >
                <BaseTag
                  size="sm"
                  variant="pastel"
                  color="muted"
                >
                  t {/* 这里只是为了对齐   */}
                </BaseTag></span>}
              <div className=" ml-auto not-prose text-right xs:text-xs md:text-sm text-slate-400">
                {getDateStr(new Date(data.id)).slice(0, -5)}
              </div>
            </div>
          </div>
        </Container>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        {Object.values(actions).map((action) => {
          return (
            <ContextMenuItem
              key={action.title}
              onClick={(ev) => {
                if (action.stopPropagation) {
                  ev.stopPropagation();
                  forceUpdate();
                }
                action.onClick();
              }}
            >
              {action.title}
            </ContextMenuItem>
          );
        })}
      </ContextMenuContent>
    </ContextMenu>
  ) : (
    <Container>{Main}</Container>
  );
}
