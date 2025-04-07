import withPlaiceholder from "@plaiceholder/next";
import { writeFileSync } from 'fs';
// import webpack from 'next/dist/compiled/webpack/webpack-lib.js';
import crypto from 'crypto';
import path from "path";
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

class RevisionPlugin {
  constructor(options = {}) {
    // 插件的选项可以在这里设置
    this.options = options;
  }

  apply(compiler) {
    // compiler是一个Webpack编译对象，它提供了许多钩子
    compiler.hooks.run.tapAsync('RevisionPlugin', (compilation, callback) => {
      // 在这里执行你的逻辑
      console.log('Webpack build has started!');
      const compilationHash = crypto.createHash('sha1').update(this.options.buildId).digest('hex');
      // 将哈希值写入到文件中
      writeFileSync(path.resolve(__dirname, 'public/version.js'), `const VERSION='${compilationHash}';`);
      // 确保调用回调函数，以继续构建过程
      callback();
    });
  }
}



/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config, { buildId }) {
    config.resolve.fallback = { fs: false, child_process: false };
    config.plugins.push(new RevisionPlugin({ buildId }));
    return config;
  },

  pageExtensions:
    process.env.OUTPUT_MODE === "export" && !process.env.GITHUB_PAGE
      ? ["page.tsx", "placeholder.tsx"]
      : undefined,
  images: {
    unoptimized: process.env.OUTPUT_MODE === "export",
    dangerouslyAllowSVG: true,
    remotePatterns: [
      "huayemao.run",
      "pexels.com",
      "imghost.net",
      "svgshare.com",
      "fms.news.cn",
      "project-management.info",
      "runestone.academy",
    ].flatMap((e) => ([
      {
        protocol: "https",
        hostname: "**." + e,
        port: "",
      },
      {
        hostname: e,
      },
    ]))
  },
  experimental: {
    serverComponentsExternalPackages: ["prisma", "shiki", "vscode-oniguruma"],
  },
  output: process.env.OUTPUT_MODE,
  basePath:
    process.env.OUTPUT_MODE === "export" && process.env.GITHUB_PAGE
      ? "/dors"
      : "",
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  reactStrictMode: false,
  async headers() {
    return [
      {
        source: "/data-process",
        headers: [
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
        ],
      },
      {
        source: "/(.*?).js",
        headers: [
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/images/:path*",
          destination:
            "https://mvw-pro-ynhr.oss-cn-beijing.aliyuncs.com/:path*",
        },
      ],
      fallback: [
        // {
        //   source: '/v1/:path*',
        //   destination: 'http://house.huayemao.run:8099/v1/:path*',
        // },
        {
          source: "/qas/:path*",
          destination: "/qas",
        },
        {
          source: "/notes/:path*",
          destination: "/notes",
        },
        {
          source: "/quotes/:path*",
          destination: "/quotes",
        },
      ],
    };
  },
};

export default withPlaiceholder(nextConfig);
