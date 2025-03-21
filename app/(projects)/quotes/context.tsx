"use client";

import {
  DEFAULT_COLLECTION,
} from "./constants";
import { createEntityContext } from "@/lib/client/createEntity/createEntityContext";
import { DEFAULT_QUOTE, Quote } from "./constants";

export const {
  EntityContext: QuotesContext,
  EntityDispatchContext: QuotesDispatchContext,
  EntityContextProvider: QuotesContextProvider,
  useEntity,
  useEntityDispatch,
} = createEntityContext<Quote, typeof DEFAULT_COLLECTION>({
  defaultEntity: DEFAULT_QUOTE,
  defaultCollection: DEFAULT_COLLECTION,
  defaultFilterConfig: {},
  key: "quotes",
});
