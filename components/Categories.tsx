"use client";
import { Category } from "@/components/Category";
import { useSelectedLayoutSegments } from "next/navigation";

export function Categories({ categories }) {
  const segments = useSelectedLayoutSegments();
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
      <Category
        href={`/unCategorized`}
        name={"未分类"}
        key={9991}
        active={segments.includes("unCategorized")}
      />
    </div>
  );
}
