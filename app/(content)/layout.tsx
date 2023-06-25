import { Nav } from "@/components/Nav";

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
