"use client";

import { DEFAULT_COLLECTION, DEFAULT_NOTE } from "../app/(projects)/notes/constants";
import { createEntityContext } from "@/lib/client/createEntity/createEntityContext";

export const {
  EntityContext: NotesContext,
  EntityDispatchContext: NotesDispatchContext,
  EntityContextProvider: NotesContextProvider,
  useEntity,
  useEntityDispatch,
} = createEntityContext<typeof DEFAULT_NOTE, typeof DEFAULT_COLLECTION>(
  DEFAULT_NOTE,
  DEFAULT_COLLECTION,
  'notes'
);
