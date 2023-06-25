import "@/styles/globals.css";
import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "花野猫的个人空间",
  description: "花野猫的个人空间",
};

export default function RootLayout({
  children,
  params,
}: {
  children: JSX.Element;
  params: any;
}) {
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
          src="http://qzonestyle.gtimg.cn/qzone/qzact/common/share/share.js"
        ></Script>
      </head>
      <body className="bg-muted-100">{children}</body>
    </html>
  );
}
