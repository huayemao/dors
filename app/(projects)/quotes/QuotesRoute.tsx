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
  useState,
} from "react";
import localforage from "localforage";
import toast from "react-hot-toast";
import QuotePreview from "./QuotePreview";
import { QuotesContextProvider } from "./context";
import QuotesPage from "./page";
import { Quote } from "./constants";
import { QuoteForm } from "./QuoteForm";
import { usePersistenceAlert } from "@/lib/client/hooks/usePersistenceAlert";
import { Dialog } from '@headlessui/react';
import { useCloseModal } from "@/lib/client/hooks/useCloseModal";
import { motion, AnimatePresence } from 'framer-motion';
import { BaseCollection, BaseEntity } from "@/lib/client/createEntity/types";
import { EntityDispatch, EntityState } from "@/lib/client/createEntity/createEntityContext";
import { useParams } from "react-router-dom";
import { BaseButtonClose } from "@shuriken-ui/react";
import { PreviewModal } from "@/components/Base/PreviewModal";

const DialogQuotePreview = <
  EType extends BaseEntity,
  CType extends BaseCollection
>({
  state,
  dispatch,
}: {
  state: EntityState<EType, CType>;
  dispatch: EntityDispatch<EType, CType>;
}) => {
  const onClose = useCloseModal()
  const { entityId } = useParams();
  const entity = state.entityList.find((e) => String(e.id) == entityId);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!entity) {
      return;
    }
    dispatch({
      type: "ANY",
      payload: {
        currentEntity: entity,
      },
    });
    setLoading(false);
  }, [dispatch, entity]);

  return (
    <PreviewModal open onClose={onClose} loading={loading}>
      <QuotePreview />
    </PreviewModal>
  );
};

export const QuotesRoute = ({
  basename = '/quotes',
}: {
  basename?: string;
}) => {
  const state = useEntity();
  const dispatch = useEntityDispatch();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  usePersistenceAlert();

  const handlePreview = useCallback((quote: Quote) => {
    dispatch({ type: 'SET_CURRENT_ENTITY', payload: quote });
    setIsPreviewOpen(true);
  }, [dispatch]);

  return (
    <>
      <EntityRoute
        key="quotes"
        renderEntityModalTitle={(e: Quote) => <>e.id</>}
        layout="table"
        renderEntity={(e: Quote, { preview }) => (
          <button onClick={() => handlePreview(e)}>预览</button>
        )}
        state={state}
        dispatch={dispatch}
        RootPage={QuotesPage}
        basename={basename}
        createForm={QuoteForm}
        updateForm={QuoteForm}
        EntityPreviewPage={DialogQuotePreview}
      />

    </>
  );
};


