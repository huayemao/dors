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

import { type Question } from "@/lib/types/Question";
import localforage from "localforage";

export interface BaseEntity {
  id: number;
  seq: string;
}

interface BaseCollection {
  id: number;
  name: string;
}

export const createEntityContext = <
  EntityType extends BaseEntity,
  CollectionType extends BaseCollection
>(
  defaultEntity: EntityType,
  defaultCollection: CollectionType,
  key: string
) => {
  type State<EntityType, CollectionType> = {
    modalOpen: boolean;
    questionModalMode: "view" | "edit";
    currentCollection: CollectionType;
    currentEntity: EntityType;
    collectionList: CollectionType[];
    entityList: EntityType[];
  };

  const initialState: State<EntityType, CollectionType> = {
    modalOpen: false,
    questionModalMode: "view",
    currentCollection: defaultCollection,
    currentEntity: defaultEntity,
    collectionList: [],
    entityList: [],
  };

  type Action<EntityType, CollectionType> =
    | {
        type: "SET_QUESTION_MODAL_MODE";
        payload: State<EntityType, CollectionType>["questionModalMode"];
      }
    | {
        type: "SET_CURRENT_COLLECTION";
        payload: State<EntityType, CollectionType>["currentCollection"];
      }
    | {
        type: "SET_CURRENT_ENTITY";
        payload: State<EntityType, CollectionType>["currentEntity"];
      }
    | {
        type: "SET_ENTITY_LIST";
        payload: State<EntityType, CollectionType>["entityList"];
      }
    | {
        type: "SET_COLLECTION_LIST";
        payload: State<EntityType, CollectionType>["collectionList"];
      }
    | { type: "REMOVE_QUESTION"; payload: Question["id"] }
    | { type: "SET_MODAL_OPEN"; payload: boolean }
    | {
        type: "CREATE_OR_UPDATE_COLLECTION";
        payload: State<EntityType, CollectionType>["currentCollection"];
      }
    | { type: "CANCEL" };

  const EnitityContext = createContext(initialState);
  const EntityDispatchContext = createContext<
    Dispatch<Action<EntityType, CollectionType>>
  >(() => {});

  const reducer: Reducer<
    State<EntityType, CollectionType>,
    Action<EntityType, CollectionType>
  > = (state = initialState, action) => {
    switch (action.type) {
      case "SET_MODAL_OPEN": {
        return Object.assign({}, state, {
          modalOpen: action.payload,
        });
      }
      case "SET_QUESTION_MODAL_MODE":
        return Object.assign({}, state, {
          questionModalMode: action.payload,
        });
      case "SET_CURRENT_COLLECTION":
        return Object.assign({}, state, {
          currentCollection: action.payload,
        });
      case "SET_CURRENT_ENTITY":
        return Object.assign({}, state, {
          currentEntity: action.payload,
        });
      case "SET_ENTITY_LIST":
        return Object.assign({}, state, {
          entityList: action.payload,
        });

      case "CREATE_OR_UPDATE_COLLECTION":
        const { payload } = action;
        const { collectionList, currentCollection } = state;
        if (!!currentCollection.name) {
          const newList = [...collectionList];
          const targetItemIndex = collectionList?.findIndex(
            (e) => e.id === currentCollection.id
          );
          newList[targetItemIndex] = payload;
          return Object.assign({}, state, {
            collectionList: newList,
          });
        } else {
          return Object.assign({}, state, {
            collectionList: collectionList
              ? collectionList.concat(payload)
              : [payload],
          });
        }
      // todo: reducer 里面实际还涉及到 storage 操作，怎么办？
      case "SET_COLLECTION_LIST":
        return Object.assign({}, state, {
          collectionList: action.payload,
        });
      case "CANCEL":
        const maxSeq = state.entityList?.length
          ? Math.max(...state.entityList?.map((e) => Number(e.seq)))
          : -1;
        return Object.assign({}, state, {
          modalOpen: false,
          currentEntity: { ...defaultEntity, seq: maxSeq + 1 },
          questionModalMode: "view",
        });
      case "REMOVE_QUESTION": {
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
      default:
        return state;
    }
  };

  const collectionListKey = key + "_collectionList";

  const EntityContextProvider: FC<PropsWithChildren> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [pending, setPending] = useState(false);

    useEffect(() => {
      localforage.getItem(collectionListKey).then((res) => {
        if (!res) {
          dispatch({
            type: "SET_COLLECTION_LIST",
            payload: [defaultCollection],
          });
        } else {
          dispatch({
            type: "SET_COLLECTION_LIST",
            payload: res as State<EntityType, CollectionType>["collectionList"],
          });
        }
        setPending(false);
      });
    }, []);

    useEffect(() => {
      localforage.setItem(collectionListKey, state.collectionList);
    }, [state.collectionList]);

    useEffect(() => {
      setPending(true);

      localforage.getItem(state.currentCollection.id + "").then((res) => {
        if (!res) {
          dispatch({
            type: "SET_ENTITY_LIST",
            payload: [],
          });
        } else {
          dispatch({
            type: "SET_ENTITY_LIST",
            payload: res as State<EntityType, CollectionType>["entityList"],
          });
        }
        setPending(false);
      });
    }, [state.currentCollection.id]);

    // 如果 collection 变了，不去同步，questionList 会变

    useEffect(() => {
      if (!pending) {
        localforage.setItem(state.currentCollection.id + "", state.entityList);
      }
    }, [state.entityList, pending, state.currentCollection.id]);

    return (
      <EnitityContext.Provider value={state}>
        <EntityDispatchContext.Provider value={dispatch}>
          {children}
        </EntityDispatchContext.Provider>
      </EnitityContext.Provider>
    );
  };

  function useEntity() {
    return useContext(EnitityContext);
  }

  function useEntityDispatch() {
    return useContext(EntityDispatchContext);
  }

  return {
    EnitityContext,
    EntityDispatchContext,
    EntityContextProvider,
    useEntity,
    useEntityDispatch,
  };
};

export type EntityState = ReturnType<
  ReturnType<typeof createEntityContext>["useEntity"]
>;

export type EntityDispatch = ReturnType<
ReturnType<typeof createEntityContext>["useEntityDispatch"]>
