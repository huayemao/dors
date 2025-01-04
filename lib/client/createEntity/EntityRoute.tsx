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

type Props<EType extends BaseEntity, CType extends BaseCollection> = {
  slots?: ComponentProps<typeof CollectionLayout>["slots"];
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
            slots={slots}
            state={state}
            dispatch={dispatch}
            renderEntity={renderEntity}
          ></CollectionLayout>
        ),
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
        ...extraRoutes,
      },
    ],
    { basename }
  );
  return <RouterProvider router={router} />;
}
