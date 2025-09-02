# CreateEntity 系统重构说明

## 重构目标

解决 CreateEntity 系统中大量重复的 props 传递问题，提高代码复用性和维护性。

## 主要改进

### 1. 统一的类型定义 (`types/common.tsx`)

- `BaseEntityComponentProps`: 基础组件 props 接口
- `RenderProps`: 渲染函数相关的 props
- `FormProps`: 表单相关的 props
- `LayoutProps`: 布局和配置相关的 props
- `RouteProps`: 路由相关的 props
- `CloudSyncProps`: 云同步相关的 props
- `CompleteEntityComponentProps`: 完整的组件 props 组合

### 2. 配置管理 (`EntityConfigProvider.tsx`)

- `EntityConfigProvider`: 统一的配置 Provider
- `useEntityConfig`: Hook 来获取配置
- `extractConfigFromProps`: 从完整 props 中提取配置的辅助函数

### 3. 组件重构

所有组件现在只需要接收 `state` 和 `dispatch`，其他配置通过 Context 获取：

- `CollectionLayout`: 从 Context 获取渲染函数、布局配置等
- `ViewOrEditEntityModal`: 从 Context 获取渲染函数
- `CreateEntityModal`: 从 Context 获取渲染函数
- `CreateCollectionModal`: 使用统一的 props 接口

### 4. 统一路由组件 (`EntityRouteUnified.tsx`)

- 整合了 `EntityRoute` 和 `EntityRouteSimple` 的功能
- 使用 `EntityConfigProvider` 管理所有配置
- 减少了重复的路由配置代码

## 使用方式

### 旧的使用方式（冗余）

```tsx
<CollectionLayout
  fetchCollection={fetchCollection}
  syncToCloud={syncToCloud}
  slots={slots}
  layout={layout}
  state={state}
  dispatch={dispatch}
  renderEntity={renderEntity}
  getList={getList}
/>
```

### 新的使用方式（简洁）

```tsx
// 1. 在顶层提供配置
<EntityConfigProvider config={config}>
  <CollectionLayout state={state} dispatch={dispatch} />
</EntityConfigProvider>

// 2. 或者使用统一路由组件
<EntityRouteUnified
  state={state}
  dispatch={dispatch}
  renderEntity={renderEntity}
  createForm={CreateForm}
  updateForm={UpdateForm}
  basename="/notes"
  // ... 其他配置
/>
```

## 优势

1. **减少重复**: 消除了大量重复的 props 传递
2. **类型安全**: 统一的类型定义确保类型安全
3. **易于维护**: 配置集中管理，修改更容易
4. **更好的复用**: 组件更加通用，易于复用
5. **清晰的职责**: 每个组件职责更加明确

## 迁移指南

1. 将现有的 props 配置提取到 `EntityConfigProvider` 中
2. 更新组件使用新的 props 接口
3. 使用 `EntityRouteUnified` 替代现有的路由组件
4. 测试确保功能正常

## 注意事项

- 确保所有使用 CreateEntity 系统的地方都包装了 `EntityConfigProvider`
- 新的组件需要从 Context 中获取配置，而不是通过 props
- 保持向后兼容性，旧的组件仍然可以工作
