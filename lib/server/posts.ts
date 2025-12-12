import { POSTS_COUNT_PER_PAGE } from "@/constants";
import prisma, { Prisma, tags } from "@/lib/prisma";
import { getHiddenCategoryIds } from "./categories";
import { PaginateOptions, getPrismaPaginationParams } from "../paginator";
import { getBlurImage, getImageBuffer, getSmallImage } from "./image";
import { updatePostTags } from "./tags";
import { PexelsPhoto } from "../types/PexelsPhoto";
import { getPexelImages, getWordCount, isDataURL, markdownToHtml } from "../utils";
import { unstable_cache } from "next/cache";

type PostWithRelations = Prisma.postsGetPayload<{
  include: {
    posts_category_links: {
      include: {
        categories: true;
      };
    };
    tags_posts_links: {
      include: {
        tags: true;
      };
    };
  };
}> & {
  toc?: Prisma.JsonValue;
};

// 添加 Prisma 类型扩展
declare global {
  namespace Prisma {
    interface postsCreateInput {
      toc?: { id: number }[];
    }
    interface postsUpdateInput {
      toc?: { id: number }[];
    }
  }
}

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

  // 如果是书籍类型，获取包含的文章
  let posts: any[] = [];

  if (res.type === "book" && res.toc) {
    const toc = res.toc as { id: number }[];
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

      posts = tocIds.map(id => posts.find(post => post.id === id)).filter(Boolean);
    }
  }

  return {
    ...res,
    tags: res?.tags_posts_links.map((e) => e.tags),
    wordCount,
    posts,
  };
},
  ['get_post'], {
  tags: ['posts']
}
);

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
  });

  if (!res) {
    return null;
  }

  return {
    ...res,
    tags: res?.tags_posts_links.map((e) => e.tags),
  };
},
  ['get_post'], {
  tags: ['posts']
}
);

export interface FindManyArgs {
  take?: number;
  skip?: number;
}

