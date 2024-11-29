import { getTags } from "@/lib/server/tags";
import { BaseTag } from "@shuriken-ui/react";
import Link from "next/link";

export default async function TagsPage() {
  const tags = await getTags();
  return (
    <div className="flex flex-wrap gap-4 max-w-3xl mx-auto">
      {tags.map(({ name, id }) => {
        return (
          <Link
            href={`/tags/${id}`}
            key={id}
            className=""
          >
            <BaseTag variant="outline" color="primary">
            {name}
            </BaseTag>
          </Link>
        );
      })}
    </div>
  );
}
