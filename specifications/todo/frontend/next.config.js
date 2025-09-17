/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  poweredByHeader: false,
  trailingSlash: false,
  swcMinify: true,
};

module.exports = nextConfig;
