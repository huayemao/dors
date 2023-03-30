/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
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
