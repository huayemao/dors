"use client";
import Prose from "@/components/Base/Prose";
import {
  BaseButton,
  BaseButtonGroup,
  BaseButtonIcon,
  BaseCard,
  BaseInput,
  BaseListbox,
  BaseTag,
} from "@shuriken-ui/react";
import EntityRoute from "@/lib/client/createEntity/EntityRoute";
import { Note } from "@/app/(projects)/notes/constants";
import { useEntity, useEntityDispatch } from "@/contexts/notes";
import { NoteForm } from "@/app/(projects)/notes/NoteForm";
import NotesPage from "@/app/(projects)/notes/page";
import { cn, getDateStr } from "@/lib/utils";
import { FC, Fragment, useCallback, useEffect, useMemo } from "react";
import localforage from "localforage";
import toast from "react-hot-toast";
import { EntityDispatch } from "@/lib/client/createEntity/createEntityContext";
import { useDebounce } from "@uidotdev/usehooks";
import { RotateCcwIcon, XIcon } from "lucide-react";
import { useCloseModal } from "@/lib/client/utils/useCloseModal";

const NoteModalTitle = ({ note, filterTags }: { note: Note; filterTags: any }) => {
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

export const NotesContainer = ({
  basename = "/notes",
}: {
  basename?: string;
}) => {
  const state = useEntity();
  const dispatch = useEntityDispatch();

  useEffect(() => {
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().then((persistent) => {
        localforage.getItem("alerted").then((v) => {
          if (v) {
            return;
          }
          if (persistent) {
            toast("Storage will not be cleared except by explicit user action");
          } else {
            toast("Storage may be cleared by the UA under storage pressure.");
          }
          localforage.setItem("alerted", true);
        });
      });
    }
  }, []);

  const filterTags = useCallback(
    (v: string[]) => {
      dispatch({
        type: "SET_FILTERS",
        payload: {
          ...state.filters,
          tags: v,
        },
      });
    },
    [dispatch, state.filters]
  );

  return (
    <main>
      <EntityRoute
        key="notes"
        renderEntityModalTitle={(e: Note) => (
          <NoteModalTitle note={e} filterTags={filterTags} />
        )}
        renderEntity={(e: Note, { preview }) => (
          <NoteItem
            key={e.id}
            data={e}
            preview={preview}
            filterTags={filterTags}
          ></NoteItem>
        )}
        slots={{ head: Filters }}
        state={state}
        dispatch={dispatch}
        RootPage={NotesPage}
        basename={basename}
        createForm={NoteForm}
        updateForm={NoteForm}
      ></EntityRoute>
    </main>
  );
};

const Filters: FC<{
  state: ReturnType<typeof useEntity>;
  dispatch: ReturnType<typeof useEntityDispatch>;
}> = ({ state, dispatch }) => {
  const allTags = Array.from(new Set(state.entityList.flatMap((e) => e.tags)));

  const search = useCallback(
    (v) => {
      dispatch({
        type: "SET_FILTERS",
        payload: {
          ...state.filters,
          content: v,
        },
      });
    },
    [dispatch, state.filters]
  );

  const filterTags = useCallback(
    (v: string[] | undefined) => {
      dispatch({
        type: "SET_FILTERS",
        payload: {
          ...state.filters,
          tags: v,
        },
      });
    },
    [dispatch, state.filters]
  );
  return (
    <div className="flex flex-col lg:grid grid-cols-2 gap-4 mb-4">
      <div className="flex items-center gap-2">
        <BaseListbox
          classes={{ wrapper: "flex-[2]" }}
          size="sm"
          label="标签"
          labelFloat
          multiple
          multipleLabel={(v) => {
            return v.length == allTags.length ? "全部" : v.join("、");
          }}
          items={allTags}
          value={state.filters.tags || allTags}
          onChange={(v) => {
            dispatch({
              type: "SET_FILTERS",
              payload: {
                ...state.filters,
                tags: v,
              },
            });
          }}
        />
        <BaseButtonGroup className="">
          <BaseButtonIcon
            size="sm"
            onClick={(e) => {
              filterTags(undefined);
            }}
          >
            <RotateCcwIcon className="size-4"></RotateCcwIcon>
          </BaseButtonIcon>
          <BaseButtonIcon
            size="sm"
            onClick={() => {
              filterTags([]);
            }}
          >
            <XIcon className="size-4"></XIcon>
          </BaseButtonIcon>
        </BaseButtonGroup>
      </div>
      <BaseInput
        size="sm"
        label="内容"
        icon="lucide:search"
        onChange={search}
        labelFloat
      ></BaseInput>
    </div>
  );
};

function NoteItem({
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
