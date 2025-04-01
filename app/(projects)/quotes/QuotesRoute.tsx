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
    <Dialog as={motion.div} open className="relative z-50" onClose={onClose}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black bg-opacity-25"
      />

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Dialog.Panel className="w-full max-w-7xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl">
              <div className="mt-2">
                {loading ? (
                  <div className="flex justify-center items-center w-full h-32">
                    加载中...
                  </div>
                ) : (
                  <QuotePreview />
                )}
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  onClick={onClose}
                >
                  关闭
                </button>
              </div>
            </Dialog.Panel>
          </motion.div>
        </div>
      </div>
    </Dialog>
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
        renderEntityModalTitle={(e: Quote) => e.id}
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


