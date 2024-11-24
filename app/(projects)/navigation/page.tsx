import Prose from "@/components/Base/Prose";
import prisma from "@/lib/prisma";
import { BaseCard, BaseHeading } from "@shuriken-ui/react";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";

const getNavContent = unstable_cache(
  async function () {
    const res = (
      await prisma.settings.findFirst({ where: { key: "nav_content_post_id" } })
    )?.value;

    if (!res) {
      return null;
    }

    const postId = Number(res as string[][0]);
    console.log(postId);

    const post = await prisma.posts.findFirst({
      where: {
        id: postId,
      },
    });
    return { postId, post };
  },
  ["settings", "nav_content_post_id"],
  { tags: ["settings_nav_content_post_id", "posts"] }
);

export default async function Navigation() {
  const res = await getNavContent();
  if (!res) {
    return notFound();
  }

  const cats = JSON.parse(res.post!.content!);

  return (
    <>
      <header>
        <BaseHeading as="h1" className="text-center">花野猫的导航页</BaseHeading>
      </header>
      <main className="w-full bg-white dark:bg-muted-900 max-w-full  masonry sm:masonry-sm md:masonry-md p-4">
        {cats.map((e) => {
          return (
            <BaseCard key={e.id} className="p-4 break-inside-avoid">
              <BaseHeading as="h2">{e.tags}</BaseHeading>
              <Prose content={e.content}></Prose>
            </BaseCard>
          );
        })}
      </main>
    </>
  );
}
