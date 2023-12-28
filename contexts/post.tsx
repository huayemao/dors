"use client";

import { getPost } from "@/lib/posts";
import { FC, PropsWithChildren, createContext } from "react";

const initialState = null;

export const PostContext =
  createContext<Awaited<ReturnType<typeof getPost> | null>>(initialState);

export const PostContextProvider: FC<
  PropsWithChildren<{ post: Awaited<ReturnType<typeof getPost>> }>
> = ({ children, post }) => {
  return <PostContext.Provider value={post}>{children}</PostContext.Provider>;
};
