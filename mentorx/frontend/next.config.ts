import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Only enable standalone mode when building Docker containers
  ...(process.env.BUILD_STANDALONE === "true" ? { output: "standalone" } : {}),
};

export default nextConfig;


