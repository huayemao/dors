import withPlaiceholder from "@plaiceholder/next";
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.resolve.fallback = { fs: false, child_process: false };
    return config;
  },

  pageExtensions:
    process.env.OUTPUT_MODE === "export" && !process.env.GITHUB_PAGE
      ? ["page.tsx", "placeholder.tsx"]
      : undefined,
  images: {
    unoptimized: process.env.OUTPUT_MODE === "export",
    remotePatterns: [
      "huayemao.run",
      "pexels.com",
      "imghost.net",
      "svgshare.com",
      "fms.news.cn",
      "project-management.info",
      "runestone.academy",
    ].map((e) => ({
      protocol: "https",
      hostname: "**." + e,
      port: "",
    })),
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
      afterFiles: [
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
      ],
    };
  },
};

export default withPlaiceholder(nextConfig);
