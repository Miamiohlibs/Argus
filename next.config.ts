import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  basePath: process.env.NEXT_PUBLIC_APP_BASEPATH
    ? `${process.env.NEXT_PUBLIC_APP_BASEPATH}`
    : '',
  assetPrefix: process.env.NEXT_PUBLIC_APP_BASEPATH
    ? `${process.env.NEXT_PUBLIC_APP_BASEPATH}/`
    : '',
  trailingSlash: true,
  experimental: {
    authInterrupts: true,
  },
};

export default nextConfig;
