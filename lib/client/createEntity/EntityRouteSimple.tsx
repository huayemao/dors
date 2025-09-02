import {
  RouteObject,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import CollectionLayout from "@/lib/client/createEntity/CollectionLayout";
import CreateCollectionModal from "./CreateCollectionModal";
import CreateEntityModal from "./CreateEntityModal";
import ViewOrEditEntityModal from "@/lib/client/createEntity/ViewOrEditEntityModal";
import { ComponentProps, FC, PropsWithChildren, ReactNode, useCallback } from "react";
import { EntityDispatch, EntityState } from "./createEntityContext";
import { BaseCollection, BaseEntity } from "./types";
import { addActionRoutes } from "@/components/PostEditor/AddAction";
import { fetchWithAuth } from "../utils/fetch";
import { toast } from "react-hot-toast";
import { EntityConfigProvider } from "./EntityConfigProvider";

  const fetchCollection = (id: string) => {
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
  };

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
  slots?: any;
  layout?: "masonry" | "stack" | "table";
  getList?: (list: EType[]) => object[];
  basename: string;
  createForm: FC<PropsWithChildren>;
  updateForm: FC<PropsWithChildren>;
  RootPage?: FC<PropsWithChildren>;
  extraRoutes?: RouteObject[];
  EntityPreviewPage?: FC<{
    state: EntityState<EType, CType>;
    dispatch: EntityDispatch<EType, CType>;
  }>;
  renderEntity: (entity: EType, options: { preview: boolean, stackMode?: boolean }) => React.ReactNode;
  renderEntityModalTitle?: (entity: EType, options?: { preview: boolean }) => React.ReactNode;
  renderEntityModalActions?: (entity: EType, options: { preview: boolean }) => React.ReactNode;
  state: EntityState<EType, CType>;
  dispatch: EntityDispatch<EType, CType>;
};

export default function EntityRouteSimple<
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
  EntityPreviewPage,
  renderEntityModalTitle,
  renderEntityModalActions,
  slots,
  layout,
  getList,
  extraRoutes = [],
}: Props<EType, CType>) {
  const isView = state.entityModalMode == 'view'
  
  // 创建配置对象
  const config = {
    renderEntity,
    renderEntityModalTitle,
    renderEntityModalActions,
    createForm,
    updateForm,
    layout,
    getList,
    slots,
    basename,
    extraRoutes,
    RootPage,
    EntityPreviewPage,
    fetchCollection,
    syncToCloud,
  };

  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: RootPage ? <RootPage /> : <CollectionLayout state={state} dispatch={dispatch} />,
        children: [
          ...addActionRoutes,
          {
            path: ":entityId",
            element: EntityPreviewPage && isView ? (
              <EntityPreviewPage 
                state={state as EntityState<EType, CType>}
                dispatch={dispatch as EntityDispatch<EType, CType>}
              />
            ) : (
              <ViewOrEditEntityModal state={state} dispatch={dispatch} form={createForm} />
            ),
          },
          {
            path: "create",
            element: <CreateEntityModal state={state} dispatch={dispatch} form={updateForm} />,
          },
          {
            path: "edit",
            element: <CreateCollectionModal state={state} dispatch={dispatch} />,
          },
        ],
      },
    ],
    { basename }
  );
  
  return (
    <EntityConfigProvider config={config}>
      <RouterProvider router={router} />
    </EntityConfigProvider>
  );
}
