"use client";
import { isValidURL } from "@/lib/utils";
import {
  BaseButton,
  BaseButtonClose,
  BaseCard,
  BaseInputFile,
  BaseList,
  BaseListItem,
  BaseTextarea,
} from "@shuriken-ui/react";
import mime from "mime";
import { useContext, useEffect, useMemo, useState } from "react";
import { DBContext } from "./DBContext";

export default function Home() {
  const {
    state: { dbWorker },
  } = useContext(DBContext);

  const [lines, setLines] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [dbs, setDbs] = useState<string[]>([]);

  useEffect(() => {
    if (dbWorker && !!query) {
      const res = dbWorker.execSql(query);
      res.then(setLines).catch((e) => setError(e.message));
    }
  }, [dbWorker, query]);

  useEffect(() => {
    dbWorker?.getDbs?.()?.then((dbs) => setDbs(dbs.map(decodeURIComponent)));
  }, [dbWorker]);

  const tableData = useMemo(() => {
    const headers = lines.length ? Object.keys(lines[0]) : [];
    const rows = lines;
    return { headers, rows };
  }, [lines]);

  return (
    <div className="bg-white w-full p-8">
      <div className="grid grid-cols-12 gap-6">
        <BaseCard className="col-span-6 p-4">
          <BaseList>
            {dbs.map((e, i) => (
              <BaseListItem
                key={i}
                title={e}
                end={
                  <div className="flex items-center gap-4">
                    <BaseButton
                      onClick={() => {
                        dbWorker?.readWriteDB?.(encodeURIComponent(e));
                      }}
                    >
                      选择
                    </BaseButton>
                    <BaseButtonClose
                      onClick={(ev) => {
                        dbWorker?.removeDb?.(encodeURIComponent(e)).then(() => {
                          dbWorker
                            ?.getDbs?.()
                            ?.then((dbs) =>
                              setDbs(dbs.map(decodeURIComponent))
                            );
                          alert("已删除");
                        });
                        ev.stopPropagation();
                      }}
                    >
                      {/* 删除 */}
                    </BaseButtonClose>
                  </div>
                }
              ></BaseListItem>
            ))}
          </BaseList>
          <BaseInputFile
            id="fileInput"
            onChange={(files) => {
              const file = files?.[0];
              if (file) {
                const url = URL.createObjectURL(file);
                dbWorker?.readWriteDB(encodeURIComponent("测试数据库.db"), url);
              }
            }}
          />
        </BaseCard>
        <BaseCard className="prose p-8 col-span-6">
          <p>Try these two queries:</p>
          <pre>
            select * from sqlite_schema;
            <br />
            select * from 测试 limit 100;
            <br />
          </pre>
          <br />
        </BaseCard>
        <BaseCard className="col-span-12">
          <BaseTextarea
            rows={5}
            defaultValue={"select * from 测试 limit 100;"}
            onChange={(v) => setQuery(v)}
            // onInput={(e) => {
            //   const target = e.target as HTMLTextAreaElement;
            //   // console.log((e.target).value)
            //   setQuery(target.value);
            // }}
          />
        </BaseCard>
        <BaseCard className="w-full overflow-x-auto col-span-12">
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
              </tr>
            </thead>
            <tbody>
              {tableData.rows.map((e, i) => {
                return (
                  <tr key={i}>
                    {Object.entries(e).map(([key, value], i) => {
                      if(isValidURL(value) && mime.getType(value as string)?.startsWith('image')){
                        return    <td
                        data-nui-tooltip={value}
                        valign="middle"
                        className="border-t border-muted-200 py-4 px-3 font-sans font-normal dark:border-muted-800 text-sm text-muted-400 dark:text-muted-500"
                        key={key}
                      >
                        <img src={'/api/files?href='+value as string} crossOrigin="" className="w-36 max-w-[9rem] h-auto object-contain"/>
                      </td>
                      }
                      return (
                        <td
                          data-nui-tooltip={value}
                          valign="middle"
                          className="border-t border-muted-200 py-4 px-3 font-sans font-normal dark:border-muted-800 text-sm text-muted-400 dark:text-muted-500"
                          key={key}
                        >
                          <div className="max-w-[8em] min-w-[4em] overflow-hidden overflow-ellipsis">
                            {value as string}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </BaseCard>
      </div>

      <pre className="w-full h-48 overflow-auto">{JSON.stringify(lines)}</pre>
      <pre>{error}</pre>
    </div>
  );
}
