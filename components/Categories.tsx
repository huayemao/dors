"use client";
import { Category } from "@/components/Category";
import { useSelectedLayoutSegments } from "next/navigation";

export function Categories({ categories }) {
  const [seg, id] = useSelectedLayoutSegments();

  return (
    <div className="relative w-full flex justify-center gap-4 flex-wrap">
      <Category
        href={`/`}
        name={"全部"}
        key={9999}
        active={!id || seg !== "categories"}
      />
      {categories.map((cat) => (
        <Category
          href={`/categories/${cat.id}`}
          name={cat.name as string}
          key={cat.id}
          active={Number(id) === cat.id && seg === "categories"}
        />
      ))}
    </div>
  );
}
