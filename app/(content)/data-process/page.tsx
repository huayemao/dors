"use client";
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
import { useContext, useEffect, useMemo, useState } from "react";
import { DBContext } from "./DBContext";
import ProfessionTable from "./ProfessionTable";
import { Table } from "./Table";
import { PROFESSION_TABLE_NAME } from "./constants";
import { Field } from "./types";

export default function Home() {
  const {
    state: { dbWorker, dbs, baseTables, activeDb },
    actions: { refetch, setActiveDb },
  } = useContext(DBContext);

  const [lines, setLines] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [cols, setCols] = useState<Field[]>();

  const defaultTable = useMemo(() => {
    return baseTables?.[0]?.name;
  }, [baseTables]);

  const [query, setQuery] = useState<string>();

  useEffect(() => {
    if (dbWorker && !!query) {
      const res = dbWorker.execSql(query);
      res.then(setLines).catch((e) => setError(e.message));
    }
  }, [dbWorker, query]);

  const dataSql = useMemo(
    () =>
      `select ${cols
        ?.map((e) => e.name)
        .join()} from ${defaultTable} limit 20;`,
    [cols]
  );

  const professionsSql = useMemo(() => {
    const tableName = defaultTable;
    return `select '${tableName}' as tableName,count(*) as cnt, 年度, 专业要求, GROUP_CONCAT(职位代码) AS ids from ${tableName} group by 专业要求 having 学历要求 like '%本科%' order by cnt desc;`;
  }, [defaultTable]);

  useEffect(() => {
    if (defaultTable) {
      dbWorker?.execSql(`PRAGMA table_info(${defaultTable})`).then(setCols);
    }
  }, [defaultTable]);

  useEffect(() => {
    if (defaultTable && cols?.length) {
      setQuery(dataSql);
    }
  }, [cols]);

  const shouldHavProfessionTable = baseTables
    ?.map((e) => e.name)
    .includes(PROFESSION_TABLE_NAME);

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
                          refetch();
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
            onChange={async (files) => {
              const file = files?.[0] as File;
              if (file) {
                const url = URL.createObjectURL(file);
                await dbWorker?.readWriteDB(encodeURIComponent(file.name), url);
                refetch()
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
        <BaseCard className="col-span-6 p-6 max-h-36 bg-muted-200 overflow-hidden text-ellipsis">
          {cols?.map((e) => (
            <BaseSnack key={e.name} label={e.name} size="sm"></BaseSnack>
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
        {shouldHavProfessionTable && <ProfessionTable />}
        {
          <BaseCard className="w-full overflow-x-auto col-span-12">
            {lines.length ? <Table data={lines}></Table> : null}
          </BaseCard>
        }
      </div>

      <pre className="w-full h-48 overflow-auto">{JSON.stringify(lines)}</pre>
      <pre>{error}</pre>
    </div>
  );
}
