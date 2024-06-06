"use client";

import { BasePlaceload } from "@shuriken-ui/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useQAs } from "./contexts";

export default function QAsPage() {
  const { currentCollection } = useQAs();

  const router = useRouter();

  useEffect(() => {
    if (currentCollection) {
      router.replace("/qa-input/" + currentCollection.id, {});
    }
  }, [currentCollection]);

  return (
    <div className="pt-24 md:px-12">
      <BasePlaceload className="h-8 w-full rounded" />
      <BasePlaceload className="h-8 w-full rounded" />
      <BasePlaceload className="h-8 w-full rounded" />
    </div>
  );
}
