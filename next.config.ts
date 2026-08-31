import type { NextConfig } from 'next';
import path from 'node:path';
import { version } from './package.json';

const nextConfig: NextConfig = {
  /* config options here */
  outputFileTracingRoot: path.join(__dirname),
  basePath: process.env.NEXT_PUBLIC_APP_BASEPATH
    ? `${process.env.NEXT_PUBLIC_APP_BASEPATH}`
    : '',
  assetPrefix: process.env.NEXT_PUBLIC_APP_BASEPATH
    ? `${process.env.NEXT_PUBLIC_APP_BASEPATH}/`
    : '',
  env: {
    APP_VERSION: version,
  },
  trailingSlash: true,
  experimental: {
    authInterrupts: true,
  },
};

export default nextConfig;
