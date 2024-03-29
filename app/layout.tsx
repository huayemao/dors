import { SITE_META } from "@/constants";
import { CategoriesContextProvider } from "@/contexts/categories";
import { TagsContextProvider } from "@/contexts/tags";
import { getAllCategories } from "@/lib/categories";
import { getTags } from "@/lib/tags";
import "@/styles/globals.css";
import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: SITE_META.name + "——" + SITE_META.description,
  description: SITE_META.description + SITE_META.introduction,
  abstract: SITE_META.description + SITE_META.introduction,
  authors: SITE_META.author,
  openGraph: {
    description: SITE_META.description + SITE_META.introduction,
    images: "/img/huayemao.png",
  },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: JSX.Element;
  params: any;
}) {
  const categories = await getAllCategories();
  const tags = await getTags();

  return (
    <html>
      <head>
        <Script id="darkMode" strategy="beforeInteractive">
          {`if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}`}
        </Script>
        <Script
          id="tencentShare"
          src="https://qzonestyle.gtimg.cn/qzone/qzact/common/share/share.js"
        ></Script>
      </head>
      <body className="transition-all duration-300 min-h-screen flex flex-col">
        <CategoriesContextProvider Categories={categories}>
          <TagsContextProvider tags={tags}>{children}</TagsContextProvider>
        </CategoriesContextProvider>
      </body>
    </html>
  );
}
