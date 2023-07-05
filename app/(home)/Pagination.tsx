"use client";
import { Pagination } from "@/components/Pagination";
import { useParams } from "next/navigation";

export default function ({ pageCount }) {
  const params = useParams();
  const pageNumRaw = params?.["page"] || "0";

  const pageNum = Number(pageNumRaw as string);

  return (
    <Pagination
      pageNum={pageNum}
      pageCount={pageCount}
      buildHref={(e) => `/p/${e}`}
    />
  );
}
