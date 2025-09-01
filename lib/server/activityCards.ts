import prisma from "@/lib/prisma";
import { getPost } from "./posts";
import { unstable_cache } from "next/cache";
import { getActivityCardsFromSettingValue } from "../isomorphic/getActivityCards";

export interface ActivityCardConfig {
  id: string;
  postId: number;
  title: string;
  description: string;
  actionName: string;
  imgUrl?: string;
  info?: string;
}

export interface ActivityCardData extends ActivityCardConfig {
  href: string;
}

export const getActivityCards = unstable_cache(async (): Promise<ActivityCardData[]> => {
  const setting = await prisma.settings.findUnique({
    where: {
      key: "activity_cards",
    },
  });

  if (!setting?.value) {
    return [];
  }

  const res = getActivityCardsFromSettingValue(setting.value as string);
  return res

}, ['activity_cards'], {
  tags: ['activity_cards', 'posts']
});
