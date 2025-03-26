/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable static exports for blog portfolio
  output: 'export',
  // Configure image optimization
  images: {
    unoptimized: true, // For static export, we set this to true
    domains: [], // Add any domains for remote images here
  },
  // Configure base path if site is not hosted at domain root
  // basePath: '',
  // Configure trailing slashes preference (default is false)
  trailingSlash: true,
  // Configure asset prefix for CDN support if needed
  // assetPrefix: '',
};

module.exports = nextConfig;

