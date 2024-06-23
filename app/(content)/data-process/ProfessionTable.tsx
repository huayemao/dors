"use client";
import { useCallback, useEffect, useState } from "react";
import { useDBContext } from "./DBContext";
import { Table } from "./Table";
import { Field, JobGroup, Profession } from "./types";
import { parseProfessionJobCount } from "./util";

export function ProfessionTable() {
  const {
    state: { dbWorker, activeDb, baseTables },
  } = useDBContext();

  const [data, setData] = useState<any[]>();

  const parseAlltables = useCallback(async () => {
    const jobTables: string[] = [];
    for (const { name: tableName } of baseTables) {
      console.log(dbWorker);
      const cols = (await dbWorker!.execSql(
        `PRAGMA table_info(${tableName});`
      )) as Field[];
      console.log(cols);

      if (
        ["职位代码", "专业要求"].every((s) =>
          cols.map((e) => e.name).includes(s)
        )
      ) {
        jobTables.push(tableName);
      }
    }

    return await Promise.all(jobTables.map(parseTable));

    async function parseTable(tableName: string) {
      let jobGroupsByProfession: JobGroup[] = [];
      let professions: Profession[] = [];
      const professionsSql = `select '${tableName}' as tableName,count(*) as cnt, 专业要求, GROUP_CONCAT(职位代码) AS ids from ${tableName} group by 专业要求 having 学历要求 like '%本科%' order by cnt desc;`;

      return dbWorker
        ?.execSql(professionsSql)
        .then((res) => (jobGroupsByProfession = res))
        .then(() => dbWorker?.execSql(`select *  from 本科专业目录;`))
        .then((res) => {
          professions = res.filter(
            (e) => !["▲", "★"].some((s) => JSON.stringify(e).includes(s))
          );
        })
        .then(() => {
          console.log(jobGroupsByProfession);
          jobGroupsByProfession.forEach(parseProfessionJobCount(professions));
          return professions;
        });
    }
  }, [dbWorker]);

  useEffect(() => {
    if (!dbWorker || !activeDb) {
      return;
    }

    parseAlltables().then((res) => {
      if (!res?.[0]) {
        return;
      }
      const sorted = res[0]!.sort((a, b) => b.岗位数 - a.岗位数).slice(0, 50);
      setData(sorted);
      // const baseCnt = jobGroupsByProfession.find(
      //   (e) => e.专业要求 == "不限"
      // )?.cnt;
      // console.log(baseCnt);
      // console.log(
      //   `红牌专业 ${professions.filter((e) => e.岗位数 == baseCnt).length}`
      // );
      // console.table(
      //   professions
      //     .sort((a, b) => a.岗位数 - b.岗位数)
      //     .slice(0, 100)
      //     .map((e) => ({
      //       ...e,
      //       除不限外岗位数: e.岗位数 - (baseCnt || 0),
      //     }))
      // );
      // console.log("top 100");
      // console.log(

      // );
    });
  }, [dbWorker, activeDb]);

  console.log(data);

  return <>{data && <Table data={data}></Table>}</>;
}
