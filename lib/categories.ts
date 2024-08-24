import prisma from "@/lib/prisma";
import { cache } from "react";

export const getAllCategories = cache(
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
);

export const getHiddenCategoryIds = cache(async () => {
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
});

export const getHiddenCategories = cache(async () => {
  const ids = await getHiddenCategoryIds();
  return await prisma.categories.findMany({
    orderBy: {
      updated_at: "desc",
    },
    where: { id: { in: ids } },
  });
});
