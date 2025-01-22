import Prose from "@/components/Base/Prose";
import { BaseCard, BaseTag } from "@shuriken-ui/react";
import { Note } from "@/app/(projects)/notes/constants";

import { cn, getDateStr } from "@/lib/utils";
import { FC, Fragment, useCallback, useEffect, useMemo } from "react";
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
  filterTags: (v: string[]) => void;
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
  const Container = useMemo(() => {
    return preview
      ? (props) => (
          <BaseCard
            rounded="md"
            className="border-none relative break-inside-avoid my-3"
          >
            {props.children}
          </BaseCard>
        )
      : Fragment;
  }, [preview]);

  const Main = useMemo(
    () => (
      <div
        className={cn("px-4", {
          "min-w-[80%]": !preview,
          "lg:px-6": preview,
        })}
      >
        <Prose key={data.id} preview={preview} content={data.content}></Prose>
      </div>
    ),
    [data.content, data.id, preview]
  );

  return preview ? (
    <ContextMenu>
      <ContextMenuTrigger>
        <Container>
          {Main}
          <div className="m-2 p-2 rounded-b">
            <div className="mb-1 flex gap-2 flex-wrap items-end">
              {data.tags?.map((e) => (
                <span key={e} className="cursor-pointer flex-shrink-0">
                  <BaseTag
                    key={e}
                    size="sm"
                    variant="pastel"
                    color="muted"
                    onClick={(ev) => {
                      ev.preventDefault();
                      ev.stopPropagation();
                      filterTags([e]);
                    }}
                  >
                    {e}
                  </BaseTag>
                </span>
              ))}
              <div className="ml-auto not-prose text-right text-xs md:text-sm text-slate-500">
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
