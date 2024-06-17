"use client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQAs } from "./contexts";
export default function Page() {
  const { currentCollection } = useQAs();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentCollection) {
      navigate("./" + currentCollection.id, { state: { __NA: {} } });
    }
  }, [currentCollection]);
  return <></>;
}
