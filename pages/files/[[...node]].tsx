import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";

import { humanFileSize } from "@/lib/utils";

export default function Node({ props }) {
  const router = useRouter();
  const { route, asPath } = router;
  const dirPath = asPath.replace("/files", "") || "/";

  const { data } = useSWR({ url: `/v1/folder?path=${dirPath}` });

  return (
    <div>
      <ul className="grid grid-cols-8 gap-4">
        {data?.data?.content
          ?.sort(
            (a, b) =>
              (a.name - b.name) * 10 +
              // (new Date(b.modified) - new Date(a.modified)) +
              ((a.is_dir ? -1 : 1) - (b.is_dir ? -1 : 1)) * 1000
          )
          .map((e) => (
            <li
              key={e.name}
              className="bg-white  rounded-lg  hover:bg-slate-50 transition-all flex justify-center items-center p-2"
            >
              <div className="flex flex-col items-center">
                {e.is_dir ? (
                  <div className="w-8 h-8 text-gray-600 mb-2 flex-shrink-0" />
                ) : (
                  <div className="w-8 h-8 text-gray-600 mb-2 flex-shrink-0" />
                )}
                <Link href={"/files" + dirPath + "/" + e.name}>
                  <a className="text-gray-600 font-medium">{e.name}</a>
                </Link>
                <small className="text-gray-500">
                  {e.is_dir ? "" : humanFileSize(e.size)}
                </small>
                <small className="text-gray-500">
                  {new Date(e.modified).toLocaleString()}
                </small>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}
