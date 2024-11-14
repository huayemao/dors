"use client";
import {
  Context,
  Dispatch,
  FC,
  PropsWithChildren,
  Reducer,
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

import localforage from "localforage";

export interface BaseEntity {
  id: number;
  seq: string;
}

export interface BaseCollection {
  id: number | string;
  name: string;
  online: boolean;
}

export const createEntityContext = <
  EntityType extends BaseEntity,
  CollectionType extends BaseCollection & { _entityList?: EntityType[] }
>(
  defaultEntity: EntityType,
  defaultCollection: CollectionType,
  key: string
) => {
  type filtersType = Partial<Record<keyof EntityType, any>>;

  type State = {
    modalOpen: boolean;
    entityModalMode: "view" | "edit";
    currentCollection: CollectionType | null;
    currentEntity: EntityType;
    collectionList: CollectionType[];
    entityList: EntityType[];
    showingEntityList: EntityType[];
    filters: filtersType;
    filterConfig: {
      excludeIds?: EntityType["id"][];
      includeNonKeys?: string[];
    };
    fromLocalStorage: boolean;
  };

  const initialState: State = {
    modalOpen: false,
    entityModalMode: "view",
    currentCollection: null,
    currentEntity: defaultEntity,
    collectionList: [],
    entityList: [],
    showingEntityList: [],
    filters: {},
    filterConfig: {},
    fromLocalStorage: true,
  };

  type Action<
    EntityType extends BaseEntity,
    CollectionType extends BaseCollection
  > =
    | {
        type: "ANY";
        payload: Partial<State>;
      }
    | {
        type: "SET_FILTERS";
        payload: {
          filters: State["filters"];
          filterConfig?: State["filterConfig"];
        };
      }
    | {
        type: "SET_ENTITY_MODAL_MODE";
        payload: State["entityModalMode"];
      }
    | {
        type: "INIT";
      }
    | {
        type: "SET_CURRENT_COLLECTION";
        payload: State["currentCollection"];
      }
    | {
        type: "SET_CURRENT_ENTITY";
        payload: State["currentEntity"];
      }
    | {
        type: "INIT_ENTITY_LIST";
        payload: State["entityList"];
      }
    | {
        type: "SET_ENTITY_LIST";
        payload: State["entityList"];
      }
    | {
        type: "SET_COLLECTION_LIST";
        payload: State["collectionList"];
      }
    | { type: "REMOVE_ENTITY"; payload: EntityType["id"] }
    | { type: "SET_MODAL_OPEN"; payload: boolean }
    | {
        type: "CREATE_OR_UPDATE_COLLECTION";
        payload: NonNullable<State["currentCollection"]>;
      }
    | { type: "REMOVE_COLLECTION"; payload: CollectionType["id"] }
    | { type: "CANCEL" };

  const EntityContext = createContext(initialState);
  const EntityDispatchContext = createContext<
    Dispatch<Action<EntityType, CollectionType>>
  >(() => {});

  const reducer: Reducer<State, Action<EntityType, CollectionType>> = (
    state = initialState,
    action
  ): State => {
    switch (action.type) {
      case "ANY": {
        return Object.assign({}, state, action.payload);
      }
      case "SET_FILTERS": {
        const list = getShowingList({
          entityList: state.entityList,
          filters: action.payload.filters,
          filterConfig: action.payload.filterConfig || state.filterConfig,
        });
        return Object.assign({}, state, {
          filters: action.payload.filters,
          filterConfig: action.payload.filterConfig || state.filterConfig,
          showingEntityList: list,
        });
      }
      case "SET_MODAL_OPEN": {
        return Object.assign({}, state, {
          modalOpen: action.payload,
        });
      }
      case "SET_ENTITY_MODAL_MODE":
        return Object.assign({}, state, {
          entityModalMode: action.payload,
        });
      case "SET_CURRENT_COLLECTION": {
        const collection = action.payload;
        if (collection) {
          const isImporting =
            collection.id &&
            collection.id != defaultCollection.id &&
            state.collectionList.every((item) => item.id != collection.id);

          if (isImporting) {
            const patch = {
              currentCollection: collection,
              collectionList: state.collectionList.concat(collection),
              entityList: collection._entityList,
              fromLocalStorage: false,
            };
            return Object.assign({}, state, patch);
          }
        }
        return Object.assign({}, state, {
          currentCollection: action.payload,
        });
      }

      case "SET_CURRENT_ENTITY": {
        return Object.assign({}, state, {
          currentEntity: action.payload,
        });
      }

      case "SET_ENTITY_LIST": {
        const list = getShowingList({
          entityList: action.payload,
          filters: state.filters,
          filterConfig: state.filterConfig,
        });
        return Object.assign({}, state, {
          entityList: action.payload,
          fromLocalStorage: false,
          showingEntityList: list,
        });
      }
      case "INIT_ENTITY_LIST": {
        const list = getShowingList({
          entityList: action.payload,
          filters: state.filters,
          filterConfig: state.filterConfig,
        });
        return Object.assign({}, state, {
          fromLocalStorage: true,
          entityList: action.payload,
          showingEntityList: list,
        });
      }
      case "CREATE_OR_UPDATE_COLLECTION": {
        const { payload } = action;
        const { collectionList, currentCollection } = state;
        // isEditing
        if (!!currentCollection) {
          const newList = [...collectionList];
          const targetItemIndex = collectionList?.findIndex(
            (e) => e.id === currentCollection.id
          );
          newList[targetItemIndex] = payload;
          return Object.assign({}, state, {
            collectionList: newList,
            currentCollection: payload,
          });
        } else {
          const newList = collectionList
            ? collectionList.concat(payload)
            : [payload];
          return Object.assign({}, state, {
            collectionList: newList,
            currentCollection: payload,
          });
        }
      }
      // todo: reducer 里面实际还涉及到 storage 操作，怎么办？
      case "SET_COLLECTION_LIST":
        return Object.assign({}, state, {
          collectionList: action.payload,
        });
      case "INIT":
        const maxSeq = state.entityList?.length
          ? Math.max(...state.entityList?.map((e) => Number(e.seq)))
          : -1;
        return Object.assign({}, state, {
          currentEntity: { ...defaultEntity, seq: maxSeq + 1 },
        });
      case "CANCEL":
        return Object.assign({}, state, {
          modalOpen: false,
          entityModalMode: "view",
        });
      case "REMOVE_ENTITY": {
        const removeItem = (id: number) => {
          const targetItemIndex = state.entityList?.findIndex(
            (e) => e.id === id
          );
          const hasTarget =
            targetItemIndex != undefined && targetItemIndex != -1;
          if (hasTarget) {
            return Object.assign({}, state, {
              entityList: state.entityList?.filter((e, i) => e.id != id),
            });
          }
          return state;
        };
        return removeItem(action.payload);
      }
      case "REMOVE_COLLECTION": {
        const removeItem = (id) => {
          const targetItemIndex = state.collectionList?.findIndex(
            (e) => e.id === id
          );
          const hasTarget =
            targetItemIndex != undefined && targetItemIndex != -1;
          if (hasTarget) {
            return Object.assign({}, state, {
              collectionList: state.collectionList?.filter(
                (e, i) => e.id != id
              ),
            });
          }
          return state;
        };
        return removeItem(action.payload);
      }
      default:
        return state;
    }
  };

  const collectionListKey = key + "_collectionList";

  const EntityContextProvider: FC<PropsWithChildren> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [pending, setPending] = useState(false);

    useEffect(() => {
      setPending(true);
      localforage
        .getItem(collectionListKey)
        .then((res) => {
          let list: CollectionType[];
          if (!res || !(res as any).length) {
            list = [defaultCollection];
          } else {
            list = res as CollectionType[];
          }
          dispatch({
            type: "SET_COLLECTION_LIST",
            payload: list,
          });
          dispatch({
            type: "SET_CURRENT_COLLECTION",
            payload: list[0],
          });
        })
        .catch((e) => {
          alert(e.message);
        })
        .finally(() => {
          setPending(false);
        });
    }, []);

    useEffect(() => {
      // todo: 把 EntityList 删掉
      localforage.setItem(collectionListKey, state.collectionList);
    }, [state.collectionList]);

    useEffect(() => {
      if (!state.currentCollection?.id) {
        return;
      }

      // 有 _entityList 表示才获取的最新的
      if (state.currentCollection?._entityList) {
        const c = state.currentCollection;
        delete c["_entityList"];
        localforage.getItem(collectionListKey).then((res) => {
          const newList = (res as CollectionType[] | undefined)?.length
            ? (res as CollectionType[]).filter(
                (e) => e.id != state.currentCollection?.id
              )
            : [];
          localforage.setItem(collectionListKey, newList.concat(c));
        });
        return;
      }

      setPending(true);
      localforage
        .getItem(state.currentCollection.id + "")
        .then((res) => {
          dispatch({
            type: "SET_FILTERS",
            payload: {
              filters: {},
              filterConfig: {},
            },
          });
          if (!res) {
            dispatch({
              type: "INIT_ENTITY_LIST",
              payload: [],
            });
            dispatch({
              type: "SET_FILTERS",
              payload: { filters: {}, filterConfig: {} },
            });
          } else {
            dispatch({
              type: "INIT_ENTITY_LIST",
              payload: res as State["entityList"],
            });
          }
        })
        .catch((e) => {
          alert(e.message);
        })
        .finally(() => {
          setPending(false);
        });
    }, [state.collectionList, state.currentCollection]);

    // entityList 变化时同步到 storage
    useEffect(() => {
      if (!state.currentCollection?.id) {
        return;
      }
      if (!pending && !state.fromLocalStorage) {
        // todo：起初读取值的时候不要反向同步
        localforage.setItem(state.currentCollection.id + "", state.entityList);
      }
    }, [state.entityList]);

    return (
      <EntityContext.Provider value={state}>
        <EntityDispatchContext.Provider value={dispatch}>
          {children}
        </EntityDispatchContext.Provider>
      </EntityContext.Provider>
    );
  };

  function useEntity() {
    return useContext(EntityContext);
  }

  function useEntityDispatch() {
    return useContext(EntityDispatchContext);
  }

  return {
    EntityContext: EntityContext,
    EntityDispatchContext,
    EntityContextProvider,
    useEntity,
    useEntityDispatch,
  };

  function getShowingList<
    EType extends BaseEntity,
    CType extends BaseCollection
  >({
    entityList,
    filters,
    filterConfig,
  }: {
    entityList: EntityState<EType, CType>["entityList"];
    filters: EntityState<EType, CType>["filters"];
    filterConfig: State["filterConfig"];
  }) {
    let list = entityList;
    for (const [key, value] of Object.entries(filters)) {
      if (filterConfig.excludeIds) {
        list = list.filter((e) => {
          return !filterConfig.excludeIds?.includes(e.id);
        });
      }
      if (typeof value == "undefined") {
        continue;
      }
      if (typeof value === "string") {
        list = list.filter((e) => {
          return e[key].includes(value);
        });
      }
      if (Array.isArray(value)) {
        list = list.filter((item) => {
          const itemValue = item[key];
          if (Array.isArray(itemValue)) {
            const hasValue = itemValue.some((item) => value.includes(item));
            return filterConfig.includeNonKeys?.includes(key)
              ? hasValue || !value.length || !itemValue.length
              : hasValue;
          }
          return true;
        });
      }
    }
    return list;
  }
};

export type EntityState<
  EType extends BaseEntity,
  CType extends BaseCollection
> = ReturnType<
  ReturnType<typeof createEntityContext<EType, CType>>["useEntity"]
>;

export type EntityDispatch<
  EType extends BaseEntity,
  CType extends BaseCollection
> = ReturnType<
  ReturnType<typeof createEntityContext<EType, CType>>["useEntityDispatch"]
>;
