/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
  },
  // Enable strict mode for better development experience
  reactStrictMode: true,
  // Enable SWC minification for better performance
  swcMinify: true,
  // Custom webpack configuration if needed
  webpack: (config) => {
    return config;
  },
};

module.exports = nextConfig;