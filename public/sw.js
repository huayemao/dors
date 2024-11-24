/* eslint-disable no-restricted-globals */
const ASSETS = [
  "/notes",
  "/navigation",
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
const DYNAMIC_PATHS = ['/_next/static/chunks','favicon.ico']
const STABLE_DYNAMIC_PATHS = ["/api/files", '/shiki/','/_next/image']


self.addEventListener("fetch", (e) => {
  const { request: s } = e,
    url = new URL(s.url);
  const isDynamicCache = DYNAMIC_PATHS.some(s => url.pathname.includes(s))
  const isStableDynamicCache = STABLE_DYNAMIC_PATHS.some(s => url.pathname.includes(s))
  const isAssetsCache = ASSETS.some(s => url.pathname.includes(s))
  if (
    ("GET" === s.method &&
      self.location.origin === url.origin && (
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
          caches.open(VERSION).then((e) => {
            e.add(url);
          });
        }
      });
    }
    e.respondWith(
      (async () => {
        return caches.match(s).then((e) => {
          return e || fetch(s);
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
    "skip-waiting" === e.data && self.skipWaiting();
  });
