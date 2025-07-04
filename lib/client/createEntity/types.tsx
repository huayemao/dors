export interface BaseEntity {
  id: number | string;
  seq?: string;
  sortIndex?: number;
}

export interface BaseCollection {
  id: number | string;
  name: string;
  online: boolean;
  updated_at?: string;
  description?: string
  layout?: "masonry" | "stack" | "table";
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
    type?: string;
  }
> = {
  modalOpen: boolean;
  entityModalMode: "view" | "edit";
  currentCollection: CollectionType | null | undefined;
  currentEntity: EntityType;
  collectionList: CollectionType[] | undefined;
  entityList: EntityType[];
  filters: FiltersType<EntityType>;
  filterConfig: {
    excludeIds?: EntityType["id"][];
    // 比如一个小记，没有标签，也留存，不被筛选掉
    includeNonKeys?: string[];
  };
  shouldSyncToLocalStorage: boolean;
  inMemory?: boolean;
  currentIndex: number;
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
    type: "INIT_CURRENT_COLLECTION";
    payload: State<EntityType, CollectionType>["currentCollection"];
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
  | {
    type: "CREATE_OR_UPDATE_ENTITY";
    payload: NonNullable<EntityType>;
  }
  | { type: "REMOVE_COLLECTION"; payload: CollectionType["id"] }
  | { type: "CANCEL" }
  | { type: "SET_CURRENT_INDEX"; payload: number };

