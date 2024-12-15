"use client";
import { ActionDropdown } from "@/components/ActionDropdown";
import { cn, isDataURL, isValidURL } from "@/lib/utils";
import { BaseDropdown, BaseDropdownItem, BaseTag } from "@shuriken-ui/react";
import mime from "mime";
import { useCallback, useEffect, useMemo } from "react";

export function Table({
  data,
  onRowClick,
  canEdit = false,
  tagCols = [],
  boldCols = [],
  actions = [],
}: {
  data: any[];
  canEdit?: boolean;
  actions?: { title: string; href?: string; onClick?: (e:any) => void }[];
  onRowClick?: (any) => void;
  tagCols?: number[];
  boldCols?: number[];
}) {
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

  const getHash = useCallback(
    (s: string): "primary" | "success" | "info" | "warning" | "danger" => {
      const mapping = {
        0: "primary",
        1: "success",
        2: "info",
        3: "warning",
        4: "danger",
      };

      return mapping[(s.length * s.charCodeAt(1) + s.charCodeAt(0)) % 5];
    },
    []
  );

  return (
    <table className="w-full overflow-x-auto whitespace-nowrap">
      {/* <colgroup>
        {tableData.headers.map((e) => (
          <col className="w-[20%]" key={e}></col>
        ))}
      </colgroup> */}
      <thead className="bg-muted-100 dark:bg-muted-900 font-bold text-muted-500 dark:text-muted-100">
        <tr>
          {tableData.headers.map((e) => (
            <th
              className="bg-transparent py-4 px-3 text-start font-sans text-xs  uppercase tracking-wide "
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
          {canEdit && (
            <th className="bg-transparent py-4 px-3 text-start font-sans text-xs font-medium uppercase text-muted-400 tracking-wide ">
              操作
            </th>
          )}
        </tr>
      </thead>
      <tbody className="text-muted-500 bg-muted-50/5 dark:bg-muted-800 dark:text-muted-50  font-medium">
        {tableData.rows.map((row, i) => {
          return (
            <tr
              className="text-sm  border-b border-muted-200 transition-colors duration-300 last:border-none hover:bg-muted-200/40 dark:border-muted-800 dark:hover:bg-muted-900/60"
              key={i}
              onClick={() => onRowClick?.(row)}
            >
              {Object.entries(row).map(([key, value], i) => {
                if (
                  isValidURL(value) &&
                  ((value as string).startsWith(
                    "https://images.pexels.com/photos/"
                  ) ||
                    isDataURL(value) ||
                    mime.getType(value as string)?.startsWith("image"))
                ) {
                  return (
                    <td
                      data-nui-tooltip={value}
                      valign="middle"
                      className="border-t border-muted-200 py-4 px-3 font-sans dark:border-muted-800 "
                      key={key}
                    >
                      <img
                        src={value as string}
                        // src={("/api/files?href=" + value) as string}
                        crossOrigin=""
                        className="w-24 max-w-[8rem] h-auto object-contain"
                      />
                    </td>
                  );
                }
                return (
                  <td
                    valign="middle"
                    className="border-t border-muted-200 py-4 px-3 font-sans dark:border-muted-800 text-sm "
                    key={key}
                  >
                    {tagCols.includes(i + 1) ? (
                      <BaseTag
                        shadow="flat"
                        color={getHash(value as string)}
                        size="sm"
                      >
                        {value as string}
                      </BaseTag>
                    ) : (
                      <div
                        data-nui-tooltip={value}
                        className={cn("max-w-[8em] min-w-[4em] ", {
                          "min-w-fit text-center":
                            typeof value == "number" || value instanceof Date,
                        })}
                      >
                        <span
                          className={cn(
                            "inline-block overflow-hidden overflow-ellipsis",
                            {
                              "font-semibold": boldCols.includes(i + 1),
                            }
                          )}
                        >
                          {value instanceof Date ? (
                            <time>
                              {value.toLocaleDateString()} <br />{" "}
                              {value.toLocaleTimeString()}
                            </time>
                          ) : (
                            (value as string)
                          )}
                        </span>
                      </div>
                    )}
                  </td>
                );
              })}
              {canEdit && (
                <td
                  valign="middle"
                  className="border-t border-muted-200 py-4 px-3 font-sans font-normal dark:border-muted-800 text-sm text-muted-400"
                >
                  <BaseDropdown variant="context">
                    {actions.map((e) => (
                      <BaseDropdownItem
                        onClick={()=>e.onClick?.(row)}
                        key={e.title}
                        title={e.title}
                      ></BaseDropdownItem>
                    ))}
                  </BaseDropdown>
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
