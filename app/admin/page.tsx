import { BaseButtonAction } from "@glint-ui/react";

export default async function AdminPage({ params }) {
  return (
    <main className="w-full px-8 py-4">
      <section className="flex flex-col gap-2 w-36 items-start">
        <BaseButtonAction href={"/admin/posts/create"}>
          创建文章
        </BaseButtonAction>
      </section>
    </main>
  );
}
