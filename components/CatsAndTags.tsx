import { Categories } from "@/components/Categories";
import {
  BaseButton,
  BaseButtonAction,
  BaseCard,
  BaseHeading,
  BaseTag,
} from "@shuriken-ui/react";
import Link from "next/link";
import { Tags } from "./Tags";

export function CatsAndTags({
  tags,
  simple = false,
}: {
  tags?: {
    id: number;
    tags_posts_links: { posts: { id: number; title: string | null } | null }[];
    name: string | null;
  }[];
  simple?: boolean;
}) {
  return (
    <div className="grid md:grid-cols-12 gap-6 ">
      <div className="md:col-span-5">
        <Categories />
      </div>
      <BaseCard className="p-6  max-w-3xl mx-auto md:col-span-7">
        <BaseHeading className="mb-6">
          {simple ? "精选标签" : "全部标签"}
        </BaseHeading>
        <Tags simple={simple}></Tags>
      </BaseCard>
    </div>
  );
}
