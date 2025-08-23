import { NotesContextProvider } from "@/contexts/notes";
import { ClientOnly } from "@/components/ClientOnly";
import { Metadata } from "next";
import { NotesContainer } from "@/components/Notes/NotesContainer";
import {
  NavigationItem,
  NavigationItemProps,
} from "@/components/Nav/NavigationItem";
import { Nav } from "@/components/Nav/index";
import Link from "next/link";
import Image from "next/image";
import { BaseHeading } from "@glint-ui/react";
import DorsLogo from "@/public/img/dors_logo_cat_only.svg";

export const metadata: Metadata = {
  title: "小记",
  description: "本地化、支持 mdx 的简单笔记应用",
  manifest: "/notes/manifest.webmanifest",
};



export default function NotesLayout({ }) {
  return (
    <>
      <Nav simple ></Nav>
      <main className="flex-1 bg-muted-100 dark:bg-muted-900">
        <NotesContextProvider>
          {/* <Image
        src={DorsLogo}
        className="absolute top-4 left-4"
        alt="dors"
        height={48}
      ></Image> */}

          {/* <header className="h-16 bg-muted-100">
          <Link
            href="/"
            className="absolute left-0 top-4 title-font font-medium items-center text-muted-900 dark:text-muted-100
        "
          >
            <svg
              className="h-12 relative -top-1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="1200 860 1200 400"
              style={{
                fill: "rgb(49, 46, 129)",
              }}
            >
              <path d="M1530 968.2c0 38.5.1 42.1 2 47.9 9.6 31.4 44.6 46.7 73.6 32.3 13.2-6.5 23.1-18.1 27.4-32.3 1.9-5.8 2-9.4 2-47.9v-41.7l-17.8 17.8-17.7 17.7h-34l-17.7-17.7-17.8-17.8zm33.7 21.8c7 2.5 6.8 12.7-.2 15-5.9 2-10.7-1.4-10.7-7.5 0-3.9 1.5-6.3 4.7-7.5 2.7-1.2 2.8-1.2 6.2 0m46.8 2c2.3 2.3 2.6 8 .5 10.5-4.9 5.8-15 2.5-15-5 0-7.2 9.1-10.7 14.5-5.5" />
              <path d="M1365.5 963.9c-7 3.2-10.5 8.6-10.5 16.1s3.5 12.9 10.5 16.1c2.2 1 5.5 1.9 7.3 1.9 5.7 0 12.1 4 15.1 9.5 1.4 2.7 1.7 11 2.1 80l.5 77 2.3 5.2c3.3 7.1 12.1 15.4 19.5 18.1 5.7 2.2 6.9 2.2 59.3 2.2h53.5l2.4-2.5c2.3-2.2 2.5-3.2 2.5-11 0-9.7-1.1-12.6-6.5-17.3-4.3-3.8-5.5-4.1-17.6-4.5l-9.6-.2 34.4-25.8 34.3-25.7v82.1l2.5 2.4c2.3 2.4 3 2.5 15 2.5s12.7-.1 15-2.5l2.5-2.4v-58.6c0-55.9-.1-58.6-1.8-58.1-1 .3-5 1-8.9 1.5-22.1 2.8-46.1-7.1-60.4-25-5.8-7.2-12.4-19.9-13.4-25.9l-.7-4h-5.6c-13.5 0-31.2 4.4-44.2 11-14 7.1-24.2 15.4-34.2 27.8l-5.8 7.3v-27.4c0-30.9-.6-34.6-7.5-46.2-10.6-18.1-37.5-30.3-52-23.6m348.5 137.6v83.6l40.8-.3 40.7-.4 8-2.7c14.7-5.2 23.2-10.3 33.1-20.2 10.5-10.3 16.2-19.3 20.6-32.2 2.8-7.9 3.1-10.4 3.5-24.4.5-13.7.3-16.5-1.6-23.9-6.5-24.8-21.3-43.2-43.6-54-17-8.2-17.6-8.3-62.2-8.7l-39.3-.5zm80-59.6c13.4 3.8 24 11 31.3 21.3 8.5 12.1 11.7 22.5 11.7 38.8 0 28.4-14.9 50.2-40.4 58.9-6.6 2.2-8.9 2.4-32.8 2.9l-25.8.4V1040h24.8c21.1 0 25.7.3 31.2 1.9m135.5 27c-16.8 2.7-34.8 16.1-42.4 31.6-5 10.1-6.1 14.9-6.1 27.1 0 17.9 5 30.5 16.9 42.5 6.9 6.9 15.9 12.4 25.1 15.5 8.2 2.8 27.3 2.6 35.8-.4 18-6.1 32.3-20.2 38.6-37.7 2.3-6.4 3.3-26 1.7-33.6-2.1-9.6-7.6-19.5-15.4-27.4-12-12-23.4-17.2-39.7-17.9-5.2-.3-11.8-.1-14.5.3m21 22.5c10.6 2.8 18 9 22.9 19.1 2.7 5.4 3 7 3 16.5.1 8-.4 11.7-1.8 15.6-5.1 13.9-15.9 21.8-31.2 23.1-17.4 1.5-32.3-8.3-37.4-24.6-5.3-16.7.2-35.7 12.8-44.5 8.8-6.1 21-8.1 31.7-5.2m116.8-22.4c-5.5 1.2-11.6 4.3-16.2 8.5-2.1 1.9-4.1 3.5-4.5 3.5-.3 0-.6-2.3-.6-5v-5h-22v114h21.8l.4-37.3c.4-40.3.6-41.9 6.3-49.3 7.6-10 27.3-11.9 36.8-3.6 1.6 1.5 2.3 1.1 8.7-5.3 3.9-3.8 7-7.5 7-8.1 0-1.9-7-7.5-12.6-10.1-5.8-2.7-18.1-3.8-25.1-2.3m76.5 0c-11.7 2.1-21.9 9.3-26.5 18.8-2.4 5-2.8 6.9-2.8 14.7 0 10.3 1.6 14.5 8.2 20.9 5.6 5.5 12.1 8.6 29.3 13.6 10.8 3.2 19.3 7.6 21.3 10.9 2.2 3.7 2.2 10 .1 13-2.8 4-9 6.1-18 6.1-12.4 0-23.1-3.9-29.9-11-1.6-1.6-3.4-3-4-3-1.4 0-13.5 12.2-13.5 13.7 0 2.1 11 11 17.3 14 11.8 5.7 16.2 6.8 29.2 6.8 10.9 0 12.7-.3 19.5-2.9 9.2-3.6 16.8-10.3 20.1-17.9 3.3-7.5 3.3-21.2.1-27.9-5.2-10.5-17.2-17.6-40.4-23.9-7.7-2-14.7-5.9-16.3-8.9-2.2-4.3-1.9-8.4 1-11.9 3.6-4.2 8.2-5.4 18.4-4.9 7.8.4 9.4.8 15.4 4.2 3.7 2 7.3 4.6 8 5.7.6 1 1.6 1.9 2.2 1.9 1.7 0 13.5-12.4 13.5-14.1 0-1.9-6.8-8.4-12.1-11.7-9-5.5-28-8.5-40.1-6.2" />
            </svg>
          </Link>
          <nav className="absolute right-4 top-4 text-sm">
            <ul className="flex flex-col lg:items-center justify-between mb-1 lg:flex-row  lg:mx-auto lg:mt-0 lg:mb-0 lg:gap-x-5">
              {menuItems.map((e) => (
                <NavigationItem
                  key={e.title}
                  {...e}
                ></NavigationItem>
              ))}
            </ul>
          </nav>
        </header> */}


          <ClientOnly>
            <NotesContainer></NotesContainer>
          </ClientOnly>
          <footer></footer>
        </NotesContextProvider>
      </main>
    </>
  );
}
