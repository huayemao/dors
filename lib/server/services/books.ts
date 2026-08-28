import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export const getBooksByPostId = unstable_cache(async (postId: number) => {
  const books = await prisma.posts.findMany({
    where: {
      toc: {
        array_contains: { id: postId }
      }
    },
    include: {
      tags_posts_links: {
        include: {
          tags: true,
        }
      },
    }
  });

  return books.map(book => ({
    ...book,
    tags: book.tags_posts_links.map(link => link.tags),
  }));
}, ['get_books_by_post_id'], { tags: ['posts'] });
