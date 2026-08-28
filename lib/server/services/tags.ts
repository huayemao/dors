import prisma from "@/lib/prisma";
import { getPost } from "../posts/queries";
import { unstable_cache } from "next/cache";

export const getTagIds = unstable_cache(async () => {
  return await Promise.all(
    await prisma.tags.findMany({
      orderBy: {
        updated_at: "desc",
      },
      select: {
        id: true,
      },
    })
  );
});

export const getTags = unstable_cache(async ({ protected: isProtected }: { protected?: boolean } = { protected: false }) => {
  return await Promise.all(
    await prisma.tags.findMany({
      where: {
        AND: [{
          tags_posts_links: isProtected ? {
            some: {
              posts: {
                protected: true
              }
            }
          } : {
            none: {
              posts: { protected: true }
            }
          }
        }]
      },
      orderBy: {
        tags_posts_links: {
          _count: 'desc'
        },
      },
      select: {
        id: true,
        name: true,
        tags_posts_links: {
          select: {
            posts: {
              select: {
                id: true,
                title: true
              }
            }
          }
        }
      },
    })
  );
});

export const getTagById = async (id: number) => {
  return await prisma.tags.findUnique({
    where: {
      id,
    },
  });
};

export const updatePostTags = async (
  post: Awaited<ReturnType<typeof getPost>>,
  tagIds: number[]
) => {
  if (!post) {
    throw Error("no post found");
  }
  const currentTags = post.tags.map((e) => e?.id as number);
  const tagsToAdd = tagIds.filter((e) => !currentTags.includes(e));
  const tagsToRemove = currentTags.filter((e) => !tagIds.includes(e));

  return await prisma.posts.update({
    where: {
      id: post.id,
    },
    data: {
      tags_posts_links: {
        createMany: {
          data: tagsToAdd.map((e) => ({
            tag_id: e,
          })),
        },
        deleteMany: {
          AND: {
            post_id: post.id,
            tag_id: {
              in: tagsToRemove,
            },
          },
        },
      },
    },
  });
};
