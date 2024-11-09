/* eslint-disable no-restricted-globals */
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
const DYNAMIC_PATHS = ["/api/files", '/shiki/', '/_next']


self.addEventListener("fetch", (e) => {
  const { request: s } = e,
    url = new URL(s.url);
  if (
    ("GET" === s.method &&
      self.location.origin === url.origin &&
      ASSETS.some((l) => url.pathname.includes(l))) || DYNAMIC_PATHS.some(s => url.pathname.includes(s))
  ) {
    if (DYNAMIC_PATHS.some(s => url.pathname.includes(s))) {
      caches.match(url).then((res) => {
        if (!res) {
          caches.open(VERSION).then((e) => e.add(url));
        }
        return res || fetch(s);
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
        if (e !== VERSION) return caches.delete(e);
      });
      return Promise.all(s);
    });
    e.waitUntil(s);
  }),
  self.addEventListener("message", (e) => {
    "skip-waiting" === e.data && self.skipWaiting();
  });
