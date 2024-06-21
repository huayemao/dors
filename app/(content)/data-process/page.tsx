"use client";
import { ActionDropdown } from "@/components/ActionDropdown";
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

interface Field {
  cid: number;
  name: string;
  type?: string; // TypeScript 中的 ? 表示该属性是可选的
  notnull: number;
  dflt_value: any; // 使用 any 类型来表示可以是任何值，包括 null
  pk: number;
}

export default function Home() {
  const {
    state: { dbWorker },
  } = useContext(DBContext);

  const [lines, setLines] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [dbs, setDbs] = useState<string[]>([]);
  const [activeDb, setActiveDb] = useState<string>();
  const [cols, setCols] = useState<Field[]>();
  const [tables, setTables] = useState<any[]>();

  const defaultTable = useMemo(() => {
    return tables?.[0].name as string;
  }, [tables]);

  useEffect(() => {
    if (dbWorker && !!query) {
      const res = dbWorker.execSql(query);
      res.then(setLines).catch((e) => setError(e.message));
    }
  }, [dbWorker, query]);

  useEffect(() => {
    dbWorker?.getDbs?.()?.then((dbs) => setDbs(dbs.map(decodeURIComponent)));
  }, [dbWorker]);

  useEffect(() => {
    if (activeDb) {
      const name = encodeURIComponent(activeDb);
      dbWorker?.readWriteDB?.(name);
      dbWorker
        ?.execSql(`select * from sqlite_schema where type = 'table';`)
        .then(setTables);
    }
  }, [activeDb]);

  useEffect(() => {
    dbWorker?.execSql(`PRAGMA table_info(${defaultTable})`).then(setCols);
  }, [defaultTable]);

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
                    <BaseButton onClick={() => e != activeDb && setActiveDb(e)}>
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
            {defaultTable && <>select * from {defaultTable} limit 20;</>}
            <br />
            {defaultTable && `PRAGMA table_info(${defaultTable})`}
            <br />
          </pre>
          <br />
          {cols?.map((e) => e.name)}
        </BaseCard>
        <BaseCard className="col-span-12">
          <BaseTextarea
            rows={5}
            defaultValue={
              defaultTable && `select * from ${defaultTable} limit 20;`
            }
            onChange={(v) => setQuery(v)}
          />
        </BaseCard>
        <BaseCard className="w-full overflow-x-auto col-span-12">
          {lines.length ? (
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
                        if (
                          isValidURL(value) &&
                          mime.getType(value as string)?.startsWith("image")
                        ) {
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
                                className="w-36 max-w-[9rem] h-auto object-contain"
                              />
                            </td>
                          );
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
          ) : null}
        </BaseCard>
      </div>

      <pre className="w-full h-48 overflow-auto">{JSON.stringify(lines)}</pre>
      <pre>{error}</pre>
    </div>
  );
}
