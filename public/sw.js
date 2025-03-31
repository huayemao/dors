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
const DYNAMIC_PATHS = ['/_next/static/chunks', 'favicon.ico', "/herbal", "/navigation", "/apps"]
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
    if (isStableDynamicCache) {
      caches.match(url).then((res) => {
        if (!res) {
          caches.open("STABLE_CACHE").then((e) => {
            e.add(url);
          });
        }
      });
    }
    if (isDynamicCache) {


      caches.match(url).then((res) => {
        if (!res) {
          const isSSRPath = SSR_PATHS.find(path => url.href.includes(path));
          if (isSSRPath) {
            caches.open(VERSION)
              .then(c => {
                return c.keys()
              }).then(requests => {
                const matched = requests.find(request => request.url.includes(url.pathname + '?'))
                console.log(matched)
                if (matched) {
                  return
                }
                caches.open(VERSION).then((e) => {
                  e.add(url);
                });
              })
          }
          else {
            caches.open(VERSION).then((e) => {
              e.add(url);
            });
          }
        }
      });
    }
    e.respondWith(
      (async () => {
        return caches.match(s).then((e) => {
          const isSSRPath = SSR_PATHS.find(path => url.href.includes(path));
          if (isSSRPath) {
            return caches.open(VERSION)
              .then(c => {
                return c.keys()
              }).then(requests => {
                return requests.find(request => request.url.includes(url.pathname + '?'))
              })
              .then(r => {
                return caches.match(r)
              }).then(e => e || fetch(s))
          } else {
            return e || fetch(s);
          }
        });
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
      caches.open(VERSION).then((cache) => cache.delete(path)).then(() => {
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
