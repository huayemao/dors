"use client";
import { useContext, useEffect } from "react";
import { CategoriesContext } from "@/contexts/categories";
import { ClientOnly } from "@/components/ClientOnly";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { addActionRoutes } from "@/components/PostEditor/AddAction";
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
import { Category } from "@/components/Category";
import pick from "lodash/pick";

function Categories() {
  return (
    <ClientOnly>
      <EntityContextProvider>
        <Content></Content>
      </EntityContextProvider>
    </ClientOnly>
  );
}

function getList(list): any[] {
  return list.map((e) => {
    const obj = {
      ...pick(e, ["id", "name", "desciption"]),
      ...(e as any).meta,
    };
    return obj;
  });
}

function Content() {
  const basename = "/admin/categories";
  const createForm = CategoryForm;
  const updateForm = CategoryForm;
  const state = useEntity();
  const dispatch = useEntityDispatch();
  const renderEntityModalTitle = (e: Cat) => e.id;
  const renderEntity = (cat: Cat) => <Category
    href={`/categories/${cat.id}`}
    name={cat.name as string}
    key={cat.id}
    iconName={(cat.meta as { icon: string }).icon}
  />;
  // renderEntityModalActions={(e: Note) => <Actions e={e}></Actions>}
  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: (
          <ListLayout
          getList={getList}
            state={state}
            dispatch={dispatch}
          ></ListLayout>
        ),
        children: [
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
        ]
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


export default Categories;
