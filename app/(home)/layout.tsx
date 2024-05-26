import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { SITE_META } from "@/constants";
import { Categories } from "../../components/Categories";

export default async function MainLayout({
  children,
  params,
}: {
  children: JSX.Element;
  params: any;
}) {

  return (
    <>
      <Nav></Nav>
      <main className="flex-1 bg-muted-100">
        <section className="w-full bg-muted-100 dark:bg-muted-900">
          <div className="w-full max-w-6xl mx-auto">
            <div className="w-full">
              <div className="w-full h-full flex flex-col justify-between pt-36 px-6">
                <div className="w-full max-w-3xl mx-auto space-y-4 text-center">
                  <h1 className="font-heading font-extrabold text-5xl md:text-5xl text-muted-800 dark:text-white">
                    {SITE_META.name}
                  </h1>
                  <p className=" font-sans text-base md:text-lg text-muted-500 dark:text-muted-400">
                    {SITE_META.introduction}
                  </p>
                </div>
                <div className="w-full max-w-lg mx-auto my-4 space-y-8 text-center">
                  <Categories  />
                </div>
                {children}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
