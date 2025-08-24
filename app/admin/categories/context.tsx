import { createEntityContext } from "@/lib/client/createEntity/createEntityContext";
import { Cat } from "@/lib/types/Category";

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
} = createEntityContext<typeof DEFAULT_CATEGORY, typeof DEFAULT_COLLECTION>({
  defaultEntity: DEFAULT_CATEGORY,
  defaultCollection: DEFAULT_COLLECTION,
  key: "categories",
  inMemory: true,
});
