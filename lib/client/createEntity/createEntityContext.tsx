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
import { BaseEntity, BaseCollection, State, Action } from "./types";
import { getReducer } from "./reduders";

export const createEntityContext = <
  EntityType extends BaseEntity,
  CollectionType extends BaseCollection & { _entityList?: EntityType[] }
>(
  defaultEntity: EntityType,
  defaultCollection: CollectionType,
  key: string
) => {
  type AppState = State<EntityType, CollectionType>;
  // type AppAction = Action<EntityType, CollectionType>;

  const initialState: State<EntityType, CollectionType> = {
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
  const reducer = getReducer(defaultCollection, defaultEntity);
  const EntityContext = createContext(initialState);
  const EntityDispatchContext = createContext<
    Dispatch<Action<EntityType, CollectionType>>
  >(() => {});

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
            type: "ANY",
            payload: {
              collectionList: list,
              currentCollection: list[0],
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

      // todo: 写一下 return 的 cleanup 函数，忽略过时的 currentCollection fetch 的数据
      // https://react.dev/learn/synchronizing-with-effects#fetching-data
    }, [state.collectionList, state.currentCollection]);

    // todo: 把这些 effects 拆下
    // entityList 变化时同步到 storage
    useEffect(() => {
      saveEntities();
      function saveEntities() {
        if (!state.currentCollection?.id) {
          return;
        }
        if (!pending && !state.fromLocalStorage) {
          // todo：起初读取值的时候不要反向同步
          localforage.setItem(
            state.currentCollection.id + "",
            state.entityList
          );
        }
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
