import { QAsContextProvider } from "./contexts";

export default function QAsLayout({
  children,
  params,
}: {
  children: JSX.Element;
  params: any;
}) {
  
  return <QAsContextProvider>{children}</QAsContextProvider>;
}
