"use client";

import { DEFAULT_COLLECTION, DEFAULT_QUESTION } from "./constants";
import { createEntityContext } from "@/lib/client/createEntity/createEntityContext";

export const {
  EnitityContext,
  EntityDispatchContext,
  EntityContextProvider,
  useEntity,
  useEntityDispatch,
} = createEntityContext<typeof DEFAULT_QUESTION, typeof DEFAULT_COLLECTION>(
  DEFAULT_QUESTION,
  DEFAULT_COLLECTION,
  'qas'
);
