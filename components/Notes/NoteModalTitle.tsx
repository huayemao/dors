import { BaseTag } from "@shuriken-ui/react";
import { Note } from "@/app/(projects)/notes/constants";
import { useCloseModal } from "@/lib/client/hooks/useCloseModal";
import { useOverflowShadow } from "@/lib/client/hooks/useOverflowShadow";
import { useRef } from "react";
import { cn } from "@/lib/utils";

export const NoteModalTitle = ({
  note,
  filterTags,
}: {
  note: Note;
  filterTags: any;
}) => {
  const close = useCloseModal();
  const ref = useRef(null);
  const hasShadow = useOverflowShadow(ref);

  return (
    <div className="flex flex-col justify-center gap-2">
      <span className="align-middle">
        <i className="text-primary-500 font-bold mr-2">{note.seq} </i>
        <time className="text-slate-600 text-xs">
          {new Date(note.id).toLocaleDateString()}
        </time>
      </span>
      {!!note.tags.length && (
        <div className="relative">
          <span
            ref={ref}
            className="flex mb-2 gap-2 flex-nowrap  items-start overflow-x-auto nui-slimscroll leading-normal py-1"
          >
            {note.tags.map((e) => (
              <div key={e} className="cursor-pointer flex-shrink-0">
                <BaseTag
                  key={e}
                  size="sm"
                  color="primary"
                  onClick={() => {
                    filterTags([e]);
                    close();
                  }}
                >
                  {e}
                </BaseTag>
              </div>
            ))}
          </span>
          <div
            className={cn("absolute top-0 right-0 w-4 h-4/5 z-10 hidden", {
              block: hasShadow,
            })}
            style={{
              background:
                "linear-gradient(270deg, rgba(0, 0, 0, 0.35), transparent)",
            }}
          ></div>
        </div>
      )}
    </div>
  );
};
