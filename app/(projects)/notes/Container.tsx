"use client";
import Prose from "@/components/Base/Prose";
import { BaseTag } from "@shuriken-ui/react";
import EntityRoute from "@/lib/client/createEntity/EntityRoute";
import { Note } from "./constants";
import { useEntity, useEntityDispatch } from "./contexts";
import { NoteForm } from "./NoteForm";
import NotesPage from "./page";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { ClientOnly } from "@/components/ClientOnly";
import localforage from "localforage";

export const Container = () => {
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
            alert("Storage will not be cleared except by explicit user action");
          } else {
            alert("Storage may be cleared by the UA under storage pressure.");
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
                    // onClick={() => {
                    //   dispatch({
                    //     type: "setTags",
                    //     payload: Array.from(new Set(filters.tags.concat(e))),
                    //   });
                    // }}
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
        renderEntity={(e: Note, { preview }) => (
          <div className={cn({ "min ": !preview })}>
            {preview && (
              <div className="-mb-3 min-w-64 flex-nowrap  items-start overflow-x-auto">
                {e.tags?.map((e) => (
                  <div key={e} className="cursor-pointer flex-shrink-0">
                    <BaseTag
                      // onClick={() => {
                      //   dispatch({
                      //     type: "setTags",
                      //     payload: Array.from(new Set(filters.tags.concat(e))),
                      //   });
                      // }}
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
            <Prose key={e.id} preview={preview} content={e.content}></Prose>
          </div>
        )}
        state={state}
        dispatch={dispatch}
        RootPage={NotesPage}
        basename={"/notes"}
        createForm={NoteForm}
        updateForm={NoteForm}
      ></EntityRoute>
    </main>
  );
};
