import { POSTS_COUNT_PER_PAGE } from "@/constants";
import prisma, { Prisma } from "@/prisma/client";
import { cache } from "react";
import { PaginateOptions, getPrismaPaginationParams } from "./paginator";
import { PexelsPhoto } from "./types/PexelsPhoto";
import {
  getBase64Image,
  getPexelImages,
  markdownExcerpt,
  markdownToHtml,
} from "./utils";

export const getPost = cache(async (id: number) => {
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

export interface FindManyArgs {
  take?: number;
  skip?: number;
}

export const getPosts = cache(
  async (
    options: PaginateOptions & { tagId?: number; categoryId?: number } = {}
  ) => {
    return await Promise.all(
      (
        await getAllPosts(options)
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

async function getAllPosts(
  options: PaginateOptions & { tagId?: number; categoryId?: number } = {}
) {
  const { perPage, skip } = getPrismaPaginationParams(options);
  const whereInput: Prisma.Enumerable<Prisma.postsWhereInput> = [];

  if (options.tagId) {
    whereInput.push({
      tags_posts_links: {
        some: {
          tag_id: options.tagId,
        },
      },
    });
  }

  if (options.categoryId) {
    whereInput.push({
      posts_category_links: {
        some: {
          category_id: options.categoryId,
        },
      },
    });
  }

  return await prisma.posts.findMany({
    where: {
      AND: whereInput,
    },

    orderBy: {
      updated_at: "desc",
    },
    include: {
      posts_category_links: {
        include: {
          categories: true,
        },
      },
      tags_posts_links: {
        include: {
          tags: true,
        },
      },
      _count: true,
    },
    take: perPage,
    skip,
  });
}

export async function getProcessedPosts(
  posts: Awaited<ReturnType<typeof getPosts>>
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

export type Posts = Awaited<ReturnType<typeof getPosts>>;
