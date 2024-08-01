import { SITE_META } from "@/constants";
import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_META.name,
    short_name: SITE_META.name,
    description: SITE_META.description,
    start_url: "/",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#8a63d2",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "img/icons/icon-48x48.png",
        sizes: "32x32",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "img/icons/icon-48x48.png",
        sizes: "48x48",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "img/icons/icon-72x72.png",
        sizes: "72x72",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "img/icons/icon-96x96.png",
        sizes: "96x96",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "img/icons/icon-128x128.png",
        sizes: "128x128",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "img/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "img/icons/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "img/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "题目编辑器",
        url: "/qa-input",
        // description: "List of events planned for today",
      },
      {
        name: "私有文章",
        url: "/protected",
      },
    ],
  };
}
