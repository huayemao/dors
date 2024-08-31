"use client";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEntity } from "./contexts";
import { registerServiceWorker } from "@/lib/client/registerSW";
export default function NotesPage() {
  const { currentCollection } = useEntity();
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    if (currentCollection && !params.id) {
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
  }, [currentCollection, navigate, params.id]);
  return <></>;
}
