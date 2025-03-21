"use client";
import EntityRoute from "@/lib/client/createEntity/EntityRoute";
import { useEntity, useEntityDispatch } from "./context";
import { NoteForm } from "@/app/(projects)/notes/NoteForm";
import {
  ComponentProps,
  FC,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import localforage from "localforage";
import toast from "react-hot-toast";
import QuotePreview from "./QuotePreview";
import { QuotesContextProvider } from "./context";
import QuotesPage from "./page";
import { Quote } from "./constants";
import { QuoteForm } from "./QuoteForm";
import { usePersistenceAlert } from "@/lib/client/hooks/usePersistenceAlert";



export const QuotesRoute = ({
  basename = '/quotes',
}: {
  basename?: string;
}) => {
  const state = useEntity();
  const dispatch = useEntityDispatch();
  
  usePersistenceAlert();

  return (
    <EntityRoute
      key="quotes"
      renderEntityModalTitle={(e: Quote) => e.id}
      layout="table"
      renderEntity={(e: Quote, { preview }) => (
        <>sdfsdf</>
      )
      }
      EntityPreviewPage={QuotePreview}
      state={state}
      dispatch={dispatch}
      RootPage={QuotesPage}
      basename={basename}
      createForm={QuoteForm}
      updateForm={QuoteForm}
    ></EntityRoute>
  );
};


