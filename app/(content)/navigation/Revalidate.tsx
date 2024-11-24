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

function Revalidate() {
  return (
    <BaseButton size="sm" variant="pastel" onClick={deleteCache}>
      清除缓存
    </BaseButton>
  );
}

export default Revalidate;
