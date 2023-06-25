import { Nav } from "@/components/Nav";
import { Suspense } from "react";
import Loading from "./loading";

export default function MainLayout({
  children,
  params,
}: {
  children: JSX.Element;
  params: any;
}) {
  return (
    <>
      <Nav></Nav>
      <main>
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </main>
    </>
  );
}
