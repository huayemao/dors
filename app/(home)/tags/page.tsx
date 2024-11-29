import { Categories } from "@/components/Categories";
import { getTags } from "@/lib/server/tags";
import { BaseCard, BaseHeading, BaseTag } from "@shuriken-ui/react";
import Link from "next/link";

export default async function TagsPage() {
  const tags = await getTags();
  return (
    <div className="grid md:grid-cols-6 gap-6">
      <div className="col-span-3">
        <Categories />
      </div>
      <BaseCard className="p-6  max-w-3xl mx-auto col-span-3">
        <BaseHeading className="mb-6">全部标签</BaseHeading>
        <div className="flex flex-wrap gap-4">
          {tags.map(({ name, id, tags_posts_links }) => {
            return (
              <Link href={`/tags/${id}`} key={id} className="">
                <BaseTag
                  size="sm"
                  variant="outline"
                  shadow="hover"
                  color="primary"
                >
                  {name} {`(${tags_posts_links.length})`}
                </BaseTag>
              </Link>
            );
          })}
        </div>
      </BaseCard>
    </div>
  );
}
