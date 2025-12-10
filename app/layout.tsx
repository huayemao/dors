import { SITE_META } from "@/constants";
import "@/styles/globals.css";
import { ShurikenUIProvider } from "@glint-ui/react";
import { Metadata } from "next";
import Script from "next/script";
import { AppTip } from "./AppTip";
import { AppToaster } from "@/components/Base/AppToaster";

import localFont from 'next/font/local'


const LXGW_WenKai = localFont({
  src: '../public/fonts/LXGWWenKai-Regular.woff2',
  variable: '--font-LXGW-WenKai',
})

export const metadata: Metadata = {
  title: {
    default: SITE_META.name,
    template: '%s | ' + SITE_META.name,
  },
  description: SITE_META.description + SITE_META.introduction,
  abstract: SITE_META.description + SITE_META.introduction,
  authors: SITE_META.author,
  icons: { icon: ["/favicon.ico", { sizes: 'any', url: '/favicon.svg', type: 'image/svg+xml' }], apple: "/apple-touch-icon.png" },
  openGraph: {
    description: SITE_META.description + SITE_META.introduction,
    images: SITE_META.url + "/img/huayemao.png",
  },
};

export default async function RootLayout({
  children,
  params,
  modal,
}: {
  children: JSX.Element;
  params: any;
  modal: React.ReactNode;
}) {
  return (
    <ShurikenUIProvider>
      <html lang="zh-CN" className={LXGW_WenKai.variable}>
        <head>
          <meta
            name="msvalidate.01"
            content="367ED36ACEB18DEFBDC5FD0CE17B995B"
          />
          <meta name="msvalidate.01" content="367ED36ACEB18DEFBDC5FD0CE17B995B" />
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
          <Script
            id="tencentShare"
            src="https://qzonestyle.gtimg.cn/qzone/qzact/common/share/share.js"
          ></Script>
        </head>
        <body className="min-h-screen flex flex-col w-screen overflow-x-hidden">
          {children}
          <AppToaster />
          <AppTip></AppTip>
          {modal}
        </body>
      </html>
    </ShurikenUIProvider>
  );
}
