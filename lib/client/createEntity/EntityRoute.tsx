import {
  RouteObject,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import CollectionLayout from "@/lib/client/createEntity/CollectionLayout";
import CreateCollectionModal from "./CreateCollectionModal";
import CreateEntityModal from "./CreateEntityModal";
import ViewOrEditEntityModal from "@/lib/client/createEntity/ViewOrEditEntityModal";
import { ComponentProps, FC, PropsWithChildren, useCallback } from "react";
import { EntityDispatch, EntityState } from "./createEntityContext";
import { BaseCollection, BaseEntity } from "./types";
import localforage from "localforage";
import { addActionRoutes } from "@/components/PostEditor/AddAction";
import { fetchWithAuth } from "../utils/fetch";
import { toast } from "react-hot-toast";




const syncToCloud = (
  collection: EntityState<any, any>['currentCollection'],
  entityList: EntityState<any, any>['entityList']
) => {
  if (!collection.id) return Promise.reject("No collection id");

  const fd = new FormData();
  fd.append("id", collection.id + "");
  fd.append("content", JSON.stringify(entityList));
  fd.append(
    "meta",
    JSON.stringify({
      layout: collection.layout || "masonry",
    })
  );
  

  return fetchWithAuth("/api/updatePost", {
    method: "POST",
    headers: { accept: "application/json" },
    body: fd,
  })
    .then((res) => res.json())
    .then((json) => json.data)
};

type Props<EType extends BaseEntity, CType extends BaseCollection> = {
  slots?: ComponentProps<typeof CollectionLayout>["slots"];
  layout?: ComponentProps<typeof CollectionLayout>["layout"];
  basename: string;
  createForm: FC<PropsWithChildren>;
  updateForm: FC<PropsWithChildren>;
  RootPage: FC<PropsWithChildren>;
  extraRoutes?: RouteObject[];
  EntityPreviewPage?: FC<{
    state: EntityState<EType, CType>;
    dispatch: EntityDispatch<EType, CType>;
  }>;
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
  layout,
  extraRoutes = [],
  EntityPreviewPage,
}: Props<EType, CType>) {
  const isView = state.entityModalMode == "view";

  const fetchCollection = useCallback((id: string) => {
    return fetchWithAuth("/api/getPost?id=" + id)
      .then((e) => e.json())
      .then((obj) => {
        const res = {
          ...obj,
          id: obj.id,
          name: obj.title,
          online: true,
          _entityList: JSON.parse(obj.content),
          layout: obj.meta?.layout || "masonry",
        };
        return res;
      });
  },[]);

  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: <RootPage />,
      },
      {
        path: "/create",
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
            fetchCollection={fetchCollection}
            syncToCloud={syncToCloud}
            slots={slots}
            layout={layout}
            state={state}
            dispatch={dispatch}
            renderEntity={renderEntity}
          ></CollectionLayout>
        ),
        children: [
          ...addActionRoutes,
          {
            path: ":entityId",
            element:
              EntityPreviewPage && isView ? (
                <EntityPreviewPage
                  state={state as EntityState<EType, CType>}
                  dispatch={dispatch as EntityDispatch<EType, CType>}
                />
              ) : (
                <ViewOrEditEntityModal
                  renderEntityModalTitle={renderEntityModalTitle}
                  renderEntityModalActions={renderEntityModalActions}
                  renderEntity={renderEntity}
                  state={state}
                  dispatch={dispatch}
                  form={createForm}
                ></ViewOrEditEntityModal>
              ),
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
