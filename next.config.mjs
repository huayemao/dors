
import withPlaiceholder from "@plaiceholder/next";
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.pexels.com', 'www.imghost.net', 'svgshare.com', 'fms.news.cn'],
  },
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ["prisma", "@prisma/client", "shiki", "vscode-oniguruma"],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  async rewrites() {
    return {
      afterFiles: [
        {
          source: '/v1/:path*',
          destination: 'http://house.huayemao.run:8099/v1/:path*',
        },
      ],
    }
  },
}

export default withPlaiceholder(nextConfig)
