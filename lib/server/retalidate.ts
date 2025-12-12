import { POSTS_COUNT_PER_PAGE } from "@/constants";
import { revalidatePath, updateTag } from "next/cache";
import prisma from "../prisma";
import { getHiddenCategoryIds } from "@/lib/server/categories";

export async function revalidateHomePage(id: number) {
  const ids = await getHiddenCategoryIds();
  const firstPagePosts = await prisma.posts.findMany({
    select: {
      id: true,
    },
    where: {
      protected: false,
      posts_category_links: {
        none: {
          category_id: {
            in: ids
          }
        }
      }
    },
    take: POSTS_COUNT_PER_PAGE,
    orderBy: {
      updated_at: "desc",
    },
  });

  if (firstPagePosts.some((e) => e.id === id)) {
    console.log("should revalidate home page");
    await updateTag('posts')
    revalidatePath("/(home)", "page");
    revalidatePath("/", "page");
  }
}
