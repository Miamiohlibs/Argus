import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  basePath: process.env.APP_BASEPATH ? `${process.env.APP_BASEPATH}` : '',
  assetPrefix: process.env.APP_BASEPATH ? `${process.env.APP_BASEPATH}/` : '',
  trailingSlash: true,
  experimental: {
    authInterrupts: true,
  },
};

export default nextConfig;
