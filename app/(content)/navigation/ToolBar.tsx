"use client";
import { BaseButton } from "@shuriken-ui/react";
import React from "react";

function deleteCache() {
  navigator.serviceWorker.getRegistration().then((r) => {
    if (!r) {
      return;
    }
    const { waiting, active } = r;
    if (waiting) {
      waiting.postMessage("skip-waiting");
      return;
    }
    active?.postMessage("revalidate-navigation-page");
  });
}

function ToolBar({ postId }) {
  return (
    <div className="flex gap-2 justify-end items-center">
      <BaseButton size="sm" variant="pastel" onClick={deleteCache}>
        清除缓存
      </BaseButton>
      <BaseButton size="sm" variant="pastel" href={"/notes/" + postId}>
        编辑
      </BaseButton>
    </div>
  );
}

export default ToolBar;
