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
        {children}
      </div>
  );
}
