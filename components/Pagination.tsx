"use client";
import { POSTS_COUNT_PER_PAGE } from "@/constants";
import { BasePagination } from "@glint-ui/react";
import { useParams, useSearchParams } from "next/navigation";
import { memo, useCallback } from "react";

export default memo(Pagination);
// eslint-disable-next-line react/display-name
function Pagination({ pageCount }) {
  const params = useParams();
  const searchParams = useSearchParams();
  const pageNumRaw = params?.["page"] || searchParams?.get("page") || "1";

  const pageNum = Number(pageNumRaw as string);

  return (
    <BasePagination
      currentPage={pageNum}
      totalItems={pageCount * POSTS_COUNT_PER_PAGE}
      itemPerPage={POSTS_COUNT_PER_PAGE}
      maxLinksDisplayed={8}
    />
  );
}
