"use client";
import Prose from "@/components/Base/Prose";
import {
  BaseButton,
  BaseButtonGroup,
  BaseButtonIcon,
  BaseInput,
  BaseListbox,
  BaseTag,
} from "@shuriken-ui/react";
import EntityRoute from "@/lib/client/createEntity/EntityRoute";
import { Note } from "../app/(projects)/notes/constants";
import { useEntity, useEntityDispatch } from "../contexts/notes";
import { NoteForm } from "../app/(projects)/notes/NoteForm";
import NotesPage from "../app/(projects)/notes/page";
import { cn } from "@/lib/utils";
import { FC, useCallback, useEffect } from "react";
import localforage from "localforage";
import toast from "react-hot-toast";
import { EntityDispatch } from "@/lib/client/createEntity/createEntityContext";
import { useDebounce } from "@uidotdev/usehooks";
import { XIcon } from "lucide-react";

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

  return (
    <main>
      <EntityRoute
        key="notes"
        renderEntityModalTitle={(e: Note) => (
          <>
            <span className="flex mb-2 gap-2 flex-nowrap  items-start overflow-x-auto py-1 leading-normal">
              {e.tags?.map((e) => (
                <div key={e} className="cursor-pointer flex-shrink-0">
                  <BaseTag key={e} size="sm" variant="outline" color="primary">
                    {e}
                  </BaseTag>
                </div>
              ))}
            </span>
            {
              <time className="text-xs text-slate-600">
                {new Date(e.id).toLocaleDateString()}
              </time>
            }
          </>
        )}
        renderEntity={(e: Note, { preview }) => (
          <NoteItem
            key={e.content + e.id}
            data={e}
            preview={preview}
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
        <BaseButtonGroup className="flex-1">
          <BaseButton
            size="sm"
            onClick={() => {
              dispatch({
                type: "SET_FILTERS",
                payload: {
                  ...state.filters,
                  tags: allTags,
                },
              });
            }}
          >
            全部
          </BaseButton>
          <BaseButtonIcon
            size="sm"
            onClick={() => {
              dispatch({
                type: "SET_FILTERS",
                payload: {
                  ...state.filters,
                  tags: [],
                },
              });
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

function NoteItem({ preview = false, data }: { preview?; data: Note }) {
  return (
    <div className={cn({ "min-w-64": !preview })}>
      {preview && (
        <div className="-mb-3 flex gap-2 flex-nowrap  items-start overflow-x-auto">
          {data.tags?.map((e) => (
            <div key={e} className="cursor-pointer flex-shrink-0">
              <BaseTag key={e} size="sm" variant="outline" color="primary">
                {e}
              </BaseTag>
            </div>
          ))}
        </div>
      )}
      <Prose
        key={data.id + data.content}
        preview={preview}
        content={data.content}
      ></Prose>
    </div>
  );
}
