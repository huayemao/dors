import { POSTS_COUNT_PER_PAGE } from "@/constants";
import prisma, { Prisma } from "@/prisma/client";
import { cache } from "react";
import { PaginateOptions, getPrismaPaginationParams } from "./paginator";
import { PexelsPhoto } from "./types/PexelsPhoto";
import {
  getBase64Image,
  getPexelImages,
  getWordCount,
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

  if (!res) {
    return null;
  }

  /* @ts-ignore */
  if (!res.cover_image?.dataURLs) {
    const imageData = await getPexelImages(1);
    // imageData.photos 有可能为空数组
    const imageJson = imageData.photos[0] as PexelsPhoto;

    const dataURLs = {
      large: await getBase64Image((imageJson as PexelsPhoto).src.large),
      small: await getBase64Image((imageJson as PexelsPhoto).src.small),
    };

    await prisma.posts.update({
      where: {
        id,
      },
      data: {
        cover_image: {
          ...imageJson,
          dataURLs,
        },
      },
    });

    /* @ts-ignore */
    res.cover_image = {
      ...imageJson,
      dataURLs,
    };
  }

  const html = await markdownToHtml(res.content);
  const wordCount = getWordCount(html);
  return {
    ...res,
    tags: res?.tags_posts_links.map((e) => e.tags),
    wordCount,
  };
});

export interface FindManyArgs {
  take?: number;
  skip?: number;
}

export const getPostIds = cache(async () => {
  return await prisma.posts.findMany({
    orderBy: {
      updated_at: "desc",
    },
    select: {
      id: true,
    },
  });
});

export const getPosts = cache(
  async (
    options: PaginateOptions & {
      tagId?: number;
      categoryId?: number;
      unCategorized?: boolean;
    } = {}
  ) => {
    return await Promise.all(
      (
        await getAllPosts(options)
      ).map(async (e) => {
        return {
          ...e,
          content: await markdownToHtml(e.content),
          excerpt: await markdownExcerpt(e.content),
          wordCount: getWordCount(e.content),
          tags: e.tags_posts_links.map((e) => e.tags),
          category: e.posts_category_links?.[0]?.categories,
        };
      })
    );
  }
);

async function getAllPosts(
  options: PaginateOptions & {
    tagId?: number;
    categoryId?: number;
    unCategorized?: boolean;
  } = {}
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

  if (options.unCategorized) {
    whereInput.push({
      posts_category_links: {
        none: {
          id: undefined,
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
  posts: Awaited<ReturnType<typeof getPosts>>,
  options?: { imageSize: "large" | "small" }
) {
  const needImageIds = posts
    /* @ts-ignore */
    .filter((e) => !e.cover_image?.dataURLs)
    .map((e) => e.id);

  let imageData: { photos: PexelsPhoto[] };

  if (needImageIds.length) {
    imageData = await getPexelImages(needImageIds.length);

    await Promise.all(
      needImageIds.map(async (id, i) => {
        const post = posts.find((e) => e.id === id) as (typeof posts)[0];

        const imageJson = imageData.photos[i] as PexelsPhoto;

        const dataURLs = {
          large: await getBase64Image((imageJson as PexelsPhoto).src.large),
          small: await getBase64Image((imageJson as PexelsPhoto).src.small),
        };

        await prisma.posts.update({
          where: {
            id,
          },
          data: {
            cover_image: {
              ...imageJson,
              dataURLs,
            },
          },
        });

        post.cover_image = {
          ...imageJson,
          dataURLs,
        };
      })
    );
  }

  posts.forEach((p) => {
    /* @ts-ignore */
    p.url = p.cover_image?.dataURLs?.[options?.imageSize || "large"];
  });

  return posts;
}

export const getPageCount = cache(
  async (perPage: number = POSTS_COUNT_PER_PAGE) => {
    const itemCount = await prisma.posts.count();
    return itemCount / (perPage || POSTS_COUNT_PER_PAGE);
  }
);

export type Posts = Awaited<ReturnType<typeof getPosts>>;
