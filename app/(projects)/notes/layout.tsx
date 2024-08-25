"use client";

import dynamic from "next/dynamic";
import {
  EntityContextProvider,
  useEntity,
  useEntityDispatch,
} from "./contexts";
import { QAForm } from "./QAForm";
import NotesPage from "./page";
import Route from "@/lib/client/createEntity/Route";
import { ClientOnly } from "@/components/ClientOnly";
import Prose from "@/components/Base/Prose";
import { DEFAULT_QUESTION } from "./constants";

const Container = () => {
  const state = useEntity();
  const dispatch = useEntityDispatch();

  return (
    <Route
      renderEntity={(el) => (
        <Prose content={(el as typeof DEFAULT_QUESTION).content}></Prose>
      )}
      state={state}
      dispatch={dispatch}
      RootPage={NotesPage}
      basename={"/notes"}
      createForm={QAForm}
      updateForm={QAForm}
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
