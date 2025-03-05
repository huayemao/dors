export interface BaseEntity {
  id: number;
  seq?: string;
  sortIndex?: number;
}

export interface BaseCollection {
  id: number | string;
  name: string;
  online: boolean;
  updated_at?: string;
}

interface DetailedFilter {
  omit: string[];
  pick?: string[];
}

export type FiltersType<EntityType> = Partial<
  Record<
    keyof EntityType | "all",
    string | string[] | undefined | DetailedFilter
  >
>;

export type State<
  EntityType extends BaseEntity,
  CollectionType extends BaseCollection & {
    _entityList?: EntityType[];
    entityList?: EntityType[];
  }
> = {
  modalOpen: boolean;
  entityModalMode: "view" | "edit";
  currentCollection: CollectionType | null;
  currentEntity: EntityType;
  collectionList: CollectionType[];
  entityList: EntityType[];
  showingEntityList: EntityType[];
  filters: FiltersType<EntityType>;
  filterConfig: {
    excludeIds?: EntityType["id"][];
    // 比如一个小记，没有标签，也留存，不被筛选掉
    includeNonKeys?: string[];
  };
  fromLocalStorage: boolean;
  inMemory?: boolean
};

export type Action<
  EntityType extends BaseEntity,
  CollectionType extends BaseCollection
> =
  | {
    type: "ANY";
    payload: Partial<State<EntityType, CollectionType>>;
  }
  | {
    type: "SET_FILTERS";
    payload: {
      filters: State<EntityType, CollectionType>["filters"];
      filterConfig?: State<EntityType, CollectionType>["filterConfig"];
    };
  }
  | {
    type: "SET_ENTITY_MODAL_MODE";
    payload: State<EntityType, CollectionType>["entityModalMode"];
  }
  | {
    type: "INIT";
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
    type: "INIT_ENTITY_LIST";
    payload: State<EntityType, CollectionType>["entityList"];
  }
  | {
    type: "SET_ENTITY_LIST";
    payload: State<EntityType, CollectionType>["entityList"];
  }
  | {
    type: "SET_COLLECTION_LIST";
    payload: State<EntityType, CollectionType>["collectionList"];
  }
  | { type: "REMOVE_ENTITY"; payload: EntityType["id"] }
  | { type: "SET_MODAL_OPEN"; payload: boolean }
  | {
    type: "CREATE_OR_UPDATE_COLLECTION";
    payload: NonNullable<
      State<EntityType, CollectionType>["currentCollection"]
    >;
  }
  | { type: "REMOVE_COLLECTION"; payload: CollectionType["id"] }
  | { type: "CANCEL" };
