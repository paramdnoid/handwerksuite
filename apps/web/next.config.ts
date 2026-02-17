import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@zunftgewerk/ui",
    "@zunftgewerk/app-core",
    "@zunftgewerk/auth",
    "@zunftgewerk/api",
    "@zunftgewerk/sync",
    "@zunftgewerk/types",
  ],
};

export default nextConfig;
