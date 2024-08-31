"use client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEntity } from "./contexts";
import { registerServiceWorker } from "@/lib/client/registerSW";
export default function NotesPage() {
  const { currentCollection } = useEntity();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentCollection) {
      navigate("./" + currentCollection.id, { state: { __NA: {} } });
    }

    registerServiceWorker({
      onNeedRefresh(updateSW) {
        const res = confirm("An app update is available");
        if (res) {
          updateSW();
        }
      },
    });
  }, [currentCollection, navigate]);
  return <></>;
}
