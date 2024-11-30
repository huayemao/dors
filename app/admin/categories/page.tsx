"use client";
import Link from "next/link";
import { useContext, useEffect } from "react";
import { CategoriesContext } from "@/contexts/categories";
import { ClientOnly } from "@/components/ClientOnly";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { addActionRoutes } from "@/components/PostEditor/AddAction";
import CreateCollectionModal from "@/lib/client/createEntity/CreateCollectionModal";
import ViewOrEditEntityModal from "@/lib/client/createEntity/ViewOrEditEntityModal";
import CreateEntityModal from "@/lib/client/createEntity/CreateEntityModal";
import ListLayout from "@/lib/client/createEntity/ListLayout";
import { CategoryForm } from "./CategoryForm";
import {
  Cat,
  EntityContextProvider,
  useEntity,
  useEntityDispatch,
} from "./context";

function Categories() {
  return (
    <ClientOnly>
      <EntityContextProvider>
        <Content></Content>
      </EntityContextProvider>
    </ClientOnly>
  );
}

const IndexPage = () => <>111</>;

function Content() {
  const basename = "/admin/categories";
  const createForm = CategoryForm;
  const updateForm = CategoryForm;
  const state = useEntity();
  const dispatch = useEntityDispatch();
  const renderEntityModalTitle = (e: Cat) => e.name;
  const renderEntity = (e: Cat) => e.name;
  // renderEntityModalActions={(e: Note) => <Actions e={e}></Actions>}
  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: (
          <ListLayout
            state={state}
            dispatch={dispatch}
            renderEntity={renderEntity}
          ></ListLayout>
        ),
      },
      ...addActionRoutes,
      {
        path: ":entityId",
        element: (
          <ViewOrEditEntityModal
            renderEntityModalTitle={renderEntityModalTitle}
            // renderEntityModalActions={renderEntityModalActions}
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
    { basename }
  );

  const cats = useContext(CategoriesContext);
  // todo: 这个没有默认 list

  useEffect(() => {
    dispatch({
      type: "SET_ENTITY_LIST",
      payload: cats as Cat[],
    });
  }, [dispatch, cats]);

  return (
    <main className="p-6">
      <RouterProvider router={router} />
    </main>
  );
}

export type Props = {
  isEditing: boolean;
  id: number;
  tags: {
    id: number;
    name: string | null;
  }[];
};

export default Categories;
