import { FC, PropsWithChildren, ComponentProps } from "react";
import { createBrowserRouter, RouterProvider, RouteObject } from "react-router-dom";
import { BaseEntity, BaseCollection } from "./types";
import { EntityState, EntityDispatch } from "./createEntityContext";
import { CompleteEntityComponentProps } from "./types/common";
import { EntityConfigProvider } from "./EntityConfigProvider";
import CollectionLayout from "./CollectionLayout";
import ViewOrEditEntityModal from "./ViewOrEditEntityModal";
import CreateEntityModal from "./CreateEntityModal";
import CreateCollectionModal from "./CreateCollectionModal";

// 通用的路由配置
const addActionRoutes = (state: any, dispatch: any): RouteObject[] => [
  {
    path: "create",
    element: <CreateCollectionModal state={state} dispatch={dispatch} />,
  },
];

// 统一的 EntityRoute 组件
export default function EntityRouteUnified<
  EType extends BaseEntity,
  CType extends BaseCollection
>(props: CompleteEntityComponentProps<EType, CType>) {
  const {
    state,
    dispatch,
    basename,
    createForm,
    updateForm,
    RootPage,
    extraRoutes = [],
    EntityPreviewPage,
  } = props;

  // 如果 props 中没有提供云同步函数，使用默认实现
  const defaultSyncToCloud = async (collection: any, entityList: any) => {
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        collection,
        entityList,
      }),
    });
    return res.json().then((json) => json.data);
  };

  // 如果 props 中没有提供获取集合函数，使用默认实现
  const defaultFetchCollection = async (id: string) => {
    const res = await fetch(`/api/notes/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.json().then((obj) => {
      const res = {
        ...obj,
        _entityList: obj.entityList,
        entityList: obj.entityList,
        layout: obj.meta?.layout || "masonry",
      };
      return res;
    });
  };

  // 创建配置对象
  const config = {
    renderEntity: props.renderEntity,
    renderEntityModalTitle: props.renderEntityModalTitle,
    renderEntityModalActions: props.renderEntityModalActions,
    createForm: props.createForm,
    updateForm: props.updateForm,
    layout: props.layout,
    getList: props.getList,
    slots: props.slots,
    basename: props.basename,
    extraRoutes: props.extraRoutes,
    RootPage: props.RootPage,
    EntityPreviewPage: props.EntityPreviewPage,
    fetchCollection: props.fetchCollection || defaultFetchCollection,
    syncToCloud: props.syncToCloud || defaultSyncToCloud,
  };

  const isView = state.entityModalMode === "view";

  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: RootPage ? <RootPage /> : <CollectionLayout state={state} dispatch={dispatch} />,
      },
      {
        path: "/create",
        element: <CreateCollectionModal state={state} dispatch={dispatch} />,
      },
      {
        path: ":collectionId",
        element: <CollectionLayout state={state} dispatch={dispatch} />,
        children: [
          ...addActionRoutes(state, dispatch),
          {
            path: ":entityId",
            element:
              EntityPreviewPage && isView ? (
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
          ...extraRoutes,
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
