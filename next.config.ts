import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  distDir: "out",
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
  assetPrefix: "/",
};

export default nextConfig;
