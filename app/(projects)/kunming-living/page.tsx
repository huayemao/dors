import Link from "next/link";

export default async function KunmingLiving() {
  let json: any[] = [];
  let error:string|null = null;

  try {
    const res = await fetch(
      "http://www.kmajw.com/api/CMS/ArticleContent/7/2/142f1752daab40df8577096ad3a98394",
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

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    json = await res.json();
    if (!Array.isArray(json)) {
      throw new Error('返回的数据格式不正确');
    }
  } catch (e) {
    error = e instanceof Error ? e.message : '发生未知错误';
  }

  return (
    <main className="w-full bg-white dark:bg-muted-900 flex justify-center p-4">
      <div className="prose">
        {error ? (
          <div className="text-red-500">
            <p>加载数据时出错：{error}</p>
            <p>请稍后重试或联系管理员</p>
          </div>
        ) : json.length === 0 ? (
          <p>暂无数据</p>
        ) : (
          <ul>
            {json.map((e) => (
              <li key={e.ID}>
                <Link 
                  className="!no-underline hover:underline hover:text-primary-600 hover:bg-primary-100" 
                  href={"/kunming-living/articles/" + e.ID}
                >
                  {e.ArticleNameZH}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}