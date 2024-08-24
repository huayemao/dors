"use client";

import { getAllCategories } from "@/lib/categories";
import { FC, PropsWithChildren, createContext } from "react";

const initialState = [];

export const CategoriesContext =
  createContext<Awaited<ReturnType<typeof getAllCategories>>>(initialState);

export const CategoriesContextProvider: FC<
  PropsWithChildren<{
    Categories: Awaited<ReturnType<typeof getAllCategories>>;
  }>
> = ({ children, Categories }) => {
  return (
    <CategoriesContext.Provider value={Categories}>
      {children}
    </CategoriesContext.Provider>
  );
};
