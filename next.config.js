/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.pexels.com'],
  },
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ["prisma", "@prisma/client"],
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

module.exports = nextConfig
