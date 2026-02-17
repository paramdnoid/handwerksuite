import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@handwerksuite/ui",
    "@handwerksuite/app-core",
    "@handwerksuite/auth",
    "@handwerksuite/api",
    "@handwerksuite/types",
  ],
};

export default nextConfig;
