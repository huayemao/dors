"use client";
import { Category } from "@/components/Category";
import { CategoriesContext } from "@/contexts/categories";
import { BaseCard, BaseHeading } from "@shuriken-ui/react";
import { useSelectedLayoutSegments } from "next/navigation";
import { useContext } from "react";

export function Categories() {
  const segments = useSelectedLayoutSegments() || [];
  const categories = useContext(CategoriesContext);
  const [seg, id] = segments;

  return (
    <BaseCard className="p-6  max-w-3xl mx-auto">
      <BaseHeading className="mb-6">全部分类</BaseHeading>
      <div className="relative w-full grid grid-cols-2 lg:grid-cols-3 gap-6">
        {categories
          .filter((e) => !e.hidden)
          .map((cat) => (
            <Category
              href={`/categories/${cat.id}`}
              name={cat.name as string}
              key={cat.id}
              iconName={(cat.meta as { icon: string }).icon}
              active={Number(id) === cat.id && segments.includes("categories")}
            />
          ))}
      </div>
    </BaseCard>
  );
}
