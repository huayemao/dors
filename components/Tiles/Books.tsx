import { getPosts } from "@/lib/server/posts";
import BookTile from "./BookTile";
import { BaseHeading } from "@shuriken-ui/react";
import { useEffect, useState } from "react";

export type BookSummary = {
  id: number;
  title: string | null;
  cover_image: any;
  posts: Array<{
    id: number;
    title: string | null;
    updated_at: Date | null;
  }>;
  tags?: Array<{ id: number; name: string | null } | null>;
};

export function Books({data}:{data:BookSummary[]}) {

  if (!data.length) return null;

  return (
    <div className="space-y-4">
      <BaseHeading size="3xl" className="text-center" as="h2">
        果园（知识库）
      </BaseHeading>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((book) => (
          <BookTile
            key={book.id}
            id={book.id}
            title={book.title}
            coverImage={book.cover_image}
            posts={book.posts}
            tags={book.tags}
          />
        ))}
      </div>
    </div>
  );
} 