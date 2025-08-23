"use client";
import { BaseAutocomplete } from "@/components/Base/Autocomplete";
import { getNavResourceItems } from "@/lib/getNavResourceItems";
import { NavigationItem } from "@/lib/types/NavItem";
import { type Prisma } from "@prisma/client";
import {
  BaseButton,
  BaseDropdown,
  BaseDropdownItem,
  BaseInput,
  BaseList,
  BaseListItem,
} from "@glint-ui/react";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { EntityContextProvider, useEntity, useEntityDispatch } from "./context";
import ViewOrEditEntityModal from "@/lib/client/createEntity/ViewOrEditEntityModal";
import CreateEntityModal from "@/lib/client/createEntity/CreateEntityModal";
import { ClientOnly } from "@/components/ClientOnly";
import { Application } from "@/components/Application";
import EntityRouteSimple from "@/lib/client/createEntity/EntityRouteSimple";
import { basename } from "path";
import { CategoryForm } from "../categories/CategoryForm";

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // 转换为32位整数
  }
  return hash;
}

console.log(simpleHash("Hello, world!")); // 输出一个整数

export const NavItemsConfig = ({
  settings,
}: {
  settings: {
    key: string;
    value: Prisma.JsonValue;
  }[];
}) => {
  return (
    <ClientOnly>
      <EntityContextProvider>
        <Content settings={settings}></Content>
      </EntityContextProvider>
    </ClientOnly>
  );
};

function Content({
  settings,
}: {
  settings: {
    key: string;
    value: Prisma.JsonValue;
  }[];
}) {
  let resourceList = useMemo(() => {
    const settingItemValue = settings.find(
      (e) => e.key === "nav_resource"
    )?.value;
    const list = getNavResourceItems(settingItemValue as any[] | undefined);
    if (!Array.isArray(list)) {
      return [list];
    }
    return list;
  }, [settings]);

  const state = useEntity();
  const dispatch = useEntityDispatch();

  useEffect(() => {
    dispatch({
      type: "SET_ENTITY_LIST",
      payload: resourceList.map((e) => ({ ...e, id: simpleHash(e.url) })),
    });
  }, [dispatch, resourceList]);

  console.log(resourceList, state.entityList);

  return (
    <div>
      <EntityRouteSimple
        key="navigation"
        renderEntityModalTitle={(e: NavigationItem & { id: string | number }) => e.title}
        renderEntity={(e: NavigationItem & { id: string | number }) => <Application href={e.url} name={e.title} iconName={e.iconName || 'link'}></Application>}
        state={state}
        dispatch={dispatch}
        layout="table"
        basename={"/admin/settings"}
        createForm={Form}
        updateForm={Form}
      ></EntityRouteSimple>
      <form action="/api/settings" method="POST">
        <input
          className="hidden"
          type="text"
          name="key"
          value={"nav_resource"}
        />
        {state.entityList.map((v) => (
          <textarea
            className="hidden"
            key={v.url}
            name="value"
            value={JSON.stringify(v)}
          ></textarea>
        ))}
        <BaseButton type="submit">提交</BaseButton>
      </form>
      {/* <BaseList>
        {value.map((e) => {
          return (
            <BaseListItem
              key={e.url}
              title={e.title}
              subtitle={e.subtitle}
              end={
                <BaseDropdown variant="context">
                  <BaseDropdownItem
                    title="删除"
                    onClick={() => {
                      setValue(value.filter((v) => v.url != e.url));
                    }}
                  ></BaseDropdownItem>
                </BaseDropdown>
              }
            ></BaseListItem>
          );
        })}
      </BaseList> */}
    </div>
  );
}

const Form = () => {
  const state = useEntity();
  const dispatch = useEntityDispatch();
  const ref = useRef<HTMLDivElement>(null);
  return (
    <>
      {" "}
      <div ref={ref}>
        <BaseInput id="title" label="标题" defaultValue={state.currentEntity.title}></BaseInput>
        <BaseInput id="subtitle" label="副标题" defaultValue={state.currentEntity.subtitle}></BaseInput>
        <BaseInput id="url" label="链接" defaultValue={state.currentEntity.url}></BaseInput>
        <BaseInput id="iconName" label="icon 名称" defaultValue={state.currentEntity.iconName}></BaseInput>
      </div>
      <BaseButton
        onClick={() => {
          const el = ref.current!;
          const inputs = Array.from(el.querySelectorAll("input"));
          const json = Object.fromEntries(
            inputs.map((el) => [el.id, el.value])
          );
          dispatch({
            type: "CREATE_OR_UPDATE_ENTITY",
            payload: {
              ...json,
              id: simpleHash(json.url),
            } as NavigationItem & { id: number },
          });
        }}
      >
        确定
      </BaseButton>
    </>
  );
};
