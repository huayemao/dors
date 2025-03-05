import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

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
    const cats = await prisma.categories.findMany({
      orderBy: {
        updated_at: "desc",
      },
      where,
    });

    return cats.map((e) => ({ ...e, hidden: ids.includes(e.id) }));
  }
  , undefined, {
  revalidate: 600,
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
  revalidate: 600,
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
  revalidate: 600,
  tags: ['cats']
});
