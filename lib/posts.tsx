import { POSTS_COUNT_PER_PAGE } from "@/constants";
import prisma from "@/prisma/client";
import { cache } from "react";
import { PaginateOptions } from "./paginator";
import { PexelsPhoto } from "./types/PexelsPhoto";
import {
  getBase64Image,
  getPexelImages,
  markdownExcerpt,
  markdownToHtml,
} from "./utils";

export const getArticle = cache(async (id: number) => {
  const res = await prisma.posts.findUnique({
    where: {
      id: id,
    },
    include: {
      tags_posts_links: {
        include: {
          tags: true,
        },
      },
    },
  });

  return {
    ...res,
    tags: res?.tags_posts_links.map((e) => e.tags),
  };
});

export const getArticles = cache(
  async (options: PaginateOptions & { tagId?: number } = {}) => {
    const page = Number(options?.page) || 1;
    const perPage = Number(options?.perPage) || POSTS_COUNT_PER_PAGE;
    const skip = page > 0 ? perPage * (page - 1) : 0;

    return await Promise.all(
      (
        await prisma.posts.findMany({
          where: options.tagId
            ? {
                tags_posts_links: {
                  some: {
                    tag_id: options.tagId,
                  },
                },
              }
            : undefined,
          orderBy: {
            updated_at: "desc",
          },
          include: {
            tags_posts_links: {
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
          tags: e.tags_posts_links.map((e) => e.tags),
        };
      })
    );
  }
);

export async function getProcessedArticles(
  posts: Awaited<ReturnType<typeof getArticles>>
) {
  const needImageIds = posts.filter((e) => !e.cover_image).map((e) => e.id);

  let imageData;

  if (needImageIds.length) {
    imageData = await getPexelImages(posts.length);
  }

  for (const i in posts) {
    const a = posts[i];

    if (needImageIds.includes(a.id)) {
      await prisma.posts.update({
        where: {
          id: a.id,
        },
        data: {
          cover_image: imageData.photos[i],
        },
      });

      a.cover_image = imageData.photos[i];
    }

    // @ts-ignore
    posts[i].url = await getBase64Image(
      (a.cover_image as PexelsPhoto).src.large
    );
  }

  return posts;
}

export const getPageCount = cache(
  async (perPage: number = POSTS_COUNT_PER_PAGE) => {
    const itemCount = await prisma.posts.count();
    return itemCount / (perPage || POSTS_COUNT_PER_PAGE);
  }
);
