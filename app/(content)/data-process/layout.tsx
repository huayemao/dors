"use client";

import { DBContextProvider } from "./DBContext";

export default function DataLayout({ children }) {
  return <DBContextProvider>{children}</DBContextProvider>;
}
