"use client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEntity } from "./contexts";
export default function QAsPage() {
  const { currentCollection } = useEntity();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentCollection) {
      navigate("./" + currentCollection.id, { state: { __NA: {} } });
    }
  }, [currentCollection, navigate]);
  return <></>;
}
