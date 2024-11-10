import Prose from "@/components/Base/Prose";
import { BaseCard, BaseTag } from "@shuriken-ui/react";
import { Note } from "@/app/(projects)/notes/constants";

import { cn, getDateStr } from "@/lib/utils";
import { FC, Fragment, useCallback, useEffect, useMemo } from "react";

export function NoteItem({
  preview = false,
  data,
  filterTags,
}: {
  preview?;
  data: Note;
  filterTags: (v: string[]) => void;
}) {
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

  return (
    <Container>
      <div className={cn("p-4 lg:px-6", { "min-w-[80%]": !preview })}>
        <Prose key={data.id} preview={preview} content={data.content}></Prose>
      </div>
      {preview && (
        <>
          {/* <hr className="text-primary-200 w-[90%] mx-auto"></hr> */}
          <div className="m-2 p-2 rounded-b">
            <div className="mb-1 flex gap-2 flex-wrap  items-end overflow-x-auto">
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
              <div className="ml-auto not-prose text-right text-sm text-slate-500">
                {getDateStr(new Date(data.id)).slice(0, -5)}
              </div>
            </div>
          </div>
        </>
      )}
    </Container>
  );
}
