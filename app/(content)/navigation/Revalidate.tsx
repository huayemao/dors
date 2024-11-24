"use client";
import { BaseButton } from "@shuriken-ui/react";
import React from "react";

function deleteCache() {
  caches
    .keys()
    .then((e) => {
      const s = e.map((e) => {
        if (["/navigation"].includes(e)) return caches.delete(e);
      });
      return Promise.all(s);
    })
    .then(() => {
      window.location.reload();
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
