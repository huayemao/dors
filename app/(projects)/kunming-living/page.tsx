import Link from "next/link";

export default async function KunmingLiving() {
  const res = await fetch(
    "http://47.114.89.18:8993/suburl/www.kmajw.com/api/CMS/ArticleContent/7/2/142f1752daab40df8577096ad3a98394",
    {
      headers: {
        accept: "*/*",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
        "cache-control": "no-cache",
        pragma: "no-cache",
        "x-requested-with": "XMLHttpRequest",
        Referer: "http://www.kmajw.com/",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      body: null,
      method: "GET",
    }
  );
  const json = (await res.json()) as any[];

  return (
    <main className="w-full bg-white dark:bg-muted-900 flex justify-center p-4">
      <div className="prose">
        <ul>
          {json.map((e) => (
            <li key={e.ID}>
              <Link className="!no-underline hover:underline hover:text-primary-600 hover:bg-primary-100" href={"/kunming-living/articles/" + e.ID}>
                {e.ArticleNameZH}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
