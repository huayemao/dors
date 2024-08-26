import {
  EntityContextProvider,
} from "./contexts";
import { ClientOnly } from "@/components/ClientOnly";
import { Metadata } from "next";
import { Container } from "./Container";

export const metadata: Metadata = {
  title: 'UltraNotes',
  description: 'local note app surpporting mdx with great style'
};



export default function QAsLayout({ }) {
  return (
    <EntityContextProvider>
      <header className="h-12 mb-2 justify-center flex items-center font-semibold">UltraNotes</header>
      <ClientOnly>
        <Container></Container>
      </ClientOnly>
      <footer></footer>
    </EntityContextProvider>
  );
}
