import {
  NotesContextProvider,
} from "@/contexts/notes";
import { ClientOnly } from "@/components/ClientOnly";
import { Metadata } from "next";
import { NotesContainer } from "@/components/NotesContainer";
import { NavigationItem, NavigationItemProps } from "@/components/Nav/NavigationItem";

export const metadata: Metadata = {
  title: 'UltraNotes',
  description: 'local note app surpporting mdx with great style'
};

const menuItems: NavigationItemProps[] = [
  {
    title: "相关链接",
    children: [
      {
        title: "关于",
        href: "/",
      },
      {
        title: "dors",
        href: "https://dors.huayemao.run",
        text: "花野猫的数字花园",
      },
    ]
  },
];

export default function QAsLayout({ }) {
  return (
    <NotesContextProvider>
      <header className="h-12 mb-2 justify-center flex items-center font-semibold">
        <h1>
          UltraNotes
        </h1>
        <nav className="absolute right-4 top-2 text-sm">
          <ul className="flex flex-col lg:items-center justify-between mb-1 lg:flex-row  lg:mx-auto lg:mt-0 lg:mb-0 lg:gap-x-5">
            {menuItems.map((e) => (
              <NavigationItem
                key={e.href}
                {...e}
              ></NavigationItem>
            ))}
          </ul>
        </nav>
      </header>
      <ClientOnly>
        <NotesContainer></NotesContainer>
      </ClientOnly>
      <footer></footer>
    </NotesContextProvider>
  );
}
