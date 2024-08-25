"use client";

import { DEFAULT_COLLECTION, DEFAULT_NOTE } from "./constants";
import { createEntityContext } from "@/lib/client/createEntity/createEntityContext";

export const {
  EnitityContext,
  EntityDispatchContext,
  EntityContextProvider,
  useEntity,
  useEntityDispatch,
} = createEntityContext<typeof DEFAULT_NOTE, typeof DEFAULT_COLLECTION>(
  DEFAULT_NOTE,
  DEFAULT_COLLECTION,
  'notes'
);
