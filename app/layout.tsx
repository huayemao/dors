import "@/styles/globals.css";

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
      <body>{children}</body>
    </html>
  );
}
