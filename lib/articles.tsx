import prisma from "@/prisma/client";
import { cache } from "react";
import { markdownExcerpt, markdownToHtml } from "./utils";

export const getArticle = cache(async (id: number) => {
  const res = await prisma.articles.findUnique({
    where: {
      id: id,
    },
    include: {
      tags_articles_links: {
        include: {
          tags: true,
        },
      },
    },
  });

  return {
    ...res,
    tags: res?.tags_articles_links.map((e) => e.tags),
  };
});

export const getArticles = cache(
  async () =>
    await Promise.all(
      (
        await prisma.articles.findMany({
          orderBy: {
            updated_at: "desc",
          },
          include: {
            tags_articles_links: {
              include: {
                tags: true,
              },
            },
          },
        })
      ).map(async (e) => {
        return {
          ...e,
          content: await markdownToHtml(e.content),
          excerpt: await markdownExcerpt(e.content),
          tags: e.tags_articles_links.map((e) => e.tags),
        };
      })
    )
);
