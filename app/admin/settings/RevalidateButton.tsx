"use client"

import { BaseButton } from "@shuriken-ui/react";

export function RevalidateButton() {
  return (
    <div className="flex flex-col gap-4">
      <BaseButton
        onClick={() => {
          fetch("/api/revalidate?path=/");
          fetch("/api/revalidate?path=/(home)");
        }}
      >
        重新渲染首页
      </BaseButton>
      <BaseButton
        onClick={() => {
          fetch("/api/revalidate?tag=posts");
        }}
      >
        清楚文章缓存
      </BaseButton>
    </div>
  );
}
