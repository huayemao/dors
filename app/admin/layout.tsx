import { getAllCategories } from "@/lib/server/categories";
import { getTags } from "@/lib/server/tags";
import { CategoriesContextProvider } from "@/contexts/categories";
import { TagsContextProvider } from "@/contexts/tags";
import { Nav } from "./Nav";

export default async function AdminLayout({
  children,
  params,
}: {
  children: JSX.Element;
  params: any;
}) {
  const categories = await getAllCategories({ includeHidden: true });
  const tags = await getTags();

  return (
    <CategoriesContextProvider Categories={categories}>
      <TagsContextProvider tags={tags}>
        <Nav>{children}</Nav>
      </TagsContextProvider>
    </CategoriesContextProvider>
  );
}
