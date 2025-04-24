import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['cdn.sanity.io'],
  },
  eslint: {
    ignoreDuringBuilds: true, // 👈 Disables ESLint checks during production builds
  },
};

export default nextConfig;
