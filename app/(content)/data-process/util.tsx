"use client";
import { PROFESSION_TABLE_NAME } from "./constants";
import { Field, JobGroup, Profession } from "./types";

async function sleep(s: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, s);
  });
}

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

    if (
      ["职位代码", "专业要求"].every((s) => cols.map((e) => e.name).includes(s))
    ) {
      jobTables.push(tableName);
    }
  }

  await execSql(`CREATE TABLE IF NOT EXISTS qualify (
    professionId TEXT REFERENCES ${PROFESSION_TABLE_NAME} (专业代码),
    year         TEXT,
    JobId        TEXT,
    tableName    TEXT,
    PRIMARY KEY (
        professionId,
        year,
        JobId,
        tableName
    )
);
`);

  return await Promise.all(jobTables.map(parseTable.bind(dbWorker)));

  async function parseTable(tableName: string) {
    let jobGroupsByProfession: JobGroup[] = [];
    let professions: Profession[] = [];
    const professionsSql = `
    select '${tableName}' as tableName,count(*) as cnt, 年度, 专业要求, GROUP_CONCAT(职位代码) AS ids from 
    ${tableName} left join Qualify on 职位代码 == jobId and 年度 == year 
    where 学历要求 like '%本科%' and jobId is null 
    group by 专业要求,年度 
    order by cnt desc;`;

    console.log(professionsSql);
    return execSql(professionsSql)
      .then((res) => (jobGroupsByProfession = res as JobGroup[]))
      .then(() => dbWorker?.execSql(`select *  from ${PROFESSION_TABLE_NAME};`))
      .then((res) => {
        professions = res.filter(
          (e) => !["▲", "★"].some((s) => JSON.stringify(e).includes(s))
        );
      })
      .then(async () => {
        console.log(jobGroupsByProfession);
        for (const jobGroup of jobGroupsByProfession) {
          // await sleep(200)
          await parseProfessionJobCount(professions, jobGroup);
        }
        return professions;
      });
  }

  async function parseProfessionJobCount(
    professions: Profession[],
    jobGroup: JobGroup
  ) {
    if (jobGroup.专业要求 == "不限") {
      for (const p of professions) {
        await countJobGroup(jobGroup, p);
      }
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
    } else if (jobGroup.专业要求.startsWith("1.本科限")) {
      const underPs = jobGroup.专业要求
        .split("；")[0]
        .replace("1.本科限", "")
        .split("、");

      parseItems(underPs);
    } else if (jobGroup.专业要求.startsWith("1.本科专业类要求：")) {
      const underPs = jobGroup.专业要求
        .split("；")[0]
        .replace("1.本科专业类要求：", "")
        .split("、");

      parseItems(underPs);
    } else if (jobGroup.专业要求.startsWith("本科")) {
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

      for (const c of cats) {
        for (const p of professions) {
          const cats = p.学位授予门类.split(",");
          if (cats.includes(c)) {
            console.log("============");
            await countJobGroup(jobGroup, p);
          }
        }
      }
    } else {
      await parseItems(jobGroup.专业要求.split("、"));
      // console.log(e.专业要求);
    }

    async function parseItems(elements: string[]) {
      for (const c of elements) {
        if (c === "不限") {
          for (const p of professions) {
            await countJobGroup(jobGroup, p);
          }
        } else if (c.includes(",")) {
          const items = c.split(",");
          parseItems(items);
        } else if (c.includes("所学专业：")) {
          const items = c.replace("所学专业：", "").split("、");
          parseItems(items);
        } else if (c.endsWith("门类")) {
          for (const p of professions) {
            if (p.学位授予门类 === c.replace("门类", "")) {
              await countJobGroup(jobGroup, p);
            }
          }
        } else if (c.endsWith("相关专业")) {
          for (const p of professions) {
            if (JSON.stringify(p).includes(c.replace("相关专业", ""))) {
              await countJobGroup(jobGroup, p);
            }
          }
        } else if (c.endsWith("专业")) {
          parseItems([c.replace("专业", "")]);
        } else if (c.endsWith("类")) {
          for (const p of professions) {
            const pCat = p["门类、专业类"];
            if (c === pCat) {
              await countJobGroup(jobGroup, p);
            }
          }
        } else {
          for (const p of professions) {
            if (c === p.专业名称) {
              await countJobGroup(jobGroup, p);
            }
          }
        }
      }
    }

    async function countJobGroup(jobGroup: JobGroup, p: Profession) {
      const el = {
        tableName: jobGroup.tableName,
        ids: jobGroup.ids,
        year: jobGroup.年度,
      };
      // todo: 最后创个新表，记录专业代码、tableName 和 jobId
      // p.jobs = p.jobs ? Array.from(new Set([...p.jobs].concat(arr))) : [arr];
      if (p.jobs) {
        // p.jobs.push(el);
      } else {
        p.jobs = [el];
      }
      try {
        const items = el.ids
          .split(",")
          .map((v) => [p.专业代码, el.year, v, el.tableName]);

        if (items.length == 1) {
          const [professionId, year, JobId, tableName] = items[0];
          const sql = `INSERT INTO qualify (professionId,  year,  JobId,  tableName)
          VALUES ('${professionId}','${year}','${JobId}','${tableName}');`;
          console.log(sql);
          await execSql(sql);
        } else {
          const sql =
            `begin;\n` +
            items
              .map((e) => {
                const [professionId, year, JobId, tableName] = e;
                return `INSERT INTO qualify (professionId,  year,  JobId,  tableName)
        VALUES ('${professionId}','${year}','${JobId}','${tableName}');`;
              })
              .join("\n") +
            "COMMIT;";

          if (items.length < 3) {
            await sleep(80);
          }
          console.log(sql);
          await execSql(sql);
        }
      } catch (error) {
        console.error(error.message);
      }
      p.岗位数 = p.岗位数 ? p.岗位数 + jobGroup.cnt : jobGroup.cnt;
    }
  }
}
