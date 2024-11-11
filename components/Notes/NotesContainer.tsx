"use client";
import EntityRoute from "@/lib/client/createEntity/EntityRoute";
import { Note } from "@/app/(projects)/notes/constants";
import { useEntity, useEntityDispatch } from "@/contexts/notes";
import { NoteForm } from "@/app/(projects)/notes/NoteForm";
import NotesPage from "@/app/(projects)/notes/page";
import { FC, Fragment, useCallback, useEffect, useMemo } from "react";
import localforage from "localforage";
import toast from "react-hot-toast";
import { NoteItem } from "./NoteItem";
import { Filters } from "./Filters";
import { NoteModalTitle } from "./NoteModalTitle";
import { BaseDropdownItem } from "@shuriken-ui/react";
import { Copy } from "lucide-react";
import { copyToClipboard } from "@/lib/client/utils/copyToClipboard";
import { copyTextToClipboard } from "@/lib/utils";

export const HIDDEN_TAGS = ["归档", "archive"];

const getActions = (e: Note) => {
  return {
    copy: {
      title: "复制内容",
      onClick: () => {
        console.log(e.content);
        copyTextToClipboard(e.content).then(() => {
          toast("复制成功");
        });
      },
      start: <Copy className="h-4 w-4" />,
    },
  };
};

export const NotesContainer = ({
  basename = "/notes",
}: {
  basename?: string;
}) => {
  const state = useEntity();
  const dispatch = useEntityDispatch();

  const filterTags = useCallback(
    (v: string[] | undefined) => {
      const hasHiddenTags = v?.some((e) => HIDDEN_TAGS.includes(e));
      const excludeIds = getExcludeIds(hasHiddenTags, state.entityList);

      dispatch({
        type: "SET_FILTERS",
        payload: {
          ...state.filters,
          // 排除了 归档标签还不够，因为它还会有其他标签
          excludeIds: excludeIds,
          tags: v,
        },
      });
    },
    [dispatch, state.filters]
  );

  useEffect(() => {
    const hasHiddenTags = state.filters.tags?.some((e) =>
      HIDDEN_TAGS.includes(e)
    );
    const ids = getExcludeIds(hasHiddenTags, state.entityList);
    if (state.filters.excludeIds?.length != ids?.length)
      dispatch({
        type: "SET_FILTERS",
        payload: {
          ...state.filters,
          excludeIds: ids,
        },
      });
  }, [state.entityList, state.filters.tags]);

  useEffect(() => {
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().then((persistent) => {
        localforage.getItem("alerted").then((v) => {
          if (v) {
            return;
          }
          if (persistent) {
          } else {
            toast("注意：本地存储可能被 UA 清除");
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
          <NoteModalTitle note={e} filterTags={filterTags} />
        )}
        renderEntityModalActions={(e: Note) => {
          const { copy } = getActions(e);

          return (
            <>
              <BaseDropdownItem
                rounded="md"
                data-nui-tooltip={copy.title}
                {...copy}
              ></BaseDropdownItem>
            </>
          );
        }}
        renderEntity={(e: Note, { preview }) => (
          <NoteItem
            actions={getActions(e)}
            key={e.id + e.content}
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

export function getExcludeIds(
  hasHiddenTags: boolean | undefined,
  entityList: {
    seq: string;
    id: number;
    content: string;
    tags: string[];
  }[]
) {
  return hasHiddenTags
    ? undefined
    : entityList
        .filter((e) => e.tags.some((t) => HIDDEN_TAGS.includes(t)))
        .map((e) => e.id);
}
