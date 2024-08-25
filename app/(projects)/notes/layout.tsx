"use client";

import dynamic from "next/dynamic";
import {
  EntityContextProvider,
  useEntity,
  useEntityDispatch,
} from "./contexts";
import { QAForm } from "./QAForm";
import NotesPage from "./page";

const Route = dynamic(() => import("@/lib/client/createEntity/Route"), {
  ssr: false,
});

const Container = () => {
  const state = useEntity();
  const dispatch = useEntityDispatch();

  return (
    <Route
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
      <Container></Container>
    </EntityContextProvider>
  );
}
