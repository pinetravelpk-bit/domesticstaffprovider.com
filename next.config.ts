import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Admin photo uploads go through server actions; allow up to 12 MB.
  experimental: { serverActions: { bodySizeLimit: '13mb' } },
};
export default nextConfig;
