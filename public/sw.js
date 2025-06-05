const ASSETS = [
  "/notes",
  // "/shiki/languages/c.tmLanguage.json",
  // "/shiki/languages/cpp.tmLanguage.json",
  // "/shiki/languages/css.tmLanguage.json",
  // "/shiki/languages/html.tmLanguage.json",
  // "/shiki/languages/java.tmLanguage.json",
  // "/shiki/languages/javascript.tmLanguage.json",
  // "/shiki/languages/json.tmLanguage.json",
  // "/shiki/languages/jsx.tmLanguage.json",
  // "/shiki/languages/powershell.tmLanguage.json",
  // "/shiki/languages/shellscript.tmLanguage.json",
  // "/shiki/languages/sql.tmLanguage.json",
  // "/shiki/languages/tsx.tmLanguage.json",
  // "/shiki/languages/typescript.tmLanguage.json",
  // "/shiki/languages/vue.tmLanguage.json",
  // "/shiki/languages/yaml.tmLanguage.json",
  // "/shiki/onig.wasm",
];
importScripts('/version.js')
const DYNAMIC_PATHS = ['/_next/static/chunks', 'favicon.ico', "/herbal", "/navigation", "/notes", "/apps"]
const SSR_PATHS = ['/navigation?_rsc', "/notes?_rsc", "/apps"]
const STABLE_DYNAMIC_PATHS = [
  "/api/files",
  '/shiki/',
  '/_next/image',
  'https://unpkg.com/@ffmpeg/',
  'twimg.com',
  'sns-bak-v1.xhscdn.com'
]


self.addEventListener("fetch", (e) => {
  const { request: s } = e,
    url = new URL(s.url);
  const isDynamicCache = DYNAMIC_PATHS.some(s => url.href.includes(s))
  const isStableDynamicCache = STABLE_DYNAMIC_PATHS.some(s => url.href.includes(s))
  const isAssetsCache = ASSETS.some(s => url.href.includes(s))
  
  if (
    ("GET" === s.method &&
      (self.location.origin === url.origin || url.href.includes('unpkg.com')) && (
        isAssetsCache || isDynamicCache || isStableDynamicCache
      )
    )
  ) {
    e.respondWith(
      (async () => {
        // 首先尝试从缓存中获取
        const cachedResponse = await caches.match(s);
        if (cachedResponse) {
          return cachedResponse;
        }

        // 如果缓存中没有，则获取新响应
        const response = await fetch(s);
        
        // 根据不同的缓存策略存储响应
        if (isStableDynamicCache) {
          const cache = await caches.open("STABLE_CACHE");
          await cache.put(s, response.clone());
        } else if (isDynamicCache) {
          const isSSRPath = SSR_PATHS.find(path => url.href.includes(path));
          if (!isSSRPath) {
            const cache = await caches.open(VERSION);
            await cache.put(s, response.clone());
          }
        }
        
        return response;
      })()
    );
  }
}),
  self.addEventListener("install", (e) => {
    const s = caches.open(VERSION).then((e) => e.addAll(ASSETS));
    e.waitUntil(s);
  }),
  self.addEventListener("activate", (e) => {
    self.clients.claim();
    const s = caches.keys().then((e) => {
      const s = e.map((e) => {
        if (![VERSION, "STABLE_CACHE"].includes(e)) return caches.delete(e);
      });
      return Promise.all(s);
    });
    e.waitUntil(s);
  }),
  self.addEventListener("message", (e) => {
    const { type, path } = e.data;

    if (type === "skip-waiting") {
      self.skipWaiting();
    }

    if (type === "revalidate-page") {
      caches.open(VERSION).then((cache) => {
        cache.keys().then((requests) => {
          const matched = requests.find(request => request.url.includes(path))
          if (matched) {
            cache.delete(matched)
          }
        })
      }).then(() => {
        console.log(`已清除路径 ${path} 的缓存`);
        self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({
              type: "revalidate-success",
              path
            });
          });
        });
      });
    }
  });
