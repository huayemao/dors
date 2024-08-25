"use client";
import {
  EntityContextProvider,
  useEntity,
  useEntityDispatch,
} from "./contexts";
import { NoteForm } from "./NoteForm";
import NotesPage from "./page";
import Route from "@/lib/client/createEntity/Route";
import { ClientOnly } from "@/components/ClientOnly";
import Prose from "@/components/Base/Prose";
import { Note } from "./constants";
import { BaseTag } from "@shuriken-ui/react";

const Container = () => {
  const state = useEntity();
  const dispatch = useEntityDispatch();

  return (
    <Route
      renderEntity={(e: Note) => (
        <div>
          <div className="flex gap-2 flex-nowrap  items-start overflow-x-auto py-1">
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
          <Prose content={e.content}></Prose>
        </div>
      )}
      state={state}
      dispatch={dispatch}
      RootPage={NotesPage}
      basename={"/notes"}
      createForm={NoteForm}
      updateForm={NoteForm}
    ></Route>
  );
};

export default function QAsLayout({}) {
  return (
    <EntityContextProvider>
      <ClientOnly>
        <Container></Container>
      </ClientOnly>
    </EntityContextProvider>
  );
}
