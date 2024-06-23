"use client";
import { JobGroup, Profession } from "./types";

export function parseProfessionJobCount(
  professions: Profession[]
): (value: JobGroup, index: number) => void {
  return (jobGroup) => {
    if (jobGroup.专业要求 == "不限") {
      professions.forEach(countJobGroup(jobGroup));
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
            countJobGroup(jobGroup)(p);
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
              countJobGroup(jobGroup)(p);
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
              countJobGroup(jobGroup)(p);
            }
          });
        } else if (c.endsWith("类")) {
          professions.forEach((p) => {
            const pCat = p.专业类.replace("【", "").replace("】", "");
            if (c === pCat) {
              countJobGroup(jobGroup)(p);
            }
          });
        } else {
          professions.forEach((p) => {
            if (c === p.专业) {
              countJobGroup(jobGroup)(p);
            }
          });
        }
      });
    }
  };
}
function countJobGroup(jobGroup: JobGroup): (p) => void {
  return (p) => {
    // todo: 还要 table name ，以及 select 出的 职位 ids
    const arr = [jobGroup.tableName + "_" + jobGroup.ids];
    p.jobs = p.jobs ? Array.from(new Set([...p.jobs].concat(arr))) : [arr];
    p.岗位数 = p.岗位数 ? p.岗位数 + jobGroup.cnt : jobGroup.cnt;
  };
}
