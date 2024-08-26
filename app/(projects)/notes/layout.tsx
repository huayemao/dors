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
      <ClientOnly>
        <Container></Container>
      </ClientOnly>
    </EntityContextProvider>
  );
}
