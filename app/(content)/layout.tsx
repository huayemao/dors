import { Nav } from "@/components/Nav";
import { CategoriesContextProvider } from "@/contexts/categories";
import { getAllCategories } from "@/lib/server/categories";
import { getResourceItems } from "@/lib/server/resource";
import { unstable_cache } from "next/cache";

export default async function ContentLayout({
  children,
  params,
}: {
  children: JSX.Element;
  params: any;
}) {
  const resourceItems = await getResourceItems();
  const categories = await getAllCategories({ includeHidden: true });
  return (
    <CategoriesContextProvider Categories={categories}>
      <div className="z-0">
        <Nav resourceItems={resourceItems}></Nav>
        <main className="min-h-screen">{children}</main>
      </div>
    </CategoriesContextProvider>
  );
}
