import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { Cat } from "../types/Category";


export const getAllCategories = unstable_cache(
  async (options?: { includeHidden?: boolean }) => {
    const where = {};
    const ids = await getHiddenCategoryIds();

    if (!options?.includeHidden) {
      Object.assign(where, {
        id: {
          notIn: ids,
        },
      });
    }
    const cats = (await prisma.categories.findMany({
      where,
      include: {
        _count: {
          select: {
            posts_category_links: {
              where: {
                posts: {
                  type: 'normal'
                }
              }
            }
          }
        },
      }
    })).map((e) => ({ ...e, hidden: ids.includes(e.id), postCount: e._count.posts_category_links, meta: e.meta as Cat['meta'] })) as Cat[];

    return cats.sort((a, b) => (b.meta?.sortIndex || 0) - (a.meta?.sortIndex || 0));
  }
  , undefined, {
  tags: ['all_cats', 'cats']
});

export const getHiddenCategoryIds = unstable_cache(async () => {
  const settings = await prisma.settings.findFirst({
    where: { key: "hidden_categories" },
  });

  if (typeof settings?.value === 'string') {
    settings.value = JSON.parse(settings.value)
  }

  const ids = settings?.value
    ? (settings.value as any[]).map((e) => parseInt(e))
    : [];
  return ids as number[];
}, undefined, {
  tags: ['cats']
});

export const getHiddenCategories = unstable_cache(async () => {
  const ids = await getHiddenCategoryIds();
  return await prisma.categories.findMany({
    orderBy: {
      updated_at: "desc",
    },
    where: { id: { in: ids } },
  });
}, undefined, {
  tags: ['cats']
});
