import Prose from "@/components/Base/Prose";
import { BaseCard, BaseHeading } from "@shuriken-ui/react";
import { notFound } from "next/navigation";
import ToolBar from "./ToolBar";
import { getNavContent, parsedNavigationPage } from "@/lib/server/navigation";
import GridItems from "./GridItems";
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
      <main className="w-full min-h-full dark:bg-muted-900 max-w-6xl xl:max-w-[88%] mx-auto flex-1 p-6  space-y-4">
        <BaseHeading size="3xl" as="h2">
          花野猫的导航页
        </BaseHeading>
        <div className="text-right">
          <ToolBar postId={res.postId}></ToolBar>
        </div>
        <GridItems content={content}></GridItems>
      </main>
    </>
  );
}

