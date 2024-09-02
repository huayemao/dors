"use client";
import Prose from "@/components/Base/Prose";
import { BaseTag } from "@shuriken-ui/react";
import EntityRoute from "@/lib/client/createEntity/EntityRoute";
import { Note } from "../app/(projects)/notes/constants";
import { useEntity, useEntityDispatch } from "../contexts/notes";
import { NoteForm } from "../app/(projects)/notes/NoteForm";
import NotesPage from "../app/(projects)/notes/page";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import localforage from "localforage";
import toast from "react-hot-toast";

export const NotesContainer = ({ basename = '/notes' }: { basename?: string }) => {
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
                  <BaseTag
                    key={e}
                    size="sm"
                    variant="outline"
                    color="primary"
                  >
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
        renderEntity={(e: Note, { preview }) => <NoteItem data={e} preview={preview}></NoteItem>}
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

function NoteItem({ preview = false, data }: { preview?, data: Note }) {
  return (
    <div className={cn({ "min-w-64": !preview })}>
      {preview && (
        <div className="-mb-3 flex gap-2 flex-nowrap  items-start overflow-x-auto">
          {data.tags?.map((e) => (
            <div key={e} className="cursor-pointer flex-shrink-0">
              <BaseTag
                key={e}
                size="sm"
                variant="outline"
                color="primary"
              >
                {e}
              </BaseTag>
            </div>
          ))}
        </div>
      )}
      <Prose key={data.id} preview={preview} content={data.content}></Prose>
    </div>
  );
}
