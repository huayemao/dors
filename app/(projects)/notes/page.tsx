"use client";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEntity } from "../../../contexts/notes";
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
        const res = confirm("有新的版本");
        if (res) {
          updateSW();
        }
      },
    });
  }, [currentCollection, navigate, params.id]);
  return <></>;
}
