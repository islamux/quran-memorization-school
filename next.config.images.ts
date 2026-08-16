// Image optimization configuration for Next.js
import type { ImageConfig } from 'next/dist/shared/lib/image-config';

const imageConfig: ImageConfig = {
  // Enable modern image formats
  formats: ['image/avif', 'image/webp'],

  // Responsive image breakpoints
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

  // Cache optimized images for 30 days
  minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days

  // Allow SVG optimization
  dangerouslyAllowSVG: true,

  // Content Security Policy for images
  contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
};

export default imageConfig;
