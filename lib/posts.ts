import { POSTS_COUNT_PER_PAGE } from "@/constants";
import prisma, { Prisma, tags } from "@/lib/prisma";
import { getPlaiceholder } from "plaiceholder";
import { cache } from "react";
import { PaginateOptions, getPrismaPaginationParams } from "./paginator";
import { updatePostTags } from "./tags";
import { PexelsPhoto } from "./types/PexelsPhoto";
import { getPexelImages, getWordCount, markdownToHtml } from "./utils";

async function getBase64Image(url) {
  const buffer = await fetch(url).then(async (res) =>
    Buffer.from(await res.arrayBuffer())
  );

  const { base64 } = await getPlaiceholder(buffer);
  return base64;
}

export const getPost = cache(async (id: number) => {
  const res = await prisma.posts.findUnique({
    where: {
      id: id,
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
    },
  });

  if (!res) {
    return null;
  }

  /* @ts-ignore */
  if (!res.cover_image?.dataURLs) {
    const cover_image = await randomlyUpdatePhoto(id);
    res.cover_image = cover_image;
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

export const getPostIds = cache(async (params?: { protected?: boolean }) => {
  return await prisma.posts.findMany({
    orderBy: {
      updated_at: "desc",
    },
    where: {
      protected: params?.protected,
    },
    select: {
      id: true,
    },
  });
});

type getPostOptions = PaginateOptions & {
  tagId?: number;
  categoryId?: number;
  unCategorized?: boolean;
  protected?: boolean;
};

export const getPosts = cache(async (options: getPostOptions = {}) => {
  return await Promise.all(
    (
      await getAllPosts(options)
    ).map(async (e) => {
      return {
        ...e,
        content: await markdownToHtml(e.content),
        wordCount: getWordCount(e.content),
        tags: e.tags_posts_links.map((e) => e.tags),
        category: e.posts_category_links?.[0]?.categories,
      };
    })
  );
});

async function randomlyUpdatePhoto(id: number) {
  const cover_image = await getRandomPhoto();

  await prisma.posts.update({
    where: {
      id,
    },
    data: {
      cover_image,
    },
  });
  return cover_image;
}

export async function getRandomPhoto() {
  const imageData = await getPexelImages(1);
  // imageData.photos 有可能为空数组
  const imageJson = imageData.photos[0] as PexelsPhoto;

  const dataURLs = {
    large: await getBase64Image((imageJson as PexelsPhoto).src.large),
    small: await getBase64Image((imageJson as PexelsPhoto).src.small),
  };

  const cover_image = {
    ...imageJson,
    dataURLs,
  };
  return cover_image;
}

export async function getFeaturedPostIds() {
  const res = await prisma.settings.findUnique({
    where: {
      key: "feature_posts",
    },
  });

  const postIds = res ? JSON.parse(res?.value || "") : [];
  return postIds;
}

async function getAllPosts(options: getPostOptions = {}) {
  const featurePosts = await getFeaturedPostIds();
  const { perPage, skip } = getPrismaPaginationParams(options);
  const whereInput: Prisma.Enumerable<Prisma.postsWhereInput> =
    getWhereInput(options);

  return await prisma.posts.findMany({
    where: {
      AND: whereInput,
      NOT: {
        id: {
          in: featurePosts,
        },
      },
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

type ProcessedPost = Awaited<ReturnType<typeof getPosts>>[0] & {
  url: string;
  blurDataURL: string;
};

function getWhereInput(options: getPostOptions) {
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

  whereInput.push({
    protected: options.protected,
  });
  return whereInput;
}

export async function getProcessedPosts(
  posts: Awaited<ReturnType<typeof getPosts>>,
  options?: { imageSize: "large" | "small" }
): Promise<ProcessedPost[]> {
  const needImageIds = posts
    /* @ts-ignore */
    .filter(
      (e) =>
        /* @ts-ignore */
        !e.cover_image?.dataURLs ||
        /* @ts-ignore */
        e.cover_image?.dataURLs.large?.length > 10000
    )
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

  const postsWithImageURLs = posts.map((p) => {
    return {
      ...p,
      /* @ts-ignore */
      url: p.cover_image?.src?.[options?.imageSize || "large"],
      /* @ts-ignore */
      blurDataURL: p.cover_image?.dataURLs?.[options?.imageSize || "large"],
    };
  });

  return postsWithImageURLs;
}

export const getPageCount = cache(
  async (options: Omit<getPostOptions, "page"> = {}) => {
    const whereInputArr = getWhereInput(options);

    const where = whereInputArr.reduce((acc, item) => {
      return Object.assign(item, acc);
    }, {});

    const itemCount = await prisma.posts.count({ where: where });
    return Math.ceil(
      itemCount / (Number(options.perPage) || POSTS_COUNT_PER_PAGE)
    );
  }
);

export type Posts = Awaited<ReturnType<typeof getProcessedPosts>>;

export async function getRecentPosts() {
  let posts = await getProcessedPosts(await getPosts({ perPage: 5 }), {
    imageSize: "small",
  });
  return posts;
}

export async function updatePost(
  post: Awaited<ReturnType<typeof getPost>>,
  params: {
    tags: string[] | undefined;
    id: string | undefined;
    content: string | undefined;
    excerpt: string | undefined;
    title: string | undefined;
    changePhoto: string | undefined;
    isProtected: boolean;
    updated_at: string | undefined;
    created_at: string | undefined;
    categoryId: string | undefined;
  }
) {
  const postTagNames = post?.tags.map((e) => e?.name) as string[];

  const {
    tags,
    id,
    content,
    excerpt,
    title,
    changePhoto,
    isProtected,
    updated_at,
    created_at,
    categoryId,
  } = params;

  if (tags && tags.sort().toString() !== postTagNames.sort().toString()) {
    const existedTags = await prisma.tags.findMany({
      where: {
        name: {
          in: tags as string[],
        },
      },
    });

    const tagsIds = await addTags(tags, existedTags);

    updatePostTags(post, tagsIds);
  }
  // await prisma.tags.find; tags 也必须要查？或者如果对比结果相同就不用查
  // todo: 应该有 diff 的
  const res = await prisma.posts.update({
    where: {
      id: parseInt(id as string),
    },
    data: {
      protected: isProtected,
      excerpt: excerpt ? (excerpt as string) : undefined,
      content: content ? (content as string) : undefined,
      title: title ? (title as string) : undefined,
      cover_image: changePhoto === "on" ? await getRandomPhoto() : undefined,
      updated_at: updated_at ? new Date(updated_at as string) : new Date(),
      created_at: created_at ? new Date(created_at as string) : undefined,
      tags_posts_links: {},
      posts_category_links: categoryId
        ? {
            deleteMany: { post_id: parseInt(id as string) },
            create: {
              category_id: parseInt(categoryId as string),
            },
          }
        : undefined,
    },
  });

  return res;
}

export async function createPost(
  content: string,
  excerpt?: string,
  title?: string,
  categoryId?: string,
  tags?: string[]
) {
  const post = await prisma.posts.create({
    data: {
      excerpt: excerpt as string,
      content: content as string,
      title: title as string,
      created_at: new Date(),
      updated_at: new Date(),
      posts_category_links: {
        create: {
          category_id: parseInt(categoryId as string),
        },
      },
    },
  });

  if (tags?.length) {
    const existedTags = await prisma.tags.findMany({
      where: {
        name: {
          in: tags as string[],
        },
      },
    });

    const tagsIds = await addTags(tags, existedTags);
    await updatePostTags(await getPost(post.id), tagsIds);
  }
  return post;
}
async function addTags(tags: string[], existedTags: tags[]) {
  const tagsToAdd = tags.filter(
    (t) => !existedTags.map((e) => e.name).includes(t as string)
  );

  await prisma.tags.createMany({
    data: tagsToAdd.map((t) => ({
      name: t as string,
    })),
  });

  const tagsIds = (
    await prisma.tags.findMany({
      where: {
        name: {
          in: tags as string[],
        },
      },
      select: {
        id: true,
      },
    })
  ).map((e) => e.id);
  return tagsIds;
}
