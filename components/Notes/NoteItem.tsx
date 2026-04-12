"use client";
import Prose from "@/components/Base/Prose";
import { BaseCard, BaseTag, BaseButton, BaseTabs } from "@glint-ui/react";
import { Note } from "@/app/(projects)/notes/constants";

import { cn, getDateStr } from "@/lib/utils";
import { FC, Fragment, useCallback, useEffect, useMemo, useRef, useState, type JSX } from "react";
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
  className
}: {
  preview?;
  data: Note;
  filterTags?: (v: string[]) => void;
  className?: string;
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
      const isOverflowing =
        contentRef.current.scrollHeight > contentRef.current.clientHeight;
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

  const splitContentByH2 = useMemo(() => {
    if (!data.content) {
      return [];
    }
    
    const lines = data.content.split('\n');
    const sections: { title: string; content: string; }[] = [];
    let currentSection = { title: 'Main', content: '' };
    
    lines.forEach((line, index) => {
      if (line.trim().startsWith('## ')) {
        if (currentSection.content.trim() || index === 0) {
          sections.push({ ...currentSection });
        }
        currentSection = {
          title: line.trim().replace('## ', ''),
          content: ''
        };
      } else {
        currentSection.content += line + '\n';
      }
    });
    
    if (currentSection.content.trim() || sections.length === 0) {
      sections.push(currentSection);
    }
    
    return sections;
  }, [data.content]);

  const hasMultipleSections = splitContentByH2.length > 1;
  const hasMainContent = splitContentByH2[0]?.content.trim() && splitContentByH2[0]?.title === 'Main';

  const Main = useMemo(
    () => (
      <div
        ref={contentRef}
        className={cn("px-4 relative mx-auto w-full", {
          "min-h-64 lg:px-6 xs:max-h-72 xs:h-auto h-72  overflow-hidden": preview,
        }, className)}
      >
        {(hasMultipleSections&&!preview) ? (
          <BaseTabs defaultValue={splitContentByH2[0].title} tabs={splitContentByH2.map(section => ({ label: section.title, value: section.title }))}>
            {(activeValue) => (
              <>
                {splitContentByH2.map((section) => (
                  section.title === activeValue && (
                    <div key={section.title}>
                      <Prose
                        className="mx-auto font-LXGW_WenKai"
                        onLoadingChange={setLoading}
                        key={data.id + section.title}
                        content={section.content}
                        preview={preview}
                      />
                    </div>
                  )
                ))}
              </>
            )}
          </BaseTabs>
        ) : (
          <Prose
            className="mx-auto font-LXGW_WenKai"
            onLoadingChange={setLoading}
            key={data.id}
            content={data.content}
            preview={preview}
          />
        )}
        {preview && isOverflow && (
          <>
            <div className="absolute -bottom-1 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-muted-800 dark:via-muted-800/80 via-white/80 to-transparent">
              {/* <span className="text-primary-500 absolute left-4 bottom-2">
                更多
              </span> */}
            </div>
          </>
        )}
      </div>
    ),
    [preview, className, hasMultipleSections, splitContentByH2, data.id, data.content, isOverflow]
  );

  return preview ? (
    <ContextMenu>
      <ContextMenuTrigger>
        {/* eslint-disable-next-line react-hooks/static-components */}
        <Container>
          {Main}
          <div className=" m-2 p-2 ">
            <div className="mb-1 flex gap-2 flex-wrap items-end">
              {data.tags.length ? (
                data.tags.map((e) => (
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
                ))
              ) : (
                <span className="opacity-0">
                  <BaseTag size="sm" variant="pastel" color="muted">
                    t {/* 这里只是为了对齐   */}
                  </BaseTag>
                </span>
              )}
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
