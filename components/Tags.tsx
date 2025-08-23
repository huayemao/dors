"use client";
import { TagsContext } from "@/contexts/tags";
import { useContext } from "react";
import {
  BaseButton,
  BaseButtonAction,
  BaseCard,
  BaseHeading,
  BaseTag,
} from "@glint-ui/react";
import Link from "next/link";

export function Tags({ simple }: { simple: boolean }) {
  const tags = useContext(TagsContext);
  return (
    <div className="flex flex-wrap gap-4">
      {tags
        .slice(0, simple ? 10 : undefined)
        .map(({ name, id, tags_posts_links }) => {
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
      {simple && (
        <BaseButtonAction href="/tags" color="primary">
          更多
        </BaseButtonAction>
      )}
    </div>
  );
}
