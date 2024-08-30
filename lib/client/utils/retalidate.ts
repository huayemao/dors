import { POSTS_COUNT_PER_PAGE } from "@/constants";
import { revalidatePath, revalidateTag } from "next/cache";
import prisma from "../../prisma";

export async function revalidateHomePage(id: number) {
  const firstPagePosts = await prisma.posts.findMany({
    select: {
      id: true,
    },
    take: POSTS_COUNT_PER_PAGE,
    orderBy: {
      updated_at: "desc",
    },
  });

  if (firstPagePosts.some((e) => e.id === id)) {
    console.log("should revalidate home page");
    revalidateTag('posts')
    revalidatePath("/(home)", "page");
    revalidatePath("/", "page");
  }
}
