"use client";
import { useContext, useEffect } from "react";
import { CategoriesContext } from "@/contexts/categories";
import { ClientOnly } from "@/components/ClientOnly";
import { CategoryForm } from "./CategoryForm";
import {
  Cat,
  EntityContextProvider,
  useEntity,
  useEntityDispatch,
} from "./context";
import { Category } from "@/components/Category";
import pick from "lodash/pick";
import EntityRouteSimple from "@/lib/client/createEntity/EntityRouteSimple";

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
  const state = useEntity();
  const dispatch = useEntityDispatch();
  const renderEntityModalTitle = (e: Cat) => e.id;
  const renderEntity = (cat: Cat) => <Category
    href={`/categories/${cat.id}`}
    name={cat.name as string}
    key={cat.id}
    iconName={(cat.meta as { icon: string }).icon}
  />;

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
      <EntityRouteSimple
        key="categories"
        renderEntityModalTitle={renderEntityModalTitle}
        renderEntity={renderEntity}
        state={state}
        dispatch={dispatch}
        layout="table"
        getList={getList}
        basename={basename}
        createForm={CategoryForm}
        updateForm={CategoryForm}
      ></EntityRouteSimple>
    </main>
  );
}


export default Categories;
