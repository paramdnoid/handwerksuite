import type { NextConfig } from 'next';
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  transpilePackages: [
    '@zunftgewerk/ui',
    '@zunftgewerk/app-core',
    '@zunftgewerk/auth',
    '@zunftgewerk/api',
    '@zunftgewerk/sync',
    '@zunftgewerk/types',
  ],
};

export default withBundleAnalyzer(nextConfig);
