/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    SANITY_TOKEN: process.env.SANITY_TOKEN,
  },
  images: {
    domains: ['cdn.sanity.io'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
