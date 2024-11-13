import {
  RouteObject,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import CollectionLayout from "@/lib/client/createEntity/CollectionLayout";
import CreateCollectionModal from "./CreateCollectionModal";
import CreateEntityModal from "./CreateEntityModal";
import ViewOrEditEntityModal from "@/lib/client/createEntity/ViewOrEditEntityModal";
import {
  ComponentProps,
  FC,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import {
  BaseCollection,
  BaseEntity,
  createEntityContext,
  EntityDispatch,
  EntityState,
} from "./createEntityContext";
import localforage from "localforage";
import { ClientOnly } from "@/components/ClientOnly";
import { addActionRoutes } from "@/components/PostEditor/AddAction";
import { fetchWithAuth } from "../utils/fetch";

type Props<EType extends BaseEntity, CType extends BaseCollection> = {
  slots?: Record<
    "head",
    FC<{
      state: EntityState<EType, CType>;
      dispatch: EntityDispatch<EType, CType>;
    }>
  >;
  basename: string;
  createForm: FC<PropsWithChildren>;
  updateForm: FC<PropsWithChildren>;
  RootPage: FC<PropsWithChildren>;
  extraRoutes?: RouteObject[];
} & Omit<ComponentProps<typeof ViewOrEditEntityModal>, "form">;

export default function EntityRoute<
  EType extends BaseEntity,
  CType extends BaseCollection
>({
  state,
  dispatch,
  basename,
  createForm,
  updateForm,
  RootPage,
  renderEntity,
  renderEntityModalTitle,
  renderEntityModalActions,
  slots,
  extraRoutes = [],
}: Props<EType, CType>) {
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
          const res: BaseCollection & { content: string } = await fetchWithAuth(
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
              slots={slots}
              state={state}
              dispatch={dispatch}
              renderEntity={renderEntity}
            ></CollectionLayout>
          </ClientOnly>
        ),
        loader: collectionLoader,
        children: [
          ...addActionRoutes,
          {
            path: ":entityId",
            element: (
              <ViewOrEditEntityModal
                renderEntityModalTitle={renderEntityModalTitle}
                renderEntityModalActions={renderEntityModalActions}
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
        ...extraRoutes,
      },
    ],
    { basename }
  );
  return <RouterProvider router={router} />;
}
