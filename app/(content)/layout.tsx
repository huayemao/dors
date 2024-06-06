import { Nav } from "@/components/Nav";

export default function ContentLayout({
  children,
  params,
}: {
  children: JSX.Element;
  params: any;
}) {
  return (
    <div className="z-0">
      <Nav></Nav>
      <div className="pt-20 bg-muted-100">{children}</div>
    </div>
  );
}
