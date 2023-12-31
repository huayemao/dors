import { Menu } from "../../components/Menu";

export default async function AdminLayout({
  children,
  params,
}: {
  children: JSX.Element;
  params: any;
}) {
  return (
    <div>
      <div className="dark:bg-muted-800 border-muted-200 dark:border-muted-700 fixed start-0 top-0 z-[60] flex h-full flex-col border-r bg-white transition-all duration-300 w-[240px] -translate-x-full lg:translate-x-0">
        <Menu />
      </div>
      <div className="bg-muted-100 dark:bg-muted-900 relative min-h-screen w-full overflow-x-hidden px-4 transition-all duration-300 xl:px-10 lg:max-w-[calc(100%_-_240px)] lg:ms-[240px]">
        {children}
      </div>
    </div>
  );
}
