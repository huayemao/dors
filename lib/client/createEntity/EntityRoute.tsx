import { RouterProvider, createBrowserRouter } from "react-router-dom";
import CollectionLayout from "@/lib/client/createEntity/Collection";
import CreateCollectionModal from "./CreateCollectionModal";
import CreateEntityModal from "./CreateEntityModal";
import ViewOrEditEntityModal from "@/lib/client/createEntity/ViewOrEditEntityModal";
import { FC, PropsWithChildren, ReactNode, useCallback, useMemo } from "react";
import {
  BaseCollection,
  BaseEntity,
  createEntityContext,
  EntityDispatch,
  EntityState,
} from "./createEntityContext";
import localforage from "localforage";
import { ClientOnly } from "@/components/ClientOnly";

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
  const entityLoader = useCallback(async ({ params }) => {
    const { entityId, collectionId } = params;
    const entityList = await localforage.getItem(collectionId);
    const entity = (entityList as BaseEntity[]).find(
      (e) => String(e.id) == entityId
    );
    return {
      entity,
    };
  }, []);

  const collectionLoader = useCallback(
    async ({ params }) => {
      const collectionList: BaseCollection[] = state.collectionList;

      if (!state.collectionList.length) {
        return { collection: null };
      }

      if (!params.collectionId) {
        return { collection: null };
      }
      let collection =
        collectionList.find((e) => e.id == params.collectionId) || null;
      if (!collection) {
        try {
          const res: BaseCollection & { content: string } = await fetch(
            "/api/getPost?id=" + params.collectionId
          )
            .then((e) => e.json())
            .then((obj) => {
              return {
                ...obj,
                id: obj.id,
                name: obj.title,
                online: true,
                _entityList: JSON.parse(obj.content),
              };
            });

          collection = res;
        } catch (error) {
          console.error("从网络获取数据失败：" + error);
          collection = null;
        }
      }
      return { collection };
    },
    [state.collectionList, state.currentCollection]
  );

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
          <ClientOnly>
            <CollectionLayout
              state={state}
              dispatch={dispatch}
              renderEntity={renderEntity}
            ></CollectionLayout>
          </ClientOnly>
        ),
        loader: collectionLoader,
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
            loader: entityLoader,
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
