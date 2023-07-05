import prisma from "@/prisma/client";
import { cache } from "react";

// todo: 如果要能检索全部文章的话，摘要得单独拿出来，方便用来渲染文章
// 否则会导致渲染摘要时总是要取出 content，数据量过大

export const getTags = cache(async () => {
  return await Promise.all(
    await prisma.tags.findMany({
      orderBy: {
        updated_at: "desc",
      },
      include: {
        tags_posts_links: {
          include: {
            // 这里取出文章 title，用来搜索
            posts: {
              select: {
                title: true,
                updated_at: true,
                published_at: true,
              },
            },
          },
        },
      },
    })
  );
});
