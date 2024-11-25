"use client";
import { registerServiceWorker } from "@/lib/client/registerSW";
import { useEffect } from "react";

export function AppTip() {
  useEffect(() => {
    process.env.NODE_ENV === "production" &&
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
