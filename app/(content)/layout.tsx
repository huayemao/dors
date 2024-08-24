import { Nav } from "@/components/Nav";
import { getResourceItems } from "@/lib/server/resource";
import { unstable_cache } from "next/cache";

export const revalidate = 3600;

export default async function ContentLayout({
  children,
  params,
}: {
  children: JSX.Element;
  params: any;
}) {
  const resourceItems = await unstable_cache(getResourceItems)();

  return (
    <div className="z-0">
      <Nav resourceItems={resourceItems}></Nav>
      <div className="pt-20 bg-muted-100 min-h-screen">{children}</div>
    </div>
  );
}
