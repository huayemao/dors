// 根据 post id 查询所属 book

import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

// book 是 type 为 'book' 的特殊 post，其 toc 字段中包含 target post id
export const getBooksByPostId = unstable_cache(async (postId: number) => {
  // 查询所有 type 为 'book' 的 post
  const books = await prisma.posts.findMany({
    where: {
      // type: "book",
      toc: {
        array_contains: {id:postId}
      }
    },

  });


  return books;
}, ['get_books_by_post_id'], { tags: ['posts'] });