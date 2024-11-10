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
