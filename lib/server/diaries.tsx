import { Note } from "@/app/(projects)/notes/constants";
import parseMDX from "@/lib/mdx/parseMDX";
import { unstable_cache } from "next/cache";
import { getPost, getPosts } from "./posts";
import prisma from "@/lib/prisma";

// Cache the diary posts to avoid repeated database queries
export const getDiaryPosts = unstable_cache(
  async function () {
    // Get all diary collection posts with their full content in a single query
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

    // Process posts to match the expected format
    const processedPosts = posts.map(post => ({
      ...post,
      tags: post.tags_posts_links.map(link => link.tags),
      category: post.posts_category_links[0]?.categories
    }));

    // Filter and sort posts by title (month)
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

// Cache for MDX parsing results to avoid redundant processing
const mdxCache = new Map<string, any>();

// Define the type for processed notes
type ProcessedNote = Note & {
  parsedContent: any;
};

// Process diary entries with optimized MDX parsing
export async function processDiaryEntries(post: Awaited<ReturnType<typeof getDiaryPosts>>[number]) {
  try {
    // Parse the notes from the post content
    const notes = JSON.parse(post.content || "[]") as Note[];
    
    // Sort notes by id(createdTime) in descending order
    const sortedNotes = notes.sort((a, b) => b.id - a.id);
    
    // Process notes in batches to avoid overwhelming the system
    const BATCH_SIZE = 5; // Process 5 notes at a time
    const processedNotes: ProcessedNote[] = [];
    
    for (let i = 0; i < sortedNotes.length; i += BATCH_SIZE) {
      const batch = sortedNotes.slice(i, i + BATCH_SIZE);
      
      // Process each batch in parallel
      const batchResults = await Promise.all(
        batch.map(async (note) => {
          // Generate a cache key based on note content and ID
          const cacheKey = `${note.id}-${note.updatedAt}`;
          
          // Check if we have a cached result
          if (mdxCache.has(cacheKey)) {
            return {
              ...note,
              parsedContent: mdxCache.get(cacheKey)
            };
          }
          
          // Parse the MDX content
          const parsedContent = await parseMDX({ content: note.content });
          
          // Cache the result
          mdxCache.set(cacheKey, parsedContent.content);
          
          return {
            ...note,
            parsedContent: parsedContent.content
          };
        })
      );
      
      // Add batch results to the processed notes
      processedNotes.push(...batchResults);
    }
    
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