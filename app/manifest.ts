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
