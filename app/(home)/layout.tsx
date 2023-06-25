import { Nav } from "@/components/Nav";

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
      <main>{children}</main>
    </>
  );
}
