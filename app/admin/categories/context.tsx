import { createEntityContext } from "@/lib/client/createEntity/createEntityContext";

export type Cat = {
  hidden: boolean;
  id: number;
  name: string | null;
  created_at: Date | null;
  updated_at: Date | null;
  published_at: Date | null;
  created_by_id: number | null;
  updated_by_id: number | null;
  meta?: { icon: string; description: string };
};
export const DEFAULT_CATEGORY = {} as Cat;

export const DEFAULT_COLLECTION = {
  id: Date.now(),
  name: new Date().toLocaleDateString(),
  online: false,
};
export const {
  EntityContext,
  EntityDispatchContext,
  EntityContextProvider,
  useEntity,
  useEntityDispatch,
} = createEntityContext<typeof DEFAULT_CATEGORY, typeof DEFAULT_COLLECTION>(
  DEFAULT_CATEGORY,
  DEFAULT_COLLECTION,
  "categories",
  true
);
