import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
import imageConfig from './next.config.images';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  images: imageConfig,
};

export default withNextIntl(nextConfig);
