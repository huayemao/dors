import { CatsAndTags } from "@/components/CatsAndTags";
import { getTags } from "@/lib/server/tags";
import { BaseHeading } from "@glint-ui/react";
import { Metadata } from "next";

export default async function TagsPage() {
  return <section
    className="px-4 py-16 min-h-screen bg-muted-100 dark:bg-muted-800"
  >
    <div className="max-w-5xl mx-auto space-y-8">
      <BaseHeading
        as="h1"
        size="3xl"
        className="font-heading text-muted-900 dark:text-white"
      >
        分类和标签
      </BaseHeading>
      <CatsAndTags />
    </div>
  </section >
}


export const metadata: Metadata = {
  title: "分类和标签",
  description: "查看所有分类和标签",
};
