import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  // Set turbopack root to frontend directory to avoid lockfile conflicts
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
