"use client";
import Link from "next/link";

export default async function AdminPage({ params }) {
  return (
    <main className="w-full px-8 py-4">
      <section className="flex flex-col gap-2 w-36 items-start">
        <Link href={"/admin/posts/create"}>创建文章</Link>
        <button
          onClick={() => {
            fetch("/api/revalidate/index");
          }}
        >
          刷新索引页
        </button>
        <button
          onClick={() => {
            fetch("/api/revalidate/posts");
          }}
        >
          刷新文章详情页
        </button>
      </section>
    </main>
  );
}
