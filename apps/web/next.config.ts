import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@parentassist/config', '@parentassist/types'],
};

export default nextConfig;
