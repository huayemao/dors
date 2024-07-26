"use client";
import { Pagination } from "@/components/Pagination";
import { useParams, useSearchParams } from "next/navigation";

// eslint-disable-next-line react/display-name
export default function ({ pageCount }) {
  const params = useParams();
  const searchParams = useSearchParams();
  const pageNumRaw = params?.["page"] || searchParams?.get("page") || "0";

  const pageNum = Number(pageNumRaw as string);

  return (
    <Pagination
      pageNum={pageNum}
      pageCount={pageCount}
      buildHref={(e) => `/protected/p/${e}`}
    />
  );
}
