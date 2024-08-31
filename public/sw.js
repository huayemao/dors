/* eslint-disable no-restricted-globals */
const ASSETS = [
  "/notes",
  "/shiki/languages/c.tmLanguage.json",
  "/shiki/languages/cpp.tmLanguage.json",
  "/shiki/languages/css.tmLanguage.json",
  "/shiki/languages/html.tmLanguage.json",
  "/shiki/languages/java.tmLanguage.json",
  "/shiki/languages/javascript.tmLanguage.json",
  "/shiki/languages/json.tmLanguage.json",
  "/shiki/languages/jsx.tmLanguage.json",
  "/shiki/languages/powershell.tmLanguage.json",
  "/shiki/languages/shellscript.tmLanguage.json",
  "/shiki/languages/sql.tmLanguage.json",
  "/shiki/languages/tsx.tmLanguage.json",
  "/shiki/languages/typescript.tmLanguage.json",
  "/shiki/languages/vue.tmLanguage.json",
  "/shiki/languages/yaml.tmLanguage.json",
  "/shiki/onig.wasm",
];
const VERSION = "578006c24bcb68408d7b01f8f28483d1092c0fb1";

self.addEventListener("fetch", (e) => {
  const { request: s } = e,
    t = new URL(s.url);
  if (
    "GET" === s.method &&
    self.location.origin === t.origin &&
    ASSETS.some((l) => t.pathname.includes(l))
  ) {
    e.respondWith(
      (async () => {
        return caches.match(s).then((e) => {
          console.log(t.pathname, e);
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