export const getPostIds = unstable_cache(async (params?: { protected?: boolean, type?: PostType; }) => {
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

// 根据 post id 查询所属 book
// book 是 type 为 'book' 的特殊 post，其 toc 字段中包含 target post id
export const getBookByPostId = unstable_cache(async (postId: number) => {
  // 查询所有 type 为 'book' 的 post
  const books = await prisma.posts.findMany({
    where: {
      // type: "book",
      toc: {
        array_contains: {id:postId}
      }
    },

  });


  return books?.[0] || null;
}, ['get_book_by_post_id'], { tags: ['posts'] });

type PostType = "collection" | "normal" | "diary-collection" | "page" | "book"

type getPostOptions = PaginateOptions & {
  tagId?: number;
  categoryId?: number;
  unCategorized?: boolean;
  protected?: boolean;
  includeHiddenCategories?: boolean;
  type?: PostType;
};

export const getPosts = unstable_cache(async (options: getPostOptions = { type: 'normal' }) => {
  const posts = await getAllPosts(options);

  // 如果是书籍类型，获取每本书包含的文章
  if (options.type === 'book') {
    const postsWithBooks = await Promise.all(
      posts.map(async (post) => {
        const toc = (post as any).toc as { id: number }[] | undefined;
        let containedPosts: Array<{
          id: number;
          title: string | null;
          updated_at: Date | null;
        }> = [];

        if (toc) {
          const tocIds = toc.map(item => item.id)

          containedPosts = await prisma.posts.findMany({
            where: {
              id: {
                in: tocIds
              }
            },
            select: {
              id: true,
              title: true,
              updated_at: true,
            },
            orderBy: {
              created_at: 'asc'
            }
          });
          containedPosts = tocIds.map(id => containedPosts.find(post => post.id === id)).filter(Boolean) as typeof posts;
        }
        return {
          ...post,
          posts: containedPosts,
          tags: post.tags_posts_links.map((e) => e.tags),
        };
      })
    );
    return postsWithBooks;
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


async function randomlyUpdatePhoto(id: number) {
  const cover_image = await buildRandomCoverImage();

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

export async function buildRandomCoverImage() {
  const imageData = await getPexelImages(1);
  // imageData.photos 有可能为空数组
  const imageJson = imageData.photos[0] as PexelsPhoto;
  return { ...imageJson, ...(await buildCoverImage(imageJson.src.large)) };
}

export async function getFeaturedPostIds() {
  const res = await prisma.settings.findUnique({
    where: {
      key: "feature_posts",
    },
  });

  if (typeof res?.value === 'string') {
    res.value = JSON.parse(res.value)
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

type ProcessedPost = Awaited<ReturnType<typeof getPosts>>[0] & {
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
        none: {
          id: undefined,
        },
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

type PostPayload = {
  type?: string,
  tags?: string[];
  id: string;
  content?: string;
  excerpt?: string;
  title?: string;
  changePhoto?: string;
  isProtected?: boolean;
  updated_at?: string;
  created_at?: string;
  categoryId?: string;
  cover_image_url?: string;
  slug?: string;
  toc?: string[];
  meta?: any;
};

type CreatePostPayload = Omit<PostPayload, "id">;

export async function updatePost(
  post: Awaited<ReturnType<typeof getPost>>,
  params: PostPayload
) {
  const {
    id,
    content,
    excerpt,
    title,
    categoryId,
    tags,
    isProtected,
    type,
    slug,
    updated_at,
    created_at,
    changePhoto,
    cover_image_url,
    toc,
    meta,
  } = params;

  const postTagNames = post?.tags.map((e) => e?.name) as string[];

  if (tags && tags.sort().toString() !== postTagNames.sort().toString()) {
    const existedTags = await prisma.tags.findMany({
      where: {
        name: {
          in: tags as string[],
        },
      },
    });

    const tagsIds = await addTags(tags, existedTags);
    await updatePostTags(post, tagsIds);
  }

  const shouldChangeCoverImage =
    // 没有 dataURLs?.blur 的，说明是之前的，
    cover_image_url || !(post?.cover_image as any).dataURLs?.blur;

  const coverImage = shouldChangeCoverImage
    ? await buildCoverImage(
      cover_image_url || (post?.cover_image as any).src.large
    )
    : undefined;

  const res = await prisma.posts.update({
    where: {
      id: parseInt(id as string),
    },
    data: {
      type,
      slug: slug || undefined,
      protected: isProtected,
      excerpt: typeof excerpt == "string" ? (excerpt as string) : undefined,
      content: content ? (content as string) : undefined,
      title: title ? (title as string) : undefined,
      cover_image:
        changePhoto === "on" ? await buildRandomCoverImage() : coverImage,
      updated_at: updated_at ? new Date(updated_at as string) : new Date(),
      created_at: created_at ? new Date(created_at as string) : undefined,
      toc: toc?.map(e => ({ id: Number(e) })) || undefined,
      meta: meta || undefined,
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

async function buildCoverImage(url: string) {
  return await (async () => {
    const buffer = await getImageBuffer(url);
    return {
      src: {
        large: url,
      },
      dataURLs: {
        blur: await getBlurImage(buffer),
        small: isDataURL(url) ? url : await getSmallImage(buffer),
      },
    };
  })();
}

export async function createPost(params: CreatePostPayload) {
  const { content, excerpt, title, categoryId, tags, isProtected, type, toc } = params;

  let coverImage: any;

  const images = content!.match(/!\[([^\]]+)\]\(([^)]+)\)/g);

  if (images) {
    const urlRegex =
      /(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?/;
    const url = images[0].match(urlRegex)?.[0];
    if (url) {
      coverImage = await buildCoverImage(url);
    } else {
      coverImage = await buildRandomCoverImage();
    }
  }

  const post = await prisma.posts.create({
    data: {
      type,
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
      cover_image: coverImage,
      protected: isProtected,
      toc: toc?.map(e => ({ id: Number(e) })) || undefined,
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

export async function getRelatedPosts(
  currentPost: Awaited<ReturnType<typeof getPost>>,
  options: { limit?: number } = {}
): Promise<any[]> {
  const limit = options.limit || 5;

  if (!currentPost) {
    return await getRecentPosts({ protected: false, perPage: limit });
  }

  // 如果是 book 类型，返回 book 中包含的文章
  if (currentPost.type === "book" && currentPost.posts) {
    return currentPost.posts.map((p: any) => ({
      ...p,
      url: p.cover_image?.src?.small || p.cover_image?.dataURLs?.small,
      blurDataURL: p.cover_image?.dataURLs?.blur,
      tags: p.tags_posts_links?.map((e: any) => e.tags) || [],
    }));
  }

  // 获取当前文章的标签和分类
  const currentTagIds = currentPost.tags?.map(tag => tag?.id).filter((id): id is number => id !== null && id !== undefined) || [];
  const currentCategoryId = currentPost.posts_category_links?.[0]?.categories?.id;

  let relatedPosts: any[] = [];

  // 如果有标签，按标签匹配查询
  if (currentTagIds.length > 0) {
    // 查询所有有相同标签的文章
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
      take: limit * 3, // 获取更多结果用于排序
    });

    // 计算每个文章的匹配分数
    const postsWithScores = postsWithTags.map(post => {
      let score = 0;

      // 标签匹配分数：匹配的标签越多分数越高
      const postTagIds = post.tags_posts_links?.map(link => link.tags?.id).filter((id): id is number => id !== null && id !== undefined) || [];
      const tagMatches = currentTagIds.filter(id => postTagIds.includes(id));
      score += tagMatches.length * 20; // 每个匹配标签加20分

      // 分类匹配分数
      const postCategoryId = post.posts_category_links?.[0]?.categories?.id;
      if (currentCategoryId && postCategoryId === currentCategoryId) {
        score += 10; // 分类匹配加10分
      }

      // 时间衰减分数（越新的文章分数越高）
      const daysSinceUpdate = post.updated_at ?
        (Date.now() - new Date(post.updated_at).getTime()) / (1000 * 60 * 60 * 24) : 0;
      score += Math.max(0, 15 - daysSinceUpdate * 0.2); // 每天衰减0.2分，最低0分

      return {
        ...post,
        tags: post.tags_posts_links?.map(link => link.tags) || [],
        _relevanceScore: score
      };
    });

    // 按相关性分数排序，取前limit个
    relatedPosts = postsWithScores
      .sort((a, b) => (b._relevanceScore || 0) - (a._relevanceScore || 0))
      .slice(0, limit);
  }
  // 如果有分类且没有标签，按分类查询
  else if (currentCategoryId) {
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

  // 如果相关文章不足，补充最近文章
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

  // 处理图片URL
  return relatedPosts.map(post => ({
    ...post,
    url: (post.cover_image as any)?.src?.small || (post.cover_image as any)?.dataURLs?.small,
    blurDataURL: (post.cover_image as any)?.dataURLs?.blur,
  }));
}
