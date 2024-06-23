"use client";
import { ActionDropdown } from "@/components/ActionDropdown";
import { isValidURL } from "@/lib/utils";
import mime from "mime";
import { useEffect, useMemo } from "react";

export function Table({ data }: { data: any[]; }) {
  const tableData = useMemo(() => {
    const headers = Object.keys(data[0]);
    const rows = data;
    return { headers, rows };
  }, [data]);

  const isEllipsisActive = (e) => {
    return e.offsetWidth < e.scrollWidth;
  };

  useEffect(() => {
    document
      .querySelectorAll("table [data-nui-tooltip] .overflow-ellipsis")
      .forEach((e) => {
        if (!isEllipsisActive(e)) {
          e.parentElement!.removeAttribute("data-nui-tooltip");
        }
      });
  }, [data]);

  return (
    <table className="w-full overflow-x-auto whitespace-nowrap">
      <colgroup>
        {tableData.headers.map((e) => (
          <col className="w-[20%]" key={e}></col>
        ))}
      </colgroup>
      <thead>
        <tr className="bg-muted-50 dark:bg-muted-900">
          {tableData.headers.map((e) => (
            <th
              className="bg-transparent py-4 px-3 text-start font-sans text-xs font-medium uppercase text-muted-400 tracking-wide "
              key={e}
            >
              <div
                data-nui-tooltip={e}
                className="max-w-[8em] min-w-[4em] overflow-hidden overflow-ellipsis"
              >
                {e}
              </div>
            </th>
          ))}
          <th className="bg-transparent py-4 px-3 text-start font-sans text-xs font-medium uppercase text-muted-400 tracking-wide ">
            操作
          </th>
        </tr>
      </thead>
      <tbody>
        {tableData.rows.map((e, i) => {
          return (
            <tr
              className="border-b border-muted-200 transition-colors duration-300 last:border-none hover:bg-muted-200/40 dark:border-muted-800 dark:hover:bg-muted-900/60"
              key={i}
            >
              {Object.entries(e).map(([key, value], i) => {
                if (isValidURL(value) &&
                  mime.getType(value as string)?.startsWith("image")) {
                  return (
                    <td
                      data-nui-tooltip={value}
                      valign="middle"
                      className="border-t border-muted-200 py-4 px-3 font-sans font-normal dark:border-muted-800 text-sm text-muted-400 dark:text-muted-500"
                      key={key}
                    >
                      <img
                        src={("/api/files?href=" + value) as string}
                        crossOrigin=""
                        className="w-36 max-w-[9rem] h-auto object-contain" />
                    </td>
                  );
                }
                return (
                  <td
                    valign="middle"
                    className="border-t border-muted-200 py-4 px-3 font-sans font-normal dark:border-muted-800 text-sm text-muted-400 dark:text-muted-500"
                    key={key}
                  >
                    <div data-nui-tooltip={value}>
                      <span className="inline-block max-w-[8em] min-w-[4em] overflow-hidden overflow-ellipsis">
                        {value as string}
                      </span>
                    </div>
                  </td>
                );
              })}

              <td
                valign="middle"
                className="border-t border-muted-200 py-4 px-3 font-sans font-normal dark:border-muted-800 text-sm text-muted-400 dark:text-muted-500"
              >
                <ActionDropdown>
                  <></>
                </ActionDropdown>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
