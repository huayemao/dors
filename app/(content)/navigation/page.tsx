import Prose from "@/components/Base/Prose";
import { BaseCard, BaseHeading } from "@shuriken-ui/react";
import { notFound } from "next/navigation";
import ToolBar from "./ToolBar";
import { getNavContent, parsedNavigationPage } from "@/lib/server/navigation";

export const maxDuration = 25;

export default async function Navigation() {
  const res = await getNavContent();

  if (!res) {
    return notFound();
  }

  const content = await parsedNavigationPage(JSON.parse(res.post!.content!));

  if (!res) {
    return notFound();
  }
  return (
    <>
      <main className="w-full min-h-full dark:bg-muted-900 max-w-6xl mx-auto flex-1 p-6  space-y-4">
        <BaseHeading size="3xl" as="h2">
          花野猫的导航页
        </BaseHeading>
        <div className="text-right">
          <ToolBar postId={res.postId}></ToolBar>
        </div>
        <Prose
          className="masonry sm:masonry-sm md:masonry-md mb-auto !max-w-full prose-h3:mt-0"
          content={content}
        ></Prose>
      </main>
    </>
  );
}


