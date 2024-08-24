"use client"

import { BaseButton } from "@shuriken-ui/react";

export function RevalidateButton() {
  return (
    <BaseButton
      onClick={() => {
        fetch("/api/revalidate?path=/");
        fetch("/api/revalidate?path=/(home)");
      }}
    >
      重新渲染首页
    </BaseButton>
  );
}
