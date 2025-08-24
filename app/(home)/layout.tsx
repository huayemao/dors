import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { getAllCategories } from "@/lib/server/categories";
import { getTags } from "@/lib/server/tags";
import { CategoriesContextProvider } from "@/contexts/categories";
import { TagsContextProvider } from "@/contexts/tags";
import { getResourceItems } from "@/lib/server/resource";

export const revalidate = 36000;

export default async function MainLayout({
  children,
  params,
}: {
  children: JSX.Element;
  params: any;
}) {
  const categories = await getAllCategories({ includeHidden: true });
  const tags = await getTags();
  const resourceItems = await getResourceItems();

  return (
    <>
      <CategoriesContextProvider Categories={categories}>
        <TagsContextProvider tags={tags}>
          <Nav resourceItems={resourceItems}></Nav>
          <main className="flex-1">{children}</main>
          <Footer />
        </TagsContextProvider>
      </CategoriesContextProvider>
    </>
  );
}
