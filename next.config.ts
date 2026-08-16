import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
import withSerwist from '@serwist/next';
import imageConfig from './next.config.images';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  images: imageConfig,
};

export default withNextIntl(withSerwist({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
})(nextConfig));
