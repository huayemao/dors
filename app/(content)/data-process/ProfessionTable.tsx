"use client";
import withDeferredMount from "@/lib/utils/deferredMount";
import { useEffect, useState } from "react";
import { useDBContext } from "./DBContext";

export default withDeferredMount(ProfessionTable, 100);

function ProfessionTable() {
  const {
    state: { dbWorker, activeDb, baseTables },
  } = useDBContext();

  const [data, setData] = useState<any[]>();

  useEffect(() => {
    if (!dbWorker || !activeDb || !baseTables.length) {
      return;
    }

    dbWorker
      .resolveAllTables(baseTables)
      .then((res) => {
        console.log(9999, res?.[0]);
        if (!res?.[0]) {
          return;
        }
        // todo: 这里排序做不完，必须要写表，不太应该呀，可以打印出来的呀
        const sorted = res[0]!
          // .sort((a, b) => b.岗位数 - a.岗位数)
          .slice(0, 50);
        console.log(sorted);
        // setData(sorted);
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
      })
      .catch((e) => {
        console.error(e);
      });
  }, [dbWorker, activeDb]);

  return <></>;
}
