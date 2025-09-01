import { createEntityContext } from "@/lib/client/createEntity/createEntityContext";

export interface ActivityCardEntity {
  id: string | number;
  postId: number;
  title: string;
  description: string;
  actionName: string;
  imgUrl?: string;
  info?: string;
}

export const DEFAULT_ACTIVITY_CARD = {
  id: '',
  postId: 0,
  title: '',
  description: '',
  actionName: '开始探索',
  imgUrl: '',
  info: '',
} as ActivityCardEntity;

export const DEFAULT_ACTIVITY_CARD_COLLECTION = {
  id: Date.now(),
  name: 'ActivityCard 配置',
  online: false,
};

export const {
  EntityContext,
  EntityDispatchContext,
  EntityContextProvider,
  useEntity,
  useEntityDispatch,
} = createEntityContext<
  ActivityCardEntity,
  typeof DEFAULT_ACTIVITY_CARD_COLLECTION
>({
  defaultEntity: DEFAULT_ACTIVITY_CARD,
  defaultCollection: DEFAULT_ACTIVITY_CARD_COLLECTION,
  key: "activityCards",
  inMemory: true,
});
