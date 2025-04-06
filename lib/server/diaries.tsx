import { Note } from "@/app/(projects)/notes/constants";
import parseMDX from "@/lib/mdx/parseMDX";
import { unstable_cache } from "next/cache";
import { getPost, getPosts } from "./posts";

// Cache the diary posts to avoid repeated database queries
export const getDiaryPosts = unstable_cache(
  async function () {
    // Get all diary collection posts
    const posts = await getPosts({ type: "diary-collection" });
    
    // Get each post's full content
    const postsWithContent = await Promise.all(
      posts.map(async (post) => {
        const fullPost = await getPost(post.id);
        return fullPost;
      })
    );

    // Filter and sort posts by title (month)
    const sortedPosts = postsWithContent
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

// Process diary entries with optimized MDX parsing
export async function processDiaryEntries(post: Awaited<ReturnType<typeof getDiaryPosts>>[number]) {
  try {
    // Parse the notes from the post content
    const notes = JSON.parse(post.content || "[]") as Note[];
    
    // Sort notes by updatedAt in descending order
    const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt);
    
    // Process all notes in a single batch for MDX parsing
    const processedNotes = await Promise.all(
      sortedNotes.map(async (note) => {
        // Parse the MDX content
        const parsedContent = await parseMDX({ content: note.content });
        
        return {
          ...note,
          parsedContent: parsedContent.content
        };
      })
    );
    
    return {
      ...post,
      processedNotes
    };
  } catch (e) {
    console.error("Failed to process diary post:", e);
    return {
      ...post,
      processedNotes: []
    };
  }
} 