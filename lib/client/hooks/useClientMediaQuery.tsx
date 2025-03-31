"use client";
import { useIsClient, useMediaQuery } from "@uidotdev/usehooks";

// 添加一个自定义 hook 来安全地处理 useMediaQuery
export const useClientMediaQuery = (query: string) => {

  const isClient = useIsClient();

  const mediaQuery = useMediaQuery(query);

  if (!isClient) return false;

  return mediaQuery;
};
