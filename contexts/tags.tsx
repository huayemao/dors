"use client";

import { getTags } from "@/lib/tags";
import { FC, PropsWithChildren, createContext } from "react";

const initialState = [];

export const TagsContext =
  createContext<Awaited<ReturnType<typeof getTags>>>(initialState);

export const TagsContextProvider: FC<
  PropsWithChildren<{
    tags: Awaited<ReturnType<typeof getTags>>;
  }>
> = ({ children, tags }) => {
  return (
    <TagsContext.Provider value={tags}>
      {children}
    </TagsContext.Provider>
  );
};
