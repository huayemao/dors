import prisma from "@/lib/prisma";
import { getPost } from "../posts";
import { unstable_cache } from "next/cache";

// todo: 如果要能检索全部文章的话，摘要得单独拿出来，方便用来渲染文章
// 否则会导致渲染摘要时总是要取出 content，数据量过大

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

export const getTags = unstable_cache(async () => {
  return await Promise.all(
    await prisma.tags.findMany({
      orderBy: {
        updated_at: "desc",
      },
      select: {
        id: true,
        name: true,
      },
    })
  );
});

// 只支持已创建的，如果有新增的，用单独的方法创建
export const updatePostTags = async (
  post: Awaited<ReturnType<typeof getPost>>,
  tagIds: number[]
) => {
  if (!post) {
    throw Error("no post found");
  }
  const currentTags = post.tags.map((e) => e?.id as number);
  // todo: 是不是可以用 difference https://lodash.com/docs/4.17.15#difference
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
