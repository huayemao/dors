import prisma from "@/prisma/client";
import { cache } from "react";
import { markdownExcerpt, markdownToHtml } from "./utils";

export const getArticle = cache(
  async (id: number) =>
    await prisma.articles.findUnique({
      where: {
        id: id,
      },
    })
);

export const getArticles = cache(
  async () =>
    await Promise.all(
      (
        await prisma.articles.findMany()
      ).map(async (e) => {
        return {
          ...e,
          content: await markdownToHtml(e.content),
          excerpt: await markdownExcerpt(e.content),
        };
      })
    )
);
