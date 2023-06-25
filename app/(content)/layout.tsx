import { Nav } from "@/components/Nav";
import { Suspense } from "react";
import Loading from "./loading";

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
      <Suspense fallback={<Loading />}></Suspense>
      {children}
    </>
  );
}
