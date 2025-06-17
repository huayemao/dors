"use client";
import { pick } from "lodash";
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
import { BaseEntity, BaseCollection, State, Action } from "./types";
import { getReducer } from "./reducers";

export const createEntityContext = <
  EntityType extends BaseEntity,
  CollectionType extends BaseCollection & {
    _entityList?: EntityType[];
    type?: string;
  }
>({
  defaultEntity,
  defaultCollection,
  defaultFilters,
  defaultFilterConfig,
  key,
  inMemory = false,
}: {
  defaultEntity: EntityType;
  defaultCollection: CollectionType;
  key: string;
  defaultFilters?: State<EntityType, CollectionType>["filters"];
  defaultFilterConfig?: State<EntityType, CollectionType>["filterConfig"];
  inMemory?: boolean;
}) => {
  type AppState = State<EntityType, CollectionType>;

  const initialState: State<EntityType, CollectionType> = {
    modalOpen: false,
    entityModalMode: "view",
    currentCollection: undefined,
    currentEntity: defaultEntity,
    collectionList: undefined,
    entityList: [],
    filters: defaultFilters || {},
    filterConfig: defaultFilterConfig || {},
    shouldSyncToLocalStorage: false,
    inMemory,
    currentIndex: 0,
  };

  function getShowingList(state: AppState): EntityType[] {
    let list = state.entityList;
    if (!list) {
      return [];
    }

    // Apply filters
    for (const [key, filter] of Object.entries(state.filters)) {
      if (state.filterConfig.excludeIds) {
        list = list.filter((e) => !state.filterConfig.excludeIds?.includes(e.id));
      }
      if (typeof filter === "undefined") continue;

      if (typeof filter === "string") {
        if (key === "all") {
          list = list.filter((e) => {
            const obj = pick(e, ["tags", "content"]);
            return JSON.stringify(obj).includes(filter);
          });
        } else {
          list = list.filter((e) => e[key].includes(filter));
        }
      }

      if (Array.isArray(filter)) {
        list = list.filter((item) => {
          const itemValue = item[key];
          if (Array.isArray(itemValue)) {
            const hasValue = itemValue.some((item) => filter.includes(item));
            const pass = state.filterConfig.includeNonKeys?.includes(key);
            return pass ? hasValue || !filter.length || !itemValue.length : hasValue;
          }
          return true;
        });
      }

      if (typeof filter === "object" && "omit" in filter) {
        list = list.filter((item) => {
          const itemValue = item[key];
          if (Array.isArray(itemValue)) {
            const shouldNotOmit = !itemValue.some((v) => filter.omit.includes(v));
            const shouldPick = !filter.pick ? true : itemValue.some((v) => filter.pick!.includes(v));
            const pass = state.filterConfig.includeNonKeys?.includes(key);
            return pass ? (shouldNotOmit && shouldPick) || !itemValue.length : shouldNotOmit && shouldPick;
          }
          return true;
        });
      }
    }

    // Apply sorting
    if (state.currentCollection?.type === "diary-collection") {
      list = list.sort((a, b) => Number(b.id) - Number(a.id));
    }
    list = list.sort((a, b) => (b.sortIndex || 0) - (a.sortIndex || 0));

    return list;
  }

  const reducer = getReducer(defaultCollection, defaultEntity);
  const EntityContext = createContext(initialState);
  const EntityDispatchContext = createContext<Dispatch<Action<EntityType, CollectionType>>>(() => { });

  const collectionListKey = key + "_collectionList";

  const EntityContextProvider: FC<PropsWithChildren> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [pending, setPending] = useState(false);

    useEffect(() => {
      if (inMemory) {
        return;
      }
      setPending(true);
      localforage
        .getItem(collectionListKey)
        .then((res) => {
          let list: CollectionType[];
          if (!res || !(res as any).length) {
            list = [defaultCollection];
          } else {
            list = (res || []) as CollectionType[];
          }
          dispatch({
            type: "ANY",
            payload: {
              collectionList: list,
            },
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
      if (inMemory) {
        return;
      }
      // todo: 刚读出来的 collectionList 不应该反向同步
      localforage.setItem(collectionListKey, state.collectionList);
    }, [state.collectionList]);

    useEffect(() => {
      if (inMemory) {
        return;
      }
      if (!state.currentCollection || !state.currentCollection?.id) {
        return
      }
      setPending(true);

      // 云端同步就不该再从这里 init 了
      if (state.currentCollection._entityList) {
        delete state.currentCollection._entityList;
        setPending(false);
        return;
      }

      localforage
        .getItem(state.currentCollection.id + "")
        .then((res) => {

          // 切换时重置状态
          dispatch({
            type: "SET_FILTERS",
            payload: {
              filters: {},
              filterConfig: {},
            },
          });
          const entityList = res ? (res as AppState["entityList"]) : [];
          dispatch({
            type: "INIT_ENTITY_LIST",
            payload: entityList,
          });
        })
        .catch((e) => {
          alert(e.message);
        })
        .finally(() => {
          setPending(false);
        });
    }, [state.collectionList, state.currentCollection]);

    // todo: 把这些 effects 拆下
    // entityList 变化时同步到 storage
    useEffect(() => {
      if (inMemory) {
        return;
      }
      let ignore = false
      saveEntities();
      console.log(pending, state.shouldSyncToLocalStorage, state.currentCollection?.id, state.entityList);

      function saveEntities() {
        if (!state.currentCollection?.id || ignore) {
          return;
        }
        if (!pending && state.shouldSyncToLocalStorage) {
          console.log('saveEntities')
          // todo：起初读取值的时候不要反向同步
          localforage.setItem(
            state.currentCollection.id + "",
            state.entityList
          );
        }
      }
      return () => {
        // ignore = true;
      };
    }, [pending, state.currentCollection?.id, state.entityList, state.shouldSyncToLocalStorage]);

    return (
      <EntityContext.Provider value={state}>
        <EntityDispatchContext.Provider value={dispatch}>
          {children}
        </EntityDispatchContext.Provider>
      </EntityContext.Provider>
    );
  };

  function useEntity() {
    const state = useContext(EntityContext);
    return {
      ...state,
      showingEntityList: getShowingList(state),
    };
  }

  function useEntityDispatch() {
    return useContext(EntityDispatchContext);
  }

  return {
    EntityContext,
    EntityDispatchContext,
    EntityContextProvider,
    useEntity,
    useEntityDispatch,
  };
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
