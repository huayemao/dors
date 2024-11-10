import { BaseTag } from "@shuriken-ui/react";
import { Note } from "@/app/(projects)/notes/constants";

import { useCloseModal } from "@/lib/client/utils/useCloseModal";

export const NoteModalTitle = ({
  note,
  filterTags,
}: {
  note: Note;
  filterTags: any;
}) => {
  const close = useCloseModal();

  return (
    <>
      <span className="flex mb-2 gap-2 flex-nowrap  items-start overflow-x-auto py-1 leading-normal">
        {note.tags?.map((e) => (
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
      {
        <time className="text-xs text-slate-600">
          {new Date(note.id).toLocaleDateString()}
        </time>
      }
    </>
  );
};
