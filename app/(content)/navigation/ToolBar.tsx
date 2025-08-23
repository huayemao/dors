"use client";
import { BaseButton } from "@glint-ui/react";
import React from "react";
import toast from "react-hot-toast";

function deleteCache() {
  navigator.serviceWorker.getRegistration().then((r) => {
    if (!r) {
      return;
    }
    const { waiting, active } = r;
    if (waiting) {
      waiting.postMessage({ type: "skip-waiting" });
      return;
    }
    active?.postMessage({ 
      type: "revalidate-page",
      path: "/navigation"
    });
    
    navigator.serviceWorker.addEventListener("message", function(event) {
      const { type, path } = event.data;
      if (type === "revalidate-success" && path === "/navigation") {
        toast("缓存已清除！");
        window.location.reload();
      }
    });
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
