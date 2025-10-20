import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel automatically sets outputFileTracingRoot for monorepos
  // No need to set turbopack.root as it conflicts with Vercel's settings
  output: 'standalone',
};

export default nextConfig;
