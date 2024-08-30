"use client";
import withDeferredMount from "@/lib/client/utils/deferredMount";
import { BaseCard, BaseHeading } from "@shuriken-ui/react";
import { useCallback, useEffect, useState } from "react";
import { useDBContext } from "./DBContext";
import { Table } from "./Table";

export default withDeferredMount(ProfessionTable, 100);

function ProfessionTable() {
  const {
    state: { dbWorker, activeDb, baseTables },
  } = useDBContext();

  const [data, setData] = useState<any[]>();
  const [activeProfessionId, setActiveProfessionId] = useState<string>();

  const RankingSql = `select 专业代码, \`门类、专业类\`,专业名称,count(*) as 岗位数 from 普通高等学校本科专业目录 join  qualify on professionId == 专业代码 group by professionId order by 岗位数 desc  limit 100;`;

  const handleRowClick = useCallback((e) => {
    console.log(e);
  }, []);
  useEffect(() => {
    if (!dbWorker || !activeDb || !baseTables.length) {
      return;
    }

    dbWorker
      .execSql(RankingSql)
      .then((res) => {
        setData(
          res.map((e, i) => ({
            排名: i + 1,
            ...e,
          }))
        );
      })
      .catch((e) => {
        console.error(e);
      });
    // dbWorker
    //   .resolveAllTables(baseTables)
    //   .then((res) => {
    //     console.log(9999, res?.[0]);
    //     if (!res?.[0]) {
    //       return;
    //     }
    //     // todo: 这里排序做不完，必须要写表，不太应该呀，可以打印出来的呀
    //     const sorted = res[0]!
    //       // .sort((a, b) => b.岗位数 - a.岗位数)
    //       .slice(0, 50);
    //     console.log(sorted);
    //     // todo: 不限岗位专业数
    //   })
    //   .catch((e) => {
    //     console.error(e);
    //   });
  }, [dbWorker, activeDb]);

  return (
    <div className="grid col-span-12 grid-cols-2 gap-8">
      {/* <BaseCard shadow="flat" className="p-6"> */}
      {data &&
        [
          "1-10",
          "11-20",
          "21-30",
          "31-40",
          "41-50",
          "51-60",
          "61-70",
          "71-80",
          "81-90",
          "91-100",
        ].map((e, i) => {
          const [start, end] = e.split("-");

          const chunk = data.slice(Number(start) - 1, Number(end));
          return (
            <BaseCard shadow="flat" className="py-4 px-6 break-inside-avoid" key={e}>
              <BaseHeading className="text-muted-500 pb-2 text-center" as="h3">🔥 云南考公热门专业（本科） TOP {e}</BaseHeading>
              <Table boldCols={[4]} tagCols={[3]} data={chunk} onRowClick={handleRowClick} />
            </BaseCard>
          );
        })}
      {/* </BaseCard> */}
    </div>
  );
}
