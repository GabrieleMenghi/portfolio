import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build autosufficiente per Docker sul VPS
  output: "standalone",
  poweredByHeader: false,
};

export default nextConfig;
