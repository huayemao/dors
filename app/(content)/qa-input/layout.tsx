"use client";

import dynamic from "next/dynamic";
import { QAsContextProvider } from "./contexts";
const Route = dynamic(() => import("./Route"), { ssr: false });

export default function QAsLayout({}) {
  return <QAsContextProvider>{<Route></Route>}</QAsContextProvider>;
}
