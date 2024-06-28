import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

const Content = dynamic(() => import("./content"), { ssr: false });
export const revalidate = 300;

export default async function Page({ params }) {
  if (!params.id) {
    return;
  }

  const id = params.id as string;

  const post = await fetch(`http://47.114.89.18:8993/suburl/www.kmajw.com/Article/ContentPage/${id}`, {
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
      "cache-control": "no-cache",
      pragma: "no-cache",
      "upgrade-insecure-requests": "1",
    },
    referrer: "http://www.kmajw.com/",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: null,
    method: "GET",
    mode: "cors",
    credentials: "omit",
  }).then((e) => e.text());

  if (!post) {
    return notFound();
  }

  return (
    <main className="w-full p-4 flex justify-center">
      <Content html={post} />
    </main>
  );
}
