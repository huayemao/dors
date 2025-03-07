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
import { addActionRoutes } from "@/components/PostEditor/AddAction";
import { fetchWithAuth } from "../utils/fetch";

const fetchCollection = (id: string) =>
  fetchWithAuth("/api/getPost?id=" + id)
    .then((e) => e.json())
    .then((obj) => ({
      ...obj,
      id: obj.id,
      name: obj.title,
      online: true,
      _entityList: JSON.parse(obj.content),
    }));

type Props<EType extends BaseEntity, CType extends BaseCollection> = {
  slots?: ComponentProps<typeof CollectionLayout>["slots"];
  layout?: ComponentProps<typeof CollectionLayout>["layout"];
  getList?: ComponentProps<typeof CollectionLayout>["getList"];
  basename: string;
  createForm: FC<PropsWithChildren>;
  updateForm: FC<PropsWithChildren>;
  RootPage?: FC<PropsWithChildren>;
  extraRoutes?: RouteObject[];
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
  renderEntityModalTitle,
  renderEntityModalActions,
  slots,
  layout,
  getList,
}: Props<EType, CType>) {
  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: RootPage ? <RootPage /> : <CollectionLayout
          fetchCollection={fetchCollection}
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
