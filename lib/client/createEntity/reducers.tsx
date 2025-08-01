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

  const reducer: Reducer<AppState, Action<EntityType, CollectionType>> = (
    state,
    action
  ): AppState => {
    const { currentCollection } = state;

    switch (action.type) {
      case "ANY": {
        return Object.assign({}, state, action.payload);
      }
      case "SET_FILTERS": {
        return Object.assign({}, state, {
          filters: action.payload.filters,
          filterConfig: action.payload.filterConfig || state.filterConfig,
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
      case "INIT_CURRENT_COLLECTION":
        return Object.assign({}, state, {
          currentCollection: action.payload,
        });
      // todo: 当只用于切换上下文时，不应该往本地存储写数据
      case "SET_CURRENT_COLLECTION": {
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
        return Object.assign({}, state, {
          entityList: action.payload,
          shouldSyncToLocalStorage: true,
        });
      }
      case "INIT_ENTITY_LIST": {
        return Object.assign({}, state, {
          shouldSyncToLocalStorage: false,
          entityList: action.payload,
        });
      }
      case "CREATE_OR_UPDATE_COLLECTION": {
        const { payload } = action;

        const newList = updateOrCreateInList(payload, state.collectionList);
        if (payload._entityList) {
          // 如果 payload 中包含 _entityList，则更新 currentCollection 的 _entityList
          // const eList = JSON.parse(JSON.stringify(payload._entityList)) || [];

          return Object.assign({}, state, {
            collectionList: newList,
            currentCollection: payload,
            entityList: payload._entityList,
            shouldSyncToLocalStorage: true,
          })
        }

        return Object.assign({}, state, {
          collectionList: newList,
          currentCollection: payload,
        });
      }
      case "CREATE_OR_UPDATE_ENTITY": {
        const { payload } = action;
        const { entityList, currentEntity } = state;
        const newList = updateOrCreateInList(payload, entityList);
        return Object.assign({}, state, {
          entityList: newList,
          currentEntity: payload,
          shouldSyncToLocalStorage: true,
        });
      }
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
        const targetItemIndex = state.entityList?.findIndex(
          (e) => e.id === action.payload
        );
        const hasTarget = targetItemIndex != undefined && targetItemIndex != -1;
        if (hasTarget) {
          return Object.assign({}, state, {
            entityList: state.entityList?.filter(
              (e, i) => e.id != action.payload
            ),
            shouldSyncToLocalStorage: true
          });
        }
        return state;
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
              currentCollection:null,
              collectionList: state.collectionList?.filter(
                (e, i) => e.id != id
              ),
            });
          }
          return state;
        };
        return removeItem(action.payload);
      }
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
