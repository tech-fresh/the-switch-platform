import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.SWITCH_NEXT_DIST_DIR?.trim() || ".next",
};

export default nextConfig;
