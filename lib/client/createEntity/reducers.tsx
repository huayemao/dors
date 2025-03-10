import { Reducer } from "react";
import { BaseEntity, BaseCollection, State, Action } from "./types";
import { EntityState } from "./createEntityContext";
import { pick } from "lodash";

export const getReducerSlices = <
  EntityType extends BaseEntity,
  CollectionType extends BaseCollection & { _entityList?: EntityType[] }
>(
  state: State<EntityType, CollectionType>
) => {
  const removeEntity = (id: number | string) => {
    const targetItemIndex = state.entityList?.findIndex((e) => e.id === id);
    const hasTarget = targetItemIndex != undefined && targetItemIndex != -1;
    if (hasTarget) {
      return Object.assign({}, state, {
        entityList: state.entityList?.filter((e, i) => e.id != id),
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
  CollectionType extends BaseCollection & { _entityList?: EntityType[] }
>(
  defaultCollection: CollectionType,
  defaultEntity: EntityType
) => {
  type AppState = State<EntityType, CollectionType>;

  const reducer: Reducer<AppState, Action<EntityType, CollectionType>> = (
    state,
    action
  ): AppState => {
    const { removeEntity } = getReducerSlices(state);

    function getShowingList(list: EntityType[]) {
      const res = filterEntityList({
        entityList: state.entityList,
        filters: state.filters,
        filterConfig: state.filterConfig || state.filterConfig,
      }).sort((a, b) => {
        return (b.sortIndex || 0) - (a.sortIndex || 0);
      });
      return res
    }

    switch (action.type) {
      case "ANY": {
        return Object.assign({}, state, action.payload);
      }
      case "SET_FILTERS": {
        const list = filterEntityList({
          entityList: state.entityList,
          filters: action.payload.filters,
          filterConfig: action.payload.filterConfig || state.filterConfig,
        }).sort((a, b) => {
          return (b.sortIndex || 0) - (a.sortIndex || 0);
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
          const isUpdating =
            collection.id &&
            collection.updated_at &&
            collection.id == state.currentCollection?.id &&
            state.currentCollection?.updated_at &&
            collection.updated_at != state.currentCollection?.updated_at;

          if (isUpdating) {
            const index = state.collectionList.findIndex(
              (e) => e.id == collection.id
            );
            const newList = [...state.collectionList];
            newList[index] = collection;
            const patch = {
              currentCollection: collection,
              collectionList: newList,
              entityList: collection._entityList,
              fromLocalStorage: false,
            };
            return Object.assign({}, state, patch);
          }

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
        const list = filterEntityList({
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
        const list = filterEntityList({
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
      case "CREATE_OR_UPDATE_ENTITY": {
        const { payload } = action;
        const { entityList, currentEntity } = state;
        const newList = updateOrCreateInList(payload, entityList);
        return Object.assign({}, state, {
          entityList: newList,
          currentEntity: payload,
          showingEntityList: getShowingList(newList),
          fromLocalStorage: false
        });
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
        return removeEntity(action.payload);
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

  function filterEntityList<
    EType extends BaseEntity,
    CType extends BaseCollection
  >({
    entityList,
    filters,
    filterConfig,
  }: {
    entityList: EntityState<EType, CType>["entityList"];
    filters: EntityState<EType, CType>["filters"];
    filterConfig: AppState["filterConfig"];
  }) {
    let list = entityList;
    for (const [key, filter] of Object.entries(filters)) {
      if (filterConfig.excludeIds) {
        list = list.filter((e) => {
          return !filterConfig.excludeIds?.includes(e.id);
        });
      }
      if (typeof filter == "undefined") {
        continue;
      }
      if (typeof filter === "string") {
        if (key == "all") {
          list = list.filter((e) => {
            const obj = pick(e, ["tags", "content",]);
            return JSON.stringify(obj).includes(filter);
          });
        } else {
          list = list.filter((e) => {
            return e[key].includes(filter);
          });
        }
      }
      if (Array.isArray(filter)) {
        list = list.filter((item) => {
          const itemValue = item[key];
          if (Array.isArray(itemValue)) {
            const hasValue = itemValue.some((item) => filter.includes(item));
            const pass = filterConfig.includeNonKeys?.includes(key);
            return pass
              ? hasValue || !filter.length || !itemValue.length
              : hasValue;
          }
          return true;
        });
      }
      if (typeof filter == "object" && "omit" in filter) {
        list = list.filter((item) => {
          const itemValue = item[key];
          if (Array.isArray(itemValue)) {
            const shouldNotOmit = !itemValue.some((v) =>
              filter.omit.includes(v)
            );
            const shouldPick = !filter.pick
              ? true
              : itemValue.some((v) => filter.pick!.includes(v));

            const pass = filterConfig.includeNonKeys?.includes(key);
            return pass
              ? (shouldNotOmit && shouldPick) || !itemValue.length
              : shouldNotOmit && shouldPick;
          }
        });
      }
    }
    return list;
  }
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