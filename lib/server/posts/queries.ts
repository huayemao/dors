import { POSTS_COUNT_PER_PAGE } from "@/constants";
import prisma, { Prisma } from "@/lib/prisma";
import { getHiddenCategoryIds } from "../services/categories";
import { getPrismaPaginationParams } from "@/lib/paginator";
import { getWordCount, markdownToHtml } from "@/lib/utils";
import { unstable_cache } from "next/cache";
import { PostWithRelations, getPostOptions, PostType } from "./types";
import { randomlyUpdatePhoto } from "./cover-image";

const processPost = async (post: PostWithRelations | null) => {
  if (!post) {
    return null;
  }

  /* @ts-ignore */
  if (!post.cover_image?.dataURLs) {
    randomlyUpdatePhoto(post.id).catch((error) => {
      console.error('Failed to update cover photo in background:', error);
    });
  }

  const html = await markdownToHtml(post.content || '');
  const wordCount = getWordCount(html);

  let posts: any[] = [];

  if (post.type === "book" && post.toc) {
    const toc = post.toc as { id: number }[];
    if (toc.length > 0) {
      const tocIds = toc.map(item => item.id);
      posts = await prisma.posts.findMany({
        where: {
          id: {
            in: tocIds
          }
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

      posts = tocIds.map(id => posts.find(p => p.id === id)).filter(Boolean);
    }
  }

  return {
    ...post,
    tags: post?.tags_posts_links.map((e) => e.tags),
    wordCount,
    posts,
  };
};

export const getPost = unstable_cache(async (id: number) => {
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
  }) as PostWithRelations | null;

  return await processPost(res);
}, ['get_post'], { tags: ['posts'] });

export const getPostBySlug = unstable_cache(async (slug: string) => {
  const res = await prisma.posts.findFirst({
    where: {
      slug: slug,
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
  }) as PostWithRelations | null;

  return await processPost(res);
}, ['get_post'], { tags: ['posts'] });

export async function getPostByIdOrSlug(idOrSlug: string): Promise<ReturnType<typeof getPost> | null> {
  let post: Awaited<ReturnType<typeof getPost> | null> = null;

  if (!Number.isNaN(parseInt(idOrSlug))) {
    post = await getPost(parseInt(idOrSlug));
  } else {
    post = await getPostBySlug(idOrSlug);
  }
  return post;
}

export const getPostIds = unstable_cache(async (params?: { protected?: boolean; type?: PostType; }) => {
  return await prisma.posts.findMany({
    orderBy: {
      updated_at: "desc",
    },
    where: {
      protected: params?.protected,
      type: params?.type,
    },
    select: {
      id: true,
    },
  });
});

export const getPosts = unstable_cache(async (options: getPostOptions = { type: 'normal' }) => {
  const posts = await getAllPosts(options);

  if (options.type === 'book') {
    const allTocIdsSet = new Set<number>();
    posts.forEach((post) => {
      const toc = (post as any).toc as { id: number }[] | undefined;
      if (Array.isArray(toc)) {
        toc.forEach((item) => {
          if (item?.id) allTocIdsSet.add(item.id);
        });
      }
    });

    const allTocIds = Array.from(allTocIdsSet);
    let fetchedPosts: Array<{
      id: number;
      title: string | null;
      updated_at: Date | null;
    }> = [];

    if (allTocIds.length > 0) {
      fetchedPosts = await prisma.posts.findMany({
        where: {
          id: {
            in: allTocIds,
          },
        },
        select: {
          id: true,
          title: true,
          updated_at: true,
        },
        orderBy: {
          created_at: 'asc',
        },
      });
    }

    const postsMap = new Map(fetchedPosts.map((p) => [p.id, p]));

    return posts.map((post) => {
      const toc = (post as any).toc as { id: number }[] | undefined;
      let containedPosts: Array<{
        id: number;
        title: string | null;
        updated_at: Date | null;
      }> = [];

      if (Array.isArray(toc)) {
        containedPosts = toc
          .map((item) => postsMap.get(item.id))
          .filter((p): p is NonNullable<typeof p> => Boolean(p));
      }

      return {
        ...post,
        posts: containedPosts,
        tags: post.tags_posts_links.map((e) => e.tags),
      };
    });
  }

  return posts.map((e) => {
    return {
      ...e,
      tags: e.tags_posts_links.map((e) => e.tags),
      category: e.posts_category_links?.[0]?.categories,
    };
  });
}, ['all-posts'], {
  tags: ['posts']
});

export async function getFeaturedPostIds() {
  const res = await prisma.settings.findUnique({
    where: {
      key: "feature_posts",
    },
  });

  if (typeof res?.value === 'string') {
    res.value = JSON.parse(res.value);
  }
  const postIds = res?.value || [];

  return postIds as number[];
}

async function getAllPosts(options: getPostOptions = {}) {
  const featurePosts = await getFeaturedPostIds();
  const { take, skip } = getPrismaPaginationParams(options);
  const whereInput: Prisma.Enumerable<Prisma.postsWhereInput> =
    await getWhereInput(options);

  const res = await prisma.posts.findMany({
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
    select: {
      id: true,
      title: true,
      meta: true,
      excerpt: true,
      cover_image: true,
      created_at: true,
      updated_at: true,
      type: true,
      toc: true,
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
    take: take,
    skip,
  });
  return res;
}

export type ProcessedPost = Awaited<ReturnType<typeof getPosts>>[0] & {
  url: string;
  blurDataURL: string;
};

async function getWhereInput(options: getPostOptions) {
  const whereInput: Prisma.Enumerable<Prisma.postsWhereInput> = [];

  if (options.type) {
    whereInput.push({
      type: options.type
    });
  }

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
        none: {},
      },
    });
  }

  if (!options.includeHiddenCategories) {
    const ids = await getHiddenCategoryIds();
    whereInput.push({
      posts_category_links: {
        none: {
          category_id: {
            in: ids,
          },
        },
      },
    });
  }

  if (options.search) {
    whereInput.push({
      OR: [
        { title: { contains: options.search} },
        { content: { contains: options.search} },
        { excerpt: { contains: options.search} },
      ],
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
  const postsWithImageURLs = posts.map((p) => {
    return {
      ...p,
      url:
        /* @ts-ignore */
        p.cover_image?.src?.[options?.imageSize || "large"] ||
        /* @ts-ignore */
        p.cover_image?.dataURLs?.[options?.imageSize],
      /* @ts-ignore */
      blurDataURL: p.cover_image?.dataURLs?.blur,
    };
  });

  return postsWithImageURLs;
}

export const getPageCount = unstable_cache(
  async (options: Omit<getPostOptions, "page"> = {}) => {
    const whereInputArr = await getWhereInput(options);

    const where = whereInputArr.reduce((acc, item) => {
      return Object.assign(item, acc);
    }, {});

    const itemCount: number = await prisma.posts.count({ where: where });
    return Math.ceil(
      itemCount / (Number(options.perPage) || POSTS_COUNT_PER_PAGE)
    );
  }
);

export type Posts = Awaited<ReturnType<typeof getProcessedPosts>>;

export async function getRecentPosts(options: getPostOptions = {}) {
  let posts = await getProcessedPosts(
    await getPosts({ perPage: 5, protected: false, type: 'normal', ...options }),
    {
      imageSize: "small",
    }
  );
  return posts;
}

export async function getRelatedPosts(
  currentPost: Awaited<ReturnType<typeof getPost>>,
  options: { limit?: number } = {}
): Promise<any[]> {
  const limit = options.limit || 5;

  if (!currentPost) {
    return await getRecentPosts({ protected: false, perPage: limit });
  }

  if (currentPost.type === "book" && currentPost.posts) {
    return currentPost.posts.map((p: any) => ({
      ...p,
      url: p.cover_image?.src?.small || p.cover_image?.dataURLs?.small,
      blurDataURL: p.cover_image?.dataURLs?.blur,
      tags: p.tags_posts_links?.map((e: any) => e.tags) || [],
    }));
  }

  const currentTagIds = currentPost.tags?.map(tag => tag?.id).filter((id): id is number => id !== null && id !== undefined) || [];
  const currentCategoryId = currentPost.posts_category_links?.[0]?.categories?.id;

  let relatedPosts: any[] = [];

  if (currentTagIds.length > 0) {
    const postsWithTags = await prisma.posts.findMany({
      where: {
        AND: [
          { protected: currentPost.protected, type: currentPost.type },
          { id: { not: currentPost.id } },
          {
            tags_posts_links: {
              some: {
                tag_id: { in: currentTagIds }
              }
            }
          }
        ]
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
      orderBy: {
        updated_at: "desc",
      },
      take: limit * 3,
    });

    const postsWithScores = postsWithTags.map(post => {
      let score = 0;
      const postTagIds = post.tags_posts_links?.map(link => link.tags?.id).filter((id): id is number => id !== null && id !== undefined) || [];
      const tagMatches = currentTagIds.filter(id => postTagIds.includes(id));
      score += tagMatches.length * 20;

      const postCategoryId = post.posts_category_links?.[0]?.categories?.id;
      if (currentCategoryId && postCategoryId === currentCategoryId) {
        score += 10;
      }

      const daysSinceUpdate = post.updated_at ?
        (Date.now() - new Date(post.updated_at).getTime()) / (1000 * 60 * 60 * 24) : 0;
      score += Math.max(0, 15 - daysSinceUpdate * 0.2);

      return {
        ...post,
        tags: post.tags_posts_links?.map(link => link.tags) || [],
        _relevanceScore: score
      };
    });

    relatedPosts = postsWithScores
      .sort((a, b) => (b._relevanceScore || 0) - (a._relevanceScore || 0))
      .slice(0, limit);
  } else if (currentCategoryId) {
    const postsWithCategory = await prisma.posts.findMany({
      where: {
        AND: [
          { protected: currentPost.protected, type: currentPost.type },
          { id: { not: currentPost.id } },
          {
            posts_category_links: {
              some: {
                category_id: currentCategoryId
              }
            }
          }
        ]
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
      orderBy: {
        updated_at: "desc",
      },
      take: limit,
    });

    relatedPosts = postsWithCategory.map(post => ({
      ...post,
      tags: post.tags_posts_links?.map(link => link.tags) || [],
    }));
  }

  if (relatedPosts.length < limit) {
    const recentPosts = await prisma.posts.findMany({
      where: {
        AND: [
          { protected: currentPost.protected, type: currentPost.type },
          { id: { not: currentPost.id } }
        ]
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
      orderBy: {
        updated_at: "desc",
      },
      take: limit * 2,
    });

    const existingIds = new Set(relatedPosts.map(p => p.id));
    const additionalPosts = recentPosts
      .filter(p => !existingIds.has(p.id))
      .map(post => ({
        ...post,
        tags: post.tags_posts_links?.map(link => link.tags) || [],
      }))
      .slice(0, limit - relatedPosts.length);

    relatedPosts.push(...additionalPosts);
  }

  return relatedPosts.map(post => ({
    ...post,
    url: (post.cover_image as any)?.src?.small || (post.cover_image as any)?.dataURLs?.small,
    blurDataURL: (post.cover_image as any)?.dataURLs?.blur,
  }));
}
