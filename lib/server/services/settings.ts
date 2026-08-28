import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { getActivityCardsFromSettingValue } from "@/lib/isomorphic/getActivityCards";
import { getNavResourceItems } from "@/lib/isomorphic/getNavResourceItems";

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
  return res;
}, ['activity_cards'], {
  tags: ['activity_cards', 'posts']
});

export const getNavContent = unstable_cache(
  async function () {
    const res = (
      await prisma.settings.findFirst({ where: { key: "nav_content_post_id" } })
    )?.value;

    if (!res) {
      return null;
    }

    const postId = Number(res as string[][0]);

    const post = await prisma.posts.findFirst({
      where: {
        id: postId,
      },
    });

    return { postId, post };
  },
  ["settings", "nav_content_post_id"],
  { tags: ["settings_nav_content_post_id", "posts"] }
);

export async function parsedNavigationPage(items: any[]) {
  const allContent = items
    .map(
      (e, i) =>
        `\n<Container tags="${e.tags}" id="${e.id}" i="${i}">\n${e.content}\n</Container>\n`
    )
    .join("\n");

  return allContent;
}

export const getResourceItems = unstable_cache(async function () {
  const resourceItemsRes = (
    await prisma.settings.findFirst({ where: { key: "nav_resource" } })
  )?.value;
  const resourceItems = getNavResourceItems(resourceItemsRes as string[]);
  return resourceItems;
}, ['settings', 'nav_resource'], { tags: ['settings_nav_resource'] });
