"use client";
import { Category } from "@/components/Category";
import { CategoriesContext } from "@/contexts/categories";
import { useSelectedLayoutSegments } from "next/navigation";
import { useContext } from "react";

export function Categories() {
  const segments = useSelectedLayoutSegments();
  const categories = useContext(CategoriesContext);
  const [seg, id] = segments;

  return (
    <div className="relative w-full flex justify-center gap-4 flex-wrap">
      <Category
        href={`/`}
        name={"全部"}
        key={9999}
        active={
          !segments.includes("categories") &&
          !segments.includes("unCategorized")
        }
      />
      {categories.map((cat) => (
        <Category
          href={`/categories/${cat.id}`}
          name={cat.name as string}
          key={cat.id}
          active={Number(id) === cat.id && segments.includes("categories")}
        />
      ))}
    </div>
  );
}
