import { FC, PropsWithChildren, ReactNode } from "react";
import { BaseEntity, BaseCollection } from "../types";
import { EntityState, EntityDispatch } from "../createEntityContext";

// 通用的渲染函数类型
export type RenderEntityFunction<EType extends BaseEntity> = (
  entity: EType,
  options: { preview: boolean; stackMode?: boolean }
) => ReactNode;

export type RenderEntityModalTitleFunction<EType extends BaseEntity> = (
  entity: EType,
  options?: { preview: boolean }
) => ReactNode;

export type RenderEntityModalActionsFunction<EType extends BaseEntity> = (
  entity: EType,
  options: { preview: boolean }
) => ReactNode;

// 通用的组件 Props 基础接口
export interface BaseEntityComponentProps<EType extends BaseEntity, CType extends BaseCollection> {
  state: EntityState<EType, CType>;
  dispatch: EntityDispatch<EType, CType>;
}

// 渲染相关的 Props
export interface RenderProps<EType extends BaseEntity> {
  renderEntity: RenderEntityFunction<EType>;
  renderEntityModalTitle?: RenderEntityModalTitleFunction<EType>;
  renderEntityModalActions?: RenderEntityModalActionsFunction<EType>;
}

// 表单相关的 Props
export interface FormProps {
  createForm: FC<PropsWithChildren>;
  updateForm: FC<PropsWithChildren>;
}

// 布局和配置相关的 Props
export interface LayoutProps<EType extends BaseEntity> {
  layout?: "masonry" | "stack" | "table";
  getList?: (list: EType[]) => object[];
  slots?: Record<
    "search",
    FC<{
      state: EntityState<EType, any>;
      dispatch: EntityDispatch<EType, any>;
    }>
  >;
}

// 路由相关的 Props
export interface RouteProps {
  basename: string;
  extraRoutes?: any[];
  RootPage?: FC<PropsWithChildren>;
  EntityPreviewPage?: FC<{
    state: EntityState<any, any>;
    dispatch: EntityDispatch<any, any>;
  }>;
}

// 云同步相关的 Props
export interface CloudSyncProps<EType extends BaseEntity, CType extends BaseCollection> {
  fetchCollection: (id: string) => Promise<CType | null>;
  syncToCloud: (
    collection: EntityState<any, any>["currentCollection"],
    entityList: EntityState<any, any>["entityList"]
  ) => Promise<any>;
}

// 完整的组件 Props 组合
export type CompleteEntityComponentProps<EType extends BaseEntity, CType extends BaseCollection> = 
  BaseEntityComponentProps<EType, CType> &
  RenderProps<EType> &
  FormProps &
  LayoutProps<EType> &
  RouteProps &
  CloudSyncProps<EType, CType>;
