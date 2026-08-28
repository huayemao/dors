import { Note } from "@/app/(projects)/notes/constants";
import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";

export const getDiaryPosts = unstable_cache(
  async function () {
    const posts = await prisma.posts.findMany({
      where: {
        type: "diary-collection"
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
        updated_at: "desc"
      }
    });

    const processedPosts = posts.map(post => ({
      ...post,
      tags: post.tags_posts_links.map(link => link.tags),
      category: post.posts_category_links[0]?.categories
    }));

    const sortedPosts = processedPosts
      .filter((post): post is NonNullable<typeof post> & { title: string } => 
        post !== null && 
        post.title !== null && 
        typeof post.title === 'string'
      )
      .sort((a, b) => {
        const dateA = new Date(a.title.replace(/年|月/g, '-'));
        const dateB = new Date(b.title.replace(/年|月/g, '-'));
        return dateB.getTime() - dateA.getTime();
      });

    return sortedPosts;
  },
  ["diary-posts"],
  { tags: ["diary-posts"] }
);

export async function processDiaryEntries(post: Awaited<ReturnType<typeof getDiaryPosts>>[number]) {
  try {
    const notes = JSON.parse(post.content || "[]") as Note[];
    const sortedNotes = notes.sort((a, b) => b.id - a.id);
    
    return {
      ...post,
      processedNotes: sortedNotes
    };
  } catch (e) {
    console.error("Failed to process diary post:", e);
    return {
      ...post,
      processedNotes: []
    };
  }
}
