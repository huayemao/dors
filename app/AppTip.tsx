"use client"
import { registerServiceWorker } from "@/lib/client/registerSW";
import { useEffect } from "react";

export function AppTip() {
  useEffect(() => {
    registerServiceWorker({
      onNeedRefresh(updateSW) {
        const res = confirm("有新的版本");
        if (res) {
          updateSW();
        }
      },
    });
  }, []);
  return <></>;
}
