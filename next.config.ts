import type { NextConfig } from 'next';
import path from 'node:path';
import { readFileSync } from 'node:fs';

const projectRoot = process.cwd();
const { version } = JSON.parse(readFileSync(path.join(projectRoot, 'package.json'), 'utf-8'));

const nextConfig: NextConfig = {
  /* config options here */
  outputFileTracingRoot: projectRoot,
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
