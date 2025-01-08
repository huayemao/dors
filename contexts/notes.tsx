"use client";

import { HIDDEN_TAGS } from "@/components/Notes/constants";
import {
  DEFAULT_COLLECTION,
  DEFAULT_NOTE,
  Note,
} from "../app/(projects)/notes/constants";
import { createEntityContext } from "@/lib/client/createEntity/createEntityContext";

export const {
  EntityContext: NotesContext,
  EntityDispatchContext: NotesDispatchContext,
  EntityContextProvider: NotesContextProvider,
  useEntity,
  useEntityDispatch,
} = createEntityContext<Note, typeof DEFAULT_COLLECTION>({
  defaultEntity: DEFAULT_NOTE,
  defaultCollection: DEFAULT_COLLECTION,
  defaultFilterConfig: {},
  defaultFilters: {
    tags: {
      omit: HIDDEN_TAGS,
    },
  },
  key: "notes",
});
