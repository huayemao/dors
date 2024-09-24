import { SITE_META } from "@/constants";
import "@/styles/globals.css";
import { ShurikenUIProvider } from "@shuriken-ui/react";
import { Metadata } from "next";
import Script from "next/script";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: SITE_META.name + "——" + SITE_META.description,
  description: SITE_META.description + SITE_META.introduction,
  abstract: SITE_META.description + SITE_META.introduction,
  authors: SITE_META.author,
  openGraph: {
    description: SITE_META.description + SITE_META.introduction,
    images: SITE_META.url + "/img/huayemao.png",
  },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: JSX.Element;
  params: any;
}) {
  return (
    <ShurikenUIProvider>
      <html lang="zh-CN">
        <head>
          <meta
            name="msvalidate.01"
            content="367ED36ACEB18DEFBDC5FD0CE17B995B"
          />
          {/* <style>
          {` 
          @page {
            margin:0;
            margin-top: .6cm;
            margin-bottom: .6cm;
          }
  
          @page:first {
            size:800px 600px;
            margin-top:0;
          }
  `}
        </style> */}
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
          {children}
          <Toaster></Toaster>
        </body>
      </html>
    </ShurikenUIProvider>
  );
}
