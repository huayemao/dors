
import withPlaiceholder from "@plaiceholder/next";
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: process.env.OUTPUT_MODE === 'export',
    domains: ['images.pexels.com', 'www.imghost.net', 'svgshare.com', 'fms.news.cn', 'project-management.info'],
  },
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ["prisma", "@prisma/client", "shiki", "vscode-oniguruma"],
  },
  output: process.env.OUTPUT_MODE,
  basePath: process.env.OUTPUT_MODE === 'export' ? "/dors" : '',
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  // async rewrites() {
  //   return {
  //     afterFiles: [
  //       {
  //         source: '/v1/:path*',
  //         destination: 'http://house.huayemao.run:8099/v1/:path*',
  //       },
  //     ],
  //   }
  // },
}

export default withPlaiceholder(nextConfig)
