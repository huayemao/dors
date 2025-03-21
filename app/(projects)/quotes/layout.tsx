import { ClientOnly } from "@/components/ClientOnly";
import { Metadata } from "next";
import {
  NavigationItem,
  NavigationItemProps,
} from "@/components/Nav/NavigationItem";
import { Nav } from "@/components/Nav";
import Link from "next/link";
import Image from "next/image";
import { BaseHeading } from "@shuriken-ui/react";
import DorsLogo from "@/public/img/dors_logo_cat_only.svg";
import { QuotesRoute } from "./QuotesRoute";
import { QuotesContextProvider } from "./context";
import { Header } from "./components/Header";

export const metadata: Metadata = {
  title: "影墨留香",
};


export default function NotesLayout({ }) {
  return (
    <main className="flex-1 bg-slate-100">
      <QuotesContextProvider>
        <Header />
        <ClientOnly>
          <QuotesRoute />
        </ClientOnly>
        <footer></footer>
      </QuotesContextProvider>
    </main>
  );
}
