import Prose from "@/components/Base/Prose";
import prisma from "@/lib/prisma";
import { BaseCard, BaseHeading } from "@shuriken-ui/react";
import { unstable_cache } from "next/cache";
import { cn } from "@/lib/utils";
import parseMDX from "@/lib/mdx/parseMDX";

export const getNavContent = unstable_cache(
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

export async function parsedNavigationPage(items: any[]) {

  const allContent = items
    .map(
      (e, i) =>
        `\n<Container tags={"${e.tags}"} id={${e.id}} i={${i}}>\n${e.content}\n</Container>\n`
    )
    .join("\n");

  const content = (
    await parseMDX(
      { content: allContent },
      {
        components: {
          Container: (props) => (
            <BaseCard
              key={props.id}
              className={cn("my-4 p-4 break-inside-avoid", {
                "mt-0": props.i === 0,
              })}
            >
              <BaseHeading as="h3" size="2xl">
                {props.tags}
              </BaseHeading>
              {props.children}
            </BaseCard>
          ),
        },
      }
    )
  ).content;
  return content;
}
