import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    disableStaticImages: true,
    domains: ['www.datocms-assets.com', 'image.mux.com'],
    imageSizes: [
      360, 480, 560, 640, 768, 860, 940, 1024, 1280, 1366, 1440, 1600, 1920,
      2560, 3840
    ],
    minimumCacheTTL: 60,
    formats: ['image/webp', 'image/avif']
  },
  trailingSlash: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  env: {
    TOGETHER_AI_API_KEY: process.env.TOGETHER_AI_API_KEY,
  },
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000, // Check for changes every second
      aggregateTimeout: 300, // Delay rebuild slightly
    };
    return config;
  },
};

export default nextConfig;
