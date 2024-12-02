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
          <main className="flex-1 bg-muted-100">
            <section className="w-full bg-muted-100 dark:bg-muted-900">
              <div className="w-full max-w-6xl mx-auto">
                <div className="w-full">
                  <div className="w-full h-full flex flex-col justify-between pt-32 px-6">
                    <div className="w-full  my-4 space-y-12">
                      {children}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
          <Footer />
        </TagsContextProvider>
      </CategoriesContextProvider>
    </>
  );
}
