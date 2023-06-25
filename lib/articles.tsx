import { POSTS_COUNT_PER_PAGE } from "@/constants";
import prisma from "@/prisma/client";
import { cache } from "react";
import { PaginateOptions } from "./paginator";
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
  async (paginationOptions: PaginateOptions = {}) => {
    const page = Number(paginationOptions?.page) || 1;
    const perPage = Number(paginationOptions?.perPage) || POSTS_COUNT_PER_PAGE;
    const skip = page > 0 ? perPage * (page - 1) : 0;

    return await Promise.all(
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
          take: perPage,
          skip,
        })
      ).map(async (e) => {
        return {
          ...e,
          content: await markdownToHtml(e.content),
          excerpt: await markdownExcerpt(e.content),
          tags: e.tags_articles_links.map((e) => e.tags),
        };
      })
    );
  }
);
