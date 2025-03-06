import { createEntityContext } from "@/lib/client/createEntity/createEntityContext";
import { NavigationItem } from "@/lib/types/NavItem";

export const DEFAULT_NAV = {} as NavigationItem;

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
} = createEntityContext<
  NavigationItem & { id: string | number },
  typeof DEFAULT_COLLECTION
>({
  defaultEntity: DEFAULT_NAV as any,
  defaultCollection: DEFAULT_COLLECTION,
  key: "navItems",
  inMemory: true,
});
