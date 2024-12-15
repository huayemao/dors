"use client";

import { Table } from "@/app/(content)/data-process/Table";
import { ClientOnly } from "@/components/ClientOnly";
import { useRouter } from "next/navigation";

export function PostsTable({ posts }: { posts }) {
  const router = useRouter();
  return (
    <div className="rounded shadow shadow-primary-100">
      <ClientOnly>
        <Table
          actions={[
            {
              title: "编辑",
              onClick: (post) => {
                router.push("/admin/posts/" + post.id);
              },
            },
          ]}
          canEdit
          data={posts.map((e) => {
            const { id, title, excerpt, created_at, updated_at, cover_image } =
              e;
            return {
              id,
              cover_image:
                (cover_image as any)?.src?.small ||
                (cover_image as any)?.dataURLs?.small,
              title,
              excerpt,
              created_at:
                typeof created_at === "string"
                  ? new Date(created_at)
                  : created_at,
              updated_at,
            };
          })}
        />
      </ClientOnly>
    </div>
  );
}
