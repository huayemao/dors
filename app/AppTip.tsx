"use client"
import { registerServiceWorker } from "@/lib/client/registerSW";
import { useEffect } from "react";

export function AppTip() {
  useEffect(() => {
    registerServiceWorker({
      onNeedRefresh(updateSW) {
        const res = confirm("An app update is available");
        if (res) {
          updateSW();
        }
      },
    });
  }, []);
  return <></>;
}
