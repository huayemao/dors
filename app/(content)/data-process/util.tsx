"use client";
import { Field, JobGroup, Profession } from "./types";

// todo: 传回调函数打印进度？能传吗
export async function parseAlltables(dbWorker, baseTables: any[]) {
  const jobTables: string[] = [];

  let f = dbWorker.execSql;
  function execSql(...args) {
    return new Promise((resolve) => {
      resolve(f(...args));
    });
  }

  for (const { name: tableName } of baseTables) {
    const cols = (await execSql(`PRAGMA table_info(${tableName});`)) as Field[];
    console.log(cols);

    if (
      ["职位代码", "专业要求"].every((s) => cols.map((e) => e.name).includes(s))
    ) {
      jobTables.push(tableName);
    }
  }

  return await Promise.all(jobTables.map(parseTable.bind(dbWorker)));

  async function parseTable(tableName: string) {
    let jobGroupsByProfession: JobGroup[] = [];
    let professions: Profession[] = [];
    const professionsSql = `select '${tableName}' as tableName,count(*) as cnt, 专业要求, GROUP_CONCAT(职位代码) AS ids from ${tableName} group by 专业要求 having 学历要求 like '%本科%' order by cnt desc;`;

    return execSql(professionsSql)
      .then((res) => (jobGroupsByProfession = res as JobGroup[]))
      .then(() => dbWorker?.execSql(`select *  from 本科专业目录;`))
      .then((res) => {
        professions = res.filter(
          (e) => !["▲", "★"].some((s) => JSON.stringify(e).includes(s))
        );
      })
      .then(() => {
        console.log(jobGroupsByProfession);
        jobGroupsByProfession.forEach((jobGroup) => {
          parseProfessionJobCount(professions, jobGroup);
        });
        console.log(professions);
        return professions;
      });
  }
}

export function parseProfessionJobCount(
  professions: Profession[],
  jobGroup: JobGroup
) {
  if (jobGroup.专业要求 == "不限") {
    professions.forEach((p) => countJobGroup(jobGroup, p));
  } else if (jobGroup.专业要求.startsWith("专业类")) {
    const cats = jobGroup.专业要求.replace("专业类：", "").split("、");
    parseItems(cats);
  } else if (jobGroup.专业要求.startsWith("专业名称")) {
    const cats = jobGroup.专业要求.replace("专业名称：", "").split("、");
    parseItems(cats);
  } else if (jobGroup.专业要求.startsWith("专科专业名称")) {
    //
  } else if (jobGroup.专业要求.startsWith("本科：")) {
    const underPs = jobGroup.专业要求
      .split("；")[0]
      .replace("本科：", "")
      .split("、");
    parseItems(underPs);
  } else if (jobGroup.专业要求.startsWith("1.本科：")) {
  } else if (jobGroup.专业要求.startsWith("本科:")) {
    const underPs = jobGroup.专业要求
      .split("；")[0]
      .replace("本科:", "")
      .split("、");

    parseItems(underPs);
  } else if (jobGroup.专业要求.startsWith("1.本科：")) {
    const underPs = jobGroup.专业要求
      .split("；")[0]
      .replace("1.本科：", "")
      .split("、");

    parseItems(underPs);
  } else if (jobGroup.专业要求.startsWith("门类：")) {
    const cats = jobGroup.专业要求
      .split("；")[0]
      .replace("门类：", "")
      .split("、");

    cats.forEach((c) => {
      professions.forEach((p) => {
        const pCat = p.学科门类.replace("【门类】", "");
        if (c === pCat) {
          countJobGroup(jobGroup, p);
        }
      });
    });
  } else {
    parseItems(jobGroup.专业要求.split("、"));
    // console.log(e.专业要求);
  }

  function parseItems(elements: string[]) {
    elements.forEach((c) => {
      if (c.endsWith("门类")) {
        professions.forEach((p) => {
          if (p.学科门类 === c.replace("门类", "")) {
            countJobGroup(jobGroup, p);
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
            countJobGroup(jobGroup, p);
          }
        });
      } else if (c.endsWith("类")) {
        professions.forEach((p) => {
          const pCat = p.专业类.replace("【", "").replace("】", "");
          if (c === pCat) {
            countJobGroup(jobGroup, p);
          }
        });
      } else {
        professions.forEach((p) => {
          if (c === p.专业) {
            countJobGroup(jobGroup, p);
          }
        });
      }
    });
  }
}
function countJobGroup(jobGroup: JobGroup, p) {
  // todo: 最后创个新表，记录专业代码、tableName 和 jobId
  const el = jobGroup.tableName + "_" + jobGroup.ids;
  // p.jobs = p.jobs ? Array.from(new Set([...p.jobs].concat(arr))) : [arr];
  if (p.jobs) {
    p.jobs.push(el);
  } else {
    p.jobs = [el];
  }
  p.岗位数 = p.岗位数 ? p.岗位数 + jobGroup.cnt : jobGroup.cnt;
}
