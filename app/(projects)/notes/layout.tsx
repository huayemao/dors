import {
  EntityContextProvider,
} from "./contexts";
import { ClientOnly } from "@/components/ClientOnly";
import { Metadata } from "next";
import { Container } from "./Container";
import { NavigationItem, NavigationItemProps } from "@/components/Nav/NavigationItem";

export const metadata: Metadata = {
  title: 'UltraNotes',
  description: 'local note app surpporting mdx with great style'
};

const menuItems: NavigationItemProps[] = [

  {
    title: "关于",
    href: "/",
  },
  {
    title: "相关链接",
    children: [
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
    <EntityContextProvider>
      <header className="h-12 mb-2 justify-center flex items-center font-semibold">
        <h1>
          UltraNotes
        </h1>
        <nav className="absolute right-4 top-2 text-sm">
          <ul className="flex flex-col lg:items-center justify-between mt-3 mb-1 lg:flex-row  lg:mx-auto lg:mt-0 lg:mb-0 lg:gap-x-5">
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
        <Container></Container>
      </ClientOnly>
      <footer></footer>
    </EntityContextProvider>
  );
}
