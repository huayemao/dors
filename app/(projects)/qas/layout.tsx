"use client";

import dynamic from "next/dynamic";
import {
  EntityContextProvider,
  useEntity,
  useEntityDispatch,
} from "./contexts";
import { QAForm } from "./QAForm";
import QAsPage from "./page";
import Route from "@/lib/client/createEntity/Route";
import { ClientOnly } from "@/components/ClientOnly";
import { DEFAULT_QUESTION } from "./constants";
import QA from "@/components/QA";

const Container = () => {
  const state = useEntity();
  const dispatch = useEntityDispatch();

  return (
    <Route
      renderEntity={(el, { preview }) => (
        <QA preview={preview} data={el as typeof DEFAULT_QUESTION}></QA>
      )}
      state={state}
      dispatch={dispatch}
      RootPage={QAsPage}
      basename={"/qas"}
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
