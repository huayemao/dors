import { Nav } from "@/components/Nav";
import Link from "next/link";

export default function ContentLayout({
  children,
  params,
}: {
  children: JSX.Element;
  params: any;
}) {
  return (
    <>
      <Nav></Nav>
      {children}
    </>
  );
}
