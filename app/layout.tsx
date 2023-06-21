import "@/styles/globals.css";
import Script from "next/script";

export default function RootLayout({
  children,
  params,
}: {
  children: JSX.Element;
  params: any;
}) {
  return (
    <html>
      <head />
      <Script>
        {`if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}`}
      </Script>
      <body>{children}</body>
    </html>
  );
}
