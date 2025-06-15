import { Reducer } from "react";
import { BaseEntity, BaseCollection, State, Action } from "./types";
import { EntityState } from "./createEntityContext";
import { pick } from "lodash";

export const getReducerSlices = <
  EntityType extends BaseEntity,
  CollectionType extends BaseCollection & { _entityList?: EntityType[] }
>(
  state: State<EntityType, CollectionType>,
  getShowingList: (list: EntityType[]) => EntityType[]
) => {
  const removeEntity = (id: number | string) => {
    const targetItemIndex = state.entityList?.findIndex((e) => e.id === id);
    const hasTarget = targetItemIndex != undefined && targetItemIndex != -1;
    if (hasTarget) {
      const newEntityList = state.entityList?.filter((e, i) => e.id != id);
      return Object.assign({}, state, {
        entityList: newEntityList,
        showingEntityList: getShowingList(newEntityList),
      });
    }
    return state;
  };

  return {
    removeEntity,
  };
};

export const getReducer = <
  EntityType extends BaseEntity,
  CollectionType extends BaseCollection & {
    _entityList?: EntityType[];
    type?: string;
  }
>(
  defaultCollection: CollectionType,
  defaultEntity: EntityType
) => {
  type AppState = State<EntityType, CollectionType>;
  type AppAction = Action<EntityType, CollectionType>;

  const reducer: Reducer<AppState, AppAction> = (state, action) => {
    switch (action.type) {
      case "ANY":
        return { ...state, ...action.payload };
      case "SET_FILTERS":
        return {
          ...state,
          filters: action.payload.filters,
          filterConfig: action.payload.filterConfig || state.filterConfig,
        };
      case "SET_ENTITY_MODAL_MODE":
        return { ...state, entityModalMode: action.payload };
      case "INIT":
        return {
          ...state,
          currentCollection: defaultCollection,
          currentEntity: defaultEntity,
        };
      case "SET_CURRENT_COLLECTION":
        return { ...state, currentCollection: action.payload };
      case "SET_CURRENT_ENTITY":
        return { ...state, currentEntity: action.payload };
      case "INIT_ENTITY_LIST":
        return { ...state, entityList: action.payload };
      case "SET_ENTITY_LIST":
        return { ...state, entityList: action.payload };
      case "SET_COLLECTION_LIST":
        return { ...state, collectionList: action.payload };
      case "REMOVE_ENTITY":
        return {
          ...state,
          entityList: state.entityList.filter((e) => e.id !== action.payload),
        };
      case "SET_MODAL_OPEN":
        return { ...state, modalOpen: action.payload };
      case "CREATE_OR_UPDATE_COLLECTION":
        return {
          ...state,
          collectionList: state.collectionList.map((e) =>
            e.id === action.payload.id ? action.payload : e
          ),
          currentCollection: action.payload,
        };
      case "CREATE_OR_UPDATE_ENTITY":
        return {
          ...state,
          entityList: state.entityList.map((e) =>
            e.id === action.payload.id ? action.payload : e
          ),
          currentEntity: action.payload,
        };
      case "REMOVE_COLLECTION":
        return {
          ...state,
          collectionList: state.collectionList.filter(
            (e) => e.id !== action.payload
          ),
        };
      case "CANCEL":
        return {
          ...state,
          modalOpen: false,
          entityModalMode: "view",
          currentEntity: defaultEntity,
        };
      case "SET_CURRENT_INDEX":
        return {
          ...state,
          currentIndex: action.payload,
        };
      default:
        return state;
    }
  };

  return reducer;
};

function updateOrCreateInList(payload, list) {
  // 如果列表为空，直接返回包含新对象的列表
  if (!list) {
    return [payload];
  }

  // 找到目标对象的索引
  const targetItemIndex = list.findIndex((item) => item.id === payload.id);

  // 如果找到目标对象（即存在相同id的对象），更新该对象
  if (targetItemIndex !== -1) {
    return [
      ...list.slice(0, targetItemIndex),
      payload,
      ...list.slice(targetItemIndex + 1),
    ];
  }

  // 如果未找到目标对象（即不存在相同id的对象），将新对象添加到列表中
  return list.concat(payload);
}
