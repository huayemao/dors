"use client";

export type JobGroup = {
  专业要求: string;
  cnt: number;
  ids: string;
  tableName: string;
};

export type Profession = {
  学科门类: string;
  专业类: string;
  专业: string;
  岗位数: number;
};
export interface Field {
  cid: number;
  name: string;
  type?: string; // TypeScript 中的 ? 表示该属性是可选的
  notnull: number;
  dflt_value: any; // 使用 any 类型来表示可以是任何值，包括 null
  pk: number;
}
