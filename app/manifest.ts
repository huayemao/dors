import { SITE_META } from "@/constants";
import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_META.name,
    short_name: SITE_META.name,
    description: SITE_META.description + "——" + SITE_META.introduction,
    start_url: "/",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#312e81",
    "icons": [
      {
        "src": "/pwa-192x192.png",
        "sizes": "192x192",
        "type": "image/png",
        "purpose": "any"
      },
      {
        "src": "/pwa-512x512.png",
        "sizes": "512x512",
        "type": "image/png",
        "purpose": "any"
      },
      {
        "src": "/pwa-maskable-192x192.png",
        "sizes": "192x192",
        "type": "image/png",
        "purpose": "maskable"
      },
      {
        "src": "/pwa-maskable-512x512.png",
        "sizes": "512x512",
        "type": "image/png",
        "purpose": "maskable"
      }
    ],

    // todo: 动态化，存到 settings 表
    shortcuts: [
      {
        name: "小记",
        url: "/notes",
        icons: [
          {
            src: "img/icons/notebook-pen.svg",
            sizes: "any",
          },
        ],
      },
      {
        name: "自留地",
        url: "/protected",
        icons: [
          {
            src: "img/icons/globe-lock.svg",
            sizes: "any",
          },
        ],
      },
      {
        name: "题目编辑器",
        url: "/qas",
        icons: [
          {
            src: "img/icons/table-properties.svg",
            sizes: "any",
          },
        ],
        // description: "List of events planned for today",
      },
    ],
    share_target: {
      action: "/api/files",
      // @ts-ignore
      method: "POST",
      enctype: "multipart/form-data",
      params: {
        // @ts-ignore
        files: {
          name: "files",
          accept: ["image/*"],
        },
      },
    },
  };
}
