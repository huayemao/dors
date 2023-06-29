"use client";

import clsx from "clsx";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export function Pagination({ pageCount }) {
  const params = useParams();
  const pageNumRaw = params?.["page"] || "0";

  const pageNum = Number(pageNumRaw as string);

  const [begin, setBegin] = useState(pageNum - 5 > 0 ? pageNum - 5 : 0);

  const items = Array.from({ length: pageCount }, (e, i) => i + 1);

  return (
    <ul className="bg-muted-100 rounded-full px-1 dark:border-muted-600 dark:bg-muted-700 mb-4 inline-flex flex-wrap gap-2  p-1 md:mb-0 md:gap-1">
      {items.slice(begin, begin + 10).map((e, i) => (
        <li key={e}>
          <Link
            href={`/p/${e}`}
            shallow
            className={clsx(
              "router-link-active router-link-exact-active flex h-10 w-10 items-center justify-center font-sans text-sm transition-all duration-300 dark:bg-muted-800 border-muted-200 dark:border-muted-700 hover:bg-muted-100 dark:hover:bg-muted-900  hover:text-muted-700 dark:hover:text-muted-400  rounded-full",
              {
                "bg-white text-muted-500": !(pageNum ? pageNum === e : e === 1),
                "border bg-primary-500 border-primary-500 shadow-primary-500/50 dark:shadow-primary-500/20 text-white shadow-sm":
                  pageNum ? pageNum === e : e === 1,
              }
            )}
          >
            {e}
          </Link>
        </li>
      ))}
    </ul>
  );
}
