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
  BaseSnack,
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
  const [dbs, setDbs] = useState<string[]>([]);
  const [activeDb, setActiveDb] = useState<string>();
  const [cols, setCols] = useState<Field[]>();
  const [tables, setTables] = useState<any[]>();

  const defaultTable = useMemo(() => {
    return tables?.[0].name as string;
  }, [tables]);

  const [query, setQuery] = useState<string>();

  useEffect(() => {
    if (dbWorker && !!query) {
      const res = dbWorker.execSql(query);
      res.then(setLines).catch((e) => setError(e.message));
    }
  }, [dbWorker, query]);

  useEffect(() => {
    dbWorker?.getDbs?.()?.then((dbs) => setDbs(dbs.map(decodeURIComponent)));
  }, [dbWorker]);

  const getTableSql = `select * from sqlite_schema where type = 'table';`;
  const dataSql = useMemo(
    () =>
      `select ${cols
        ?.map((e) => e.name)
        .join()} from ${defaultTable} limit 20;`,
    [cols]
  );

  const professionsSql = useMemo(
    () =>
      `select count(*) as cnt, 专业要求  from ${defaultTable} group by 专业要求 having 学历要求 like '%本科%' and (招录单位全称 like '%昆明%'  or 招录单位全称 like '%云南省%') order by cnt desc;`,
    [defaultTable]
  );

  useEffect(() => {
    if (activeDb) {
      const name = encodeURIComponent(activeDb);
      dbWorker?.readWriteDB?.(name);
      dbWorker?.execSql(getTableSql).then(setTables);
    }
  }, [activeDb]);

  useEffect(() => {
    if (defaultTable) {
      dbWorker?.execSql(`PRAGMA table_info(${defaultTable})`).then(setCols);
    }
  }, [defaultTable]);

  useEffect(() => {
    if (defaultTable && cols?.length) {
      setQuery(dataSql);
      if (tables?.map((e) => e.name).includes("本科专业目录")) {
        let jobProfessions: { 专业要求: string; cnt: number }[] = [];
        let professions: any[] = [];
        dbWorker
          ?.execSql(professionsSql)
          .then((res) => {
            jobProfessions = res;
          })
          .then(() => {
            return dbWorker?.execSql(`select *  from 本科专业目录;`);
            // ?.execSql(`select 职位代码,专业要求 from ${defaultTable} limit 20;`)
          })
          .then((res) => {
            professions = res.filter(
              (e) => !["▲", "★"].some((s) => JSON.stringify(e).includes(s))
            );
          })
          .then(() => {
            console.log(jobProfessions);
            jobProfessions.forEach((e) => {
              if (e.专业要求 == "不限") {
                professions.forEach(
                  (p) => (p.count = p.count ? p.count + e.cnt : e.cnt)
                );
              } else if (e.专业要求.startsWith("专业类")) {
                const cats = e.专业要求.replace("专业类：", "").split("、");
                mathAll(cats);
              } else if (e.专业要求.startsWith("专业名称")) {
                const cats = e.专业要求.replace("专业名称：", "").split("、");
                mathAll(cats);
              } else if (e.专业要求.startsWith("专科专业名称")) {
                //
              } else if (e.专业要求.startsWith("本科：")) {
                const underPs = e.专业要求
                  .split("；")[0]
                  .replace("本科：", "")
                  .split("、");

                mathAll(underPs);
              } else if (e.专业要求.startsWith("1.本科：")) {
              } else if (e.专业要求.startsWith("本科:")) {
                const underPs = e.专业要求
                  .split("；")[0]
                  .replace("本科:", "")
                  .split("、");

                mathAll(underPs);
              } else if (e.专业要求.startsWith("1.本科：")) {
                const underPs = e.专业要求
                  .split("；")[0]
                  .replace("1.本科：", "")
                  .split("、");

                mathAll(underPs);
              } else if (e.专业要求.startsWith("门类：")) {
                const cats = e.专业要求
                  .split("；")[0]
                  .replace("门类：", "")
                  .split("、");

                cats.forEach((c) => {
                  professions.forEach((p) => {
                    const pCat = p.学科门类.replace("【门类】", "");
                    if (c === pCat) {
                      p.count = p.count ? p.count + e.cnt : e.cnt;
                    }
                  });
                });
              } else {
                mathAll(e.专业要求.split("、"));
                // console.log(e.专业要求);
              }

              function mathAll(cats: string[]) {
                cats.forEach((c) => {
                  if (c.endsWith("门类")) {
                    professions.forEach((p) => {
                      if (p.学科门类 === c.replace("门类", "")) {
                        p.count = p.count ? p.count + e.cnt : e.cnt;
                      }
                    });
                  } else if (c.endsWith("相关专业")) {
                    professions.forEach((p) => {
                      if (
                        JSON.stringify(p)
                          .replaceAll("【", "")
                          .replaceAll("】", "")
                          .includes(c.replace("相关专业", ""))
                      ) {
                        p.count = p.count ? p.count + e.cnt : e.cnt;
                      }
                    });
                  } else if (c.endsWith("类")) {
                    professions.forEach((p) => {
                      const pCat = p.专业类.replace("【", "").replace("】", "");
                      if (c === pCat) {
                        p.count = p.count ? p.count + e.cnt : e.cnt;
                      }
                    });
                  } else {
                    professions.forEach((p) => {
                      if (c === p.专业) {
                        p.count = p.count ? p.count + e.cnt : e.cnt;
                      }
                    });
                  }
                });
              }
            });
          })
          .then(() => {
            const baseCnt = jobProfessions.find(
              (e) => e.专业要求 == "不限"
            )?.cnt;
            console.log(baseCnt);
            console.log(
              `红牌专业 ${professions.filter((e) => e.count == baseCnt).length}`
            );
            console.table(
              professions
                .sort((a, b) => a.count - b.count)
                .slice(0, 100)
                .map((e) => ({
                  ...e,
                  除不限外岗位数: e.count - (baseCnt || 0),
                }))
            );
            console.log("top 100");
            console.log(
              professions
                .sort((a, b) => b.count - a.count)
                .map((e) => ({
                  ...e,
                  除不限外岗位数: e.count - (baseCnt || 0),
                }))
            );
          });
      }
    }
  }, [cols]);

  const tableData = useMemo(() => {
    const headers = lines.length ? Object.keys(lines[0]) : [];
    const rows = lines;
    return { headers, rows };
  }, [lines]);

  const isEllipsisActive = (e) => {
    return e.offsetWidth < e.scrollWidth;
  };

  useEffect(() => {
    document
      .querySelectorAll("[data-nui-tooltip] .overflow-ellipsis")
      .forEach((e) => {
        if (!isEllipsisActive(e)) {
          e.parentElement!.removeAttribute("data-nui-tooltip");
        }
      });
  }, [tableData]);

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
              const file = files?.[0] as File;
              if (file) {
                const url = URL.createObjectURL(file);
                dbWorker?.readWriteDB(encodeURIComponent(file.name), url);
              }
            }}
          />
        </BaseCard>
        <BaseCard className="prose p-8 col-span-6">
          <p>Try these two queries:</p>
          <pre>
            select * from sqlite_schema;
            <br />
            {defaultTable && !!cols?.length && dataSql}
            <br />
            {defaultTable && `PRAGMA table_info(${defaultTable})`}
            <br />
            {cols?.map((e) => e.name).includes("专业要求") && professionsSql}
            <br />
          </pre>
          <br />
        </BaseCard>
        <BaseCard className="col-span-6">
          {cols?.map((e) => (
            <BaseSnack key={e.name} label={e.name}></BaseSnack>
          ))}
        </BaseCard>
        <BaseCard className="col-span-6">
          <BaseTextarea
            key={defaultTable}
            rows={5}
            value={query}
            onChange={(v) => {
              setQuery(v);
            }}
          >
            {query}
          </BaseTextarea>
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
          ) : null}
        </BaseCard>
      </div>

      <pre className="w-full h-48 overflow-auto">{JSON.stringify(lines)}</pre>
      <pre>{error}</pre>
    </div>
  );
}
