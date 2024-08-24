import { Nav } from "@/components/Nav";
import { getNavResourceItems } from "@/lib/getNavResourceItems";
import prisma from "@/lib/prisma";

export const revalidate = 3600;

export default async function ContentLayout({
  children,
  params,
}: {
  children: JSX.Element;
  params: any;
}) {
  const resourceItemsRes = (
    await prisma.settings.findFirst({ where: { key: "nav_resource" } })
  )?.value;
  const resourceItems = getNavResourceItems(resourceItemsRes);

  return (
    <div className="z-0">
      <Nav resourceItems={resourceItems}></Nav>
      <div className="pt-20 bg-muted-100 min-h-screen">{children}</div>
    </div>
  );
}
