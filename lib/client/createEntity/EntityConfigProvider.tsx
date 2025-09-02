import { FC, PropsWithChildren, createContext, useContext } from "react";
import { BaseEntity, BaseCollection } from "./types";
import { EntityState, EntityDispatch } from "./createEntityContext";
import {
  RenderProps,
  FormProps,
  LayoutProps,
  RouteProps,
  CloudSyncProps,
  CompleteEntityComponentProps,
} from "./types/common";

// 配置 Context 的类型
export interface EntityConfigContextValue<EType extends BaseEntity, CType extends BaseCollection> {
  // 渲染配置
  renderEntity: RenderProps<EType>["renderEntity"];
  renderEntityModalTitle?: RenderProps<EType>["renderEntityModalTitle"];
  renderEntityModalActions?: RenderProps<EType>["renderEntityModalActions"];
  
  // 表单配置
  createForm: FormProps["createForm"];
  updateForm: FormProps["updateForm"];
  
  // 布局配置
  layout?: LayoutProps<EType>["layout"];
  getList?: LayoutProps<EType>["getList"];
  slots?: LayoutProps<EType>["slots"];
  
  // 路由配置
  basename: RouteProps["basename"];
  extraRoutes?: RouteProps["extraRoutes"];
  RootPage?: RouteProps["RootPage"];
  EntityPreviewPage?: RouteProps["EntityPreviewPage"];
  
  // 云同步配置
  fetchCollection: CloudSyncProps<EType, CType>["fetchCollection"];
  syncToCloud: CloudSyncProps<EType, CType>["syncToCloud"];
}

// 创建 Context
const EntityConfigContext = createContext<EntityConfigContextValue<any, any> | null>(null);

// Provider 组件
export interface EntityConfigProviderProps<EType extends BaseEntity, CType extends BaseCollection> {
  config: EntityConfigContextValue<EType, CType>;
  children: PropsWithChildren["children"];
}

export function EntityConfigProvider<EType extends BaseEntity, CType extends BaseCollection>({
  config,
  children,
}: EntityConfigProviderProps<EType, CType>) {
  return (
    <EntityConfigContext.Provider value={config}>
      {children}
    </EntityConfigContext.Provider>
  );
}

// Hook 来使用配置
export function useEntityConfig<EType extends BaseEntity, CType extends BaseCollection>(): EntityConfigContextValue<EType, CType> {
  const context = useContext(EntityConfigContext);
  if (!context) {
    throw new Error("useEntityConfig must be used within an EntityConfigProvider");
  }
  return context as EntityConfigContextValue<EType, CType>;
}

// 辅助函数：从完整 props 中提取配置
export function extractConfigFromProps<EType extends BaseEntity, CType extends BaseCollection>(
  props: CompleteEntityComponentProps<EType, CType>
): EntityConfigContextValue<EType, CType> {
  return {
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
    fetchCollection: props.fetchCollection,
    syncToCloud: props.syncToCloud,
  };
}
