import { RouterProvider, createBrowserRouter } from "react-router-dom";
import CollectionLayout from "@/lib/client/createEntity/Collection";
import CreateCollectionModal from "./CreateCollectionModal";
import CreateEntityModal from "./CreateEntityModal";
import ViewOrEditEntityModal from "@/lib/client/createEntity/ViewOrEditEntityModal";
import { FC, PropsWithChildren, ReactNode } from "react";
import {
  BaseEntity,
  createEntityContext,
  EntityDispatch,
  EntityState,
} from "./createEntityContext";
import localforage from "localforage";

async function EntityLoader({ params }) {
  const { entityId, collectionId } = params;
  const entityList = await localforage.getItem(collectionId);
  const entity = (entityList as BaseEntity[]).find(
    (e) => String(e.id) == entityId
  );
  return {
    entity,
  };
}

export default function EntityRoute({
  state,
  dispatch,
  basename,
  createForm,
  updateForm,
  RootPage,
  renderEntity,
  renderEntityModalTitle,
}: {
  renderEntity: (
    entity: BaseEntity,
    options: { preview: boolean }
  ) => ReactNode;
  renderEntityModalTitle?: (
    entity: BaseEntity,
    options: { preview: boolean }
  ) => ReactNode;
  basename: string;
  createForm: FC<PropsWithChildren>;
  updateForm: FC<PropsWithChildren>;
  RootPage: FC<PropsWithChildren>;
  state: EntityState;
  dispatch: EntityDispatch;
}) {
  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: <RootPage />,
      },
      {
        path: "create",
        element: (
          <CreateCollectionModal
            state={state}
            dispatch={dispatch}
          ></CreateCollectionModal>
        ),
      },
      {
        path: ":collectionId",
        element: (
          <CollectionLayout
            state={state}
            dispatch={dispatch}
            renderEntity={renderEntity}
          ></CollectionLayout>
        ),
        children: [
          {
            path: ":entityId",
            element: (
              <ViewOrEditEntityModal
                renderEntityModalTitle={renderEntityModalTitle}
                renderEntity={renderEntity}
                state={state}
                dispatch={dispatch}
                form={createForm}
              ></ViewOrEditEntityModal>
            ),
            loader: EntityLoader,
          },
          {
            path: "create",
            element: (
              <CreateEntityModal
                state={state}
                dispatch={dispatch}
                form={updateForm}
              ></CreateEntityModal>
            ),
          },
          {
            path: "edit",
            element: (
              <CreateCollectionModal
                state={state}
                dispatch={dispatch}
              ></CreateCollectionModal>
            ),
          },
        ],
      },
    ],
    { basename }
  );
  return <RouterProvider router={router} />;
}
