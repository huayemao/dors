import Prose from "@/components/Base/Prose";
import prisma from "@/lib/prisma";
import { BaseCard, BaseHeading } from "@shuriken-ui/react";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import ToolBar from "./ToolBar";
import { cn } from "@/lib/utils";
import parseMDX  from "@/lib/mdx/parseMDX";

export const maxDuration = 25;

const getNavContent = unstable_cache(
  async function () {
    const res = (
      await prisma.settings.findFirst({ where: { key: "nav_content_post_id" } })
    )?.value;

    if (!res) {
      return null;
    }

    const postId = Number(res as string[][0]);

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

  const cats: any[] = JSON.parse(res.post!.content!);
  // const details = await Promise.all(
  //   cats.map(async (e) => ({
  //     ...e,
  //     content: (await parseMDX({ content: e.content })).content,
  //   }))
  // );

  return (
    <>
      <main className="w-full min-h-full dark:bg-muted-900 max-w-6xl mx-auto flex-1 p-6  space-y-4">
        <BaseHeading size="3xl" as="h2">
          花野猫的导航页
        </BaseHeading>
        <div className="text-right">
          <ToolBar postId={res.postId}></ToolBar>
        </div>
        <div className="masonry sm:masonry-sm md:masonry-md mb-auto">
          {cats.map((e, i) => {
            return (
              <BaseCard
                key={e.id}
                className={cn("my-4 p-4 break-inside-avoid", {
                  "mt-0": i === 0,
                })}
              >
                <BaseHeading as="h3" size="2xl">
                  {e.tags}
                </BaseHeading>
                <Prose content={e.content}></Prose>
              </BaseCard>
            );
          })}
        </div>
      </main>
    </>
  );
}
