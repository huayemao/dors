import { Category } from "@/components/Category";
import { Nav } from "@/components/Nav";
import { Pagination } from "@/components/Pagination";
import { SITE_META } from "@/constants";
import { getPageCount } from "@/lib/articles";
import { getTags } from "@/lib/tags";

export default async function MainLayout({
  children,
  params,
}: {
  children: JSX.Element;
  params: any;
}) {
  const tags = await getTags();
  const pageCount = await getPageCount();

  return (
    <>
      <Nav></Nav>
      <main>
        <section className="w-full bg-muted-100 dark:bg-muted-900">
          <div className="w-full max-w-7xl mx-auto">
            <div className="w-full  px-6 pt-24 lg:pt-24  pb-16">
              <div className="w-full h-full flex flex-col justify-between">
                <div className="w-full max-w-3xl mx-auto space-y-4 text-center">
                  <h1 className="font-heading font-extrabold text-5xl md:text-5xl text-muted-800 dark:text-white">
                    {SITE_META.name}
                  </h1>
                  <p className=" font-sans text-base md:text-lg text-muted-500 dark:text-muted-400">
                    {SITE_META.introduction}
                  </p>
                </div>
                <div className="w-full max-w-lg mx-auto my-4 space-y-4 text-center">
                  <div className="relative w-full flex justify-center gap-4 flex-wrap">
                    <Category
                      href={`/`}
                      name={"全部"}
                      key={9999}
                      active={!params?.tagId}
                    />
                    {tags.map((tag) => (
                      <Category
                        href={`/categories/${tag.id}`}
                        name={tag.name as string}
                        key={tag.id}
                        active={params?.tagId === tag.id}
                      />
                    ))}
                  </div>
                </div>
                {children}
              </div>
              {/* todo: 分页组件需要放到具体页面，而且需要根据 searchParams 来查询 */}
              <Pagination pageCount={pageCount} />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
