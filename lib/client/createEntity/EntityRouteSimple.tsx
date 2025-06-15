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
  slots?: ComponentProps<typeof CollectionLayout>["slots"];
  layout?: ComponentProps<typeof CollectionLayout>["layout"];
  getList?: ComponentProps<typeof CollectionLayout>["getList"];
  basename: string;
  createForm: FC<PropsWithChildren>;
  updateForm: FC<PropsWithChildren>;
  RootPage?: FC<PropsWithChildren>;
  extraRoutes?: RouteObject[];
  EntityPreviewPage?: FC
} & Omit<ComponentProps<typeof ViewOrEditEntityModal>, "form">;

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
}: Props<EType, CType>) {
  const isView = state.entityModalMode == 'view'
  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: RootPage ? <RootPage /> : <CollectionLayout
          fetchCollection={fetchCollection}
          syncToCloud={syncToCloud}
          slots={slots}
          layout={layout}
          state={state}
          dispatch={dispatch}
          renderEntity={renderEntity}
          getList={getList}
        ></CollectionLayout>,
        children: [
          ...addActionRoutes,
          {
            path: ":entityId",
            element: EntityPreviewPage && isView ? <EntityPreviewPage /> : (
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
      },
    ],
    { basename }
  );
  return <RouterProvider router={router} />;
}
