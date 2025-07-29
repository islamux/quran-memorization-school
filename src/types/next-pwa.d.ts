declare module 'next-pwa' {
  import { NextConfig } from 'next';
  
  export interface PWAConfig {
    dest?: string;
    register?: boolean;
    scope?: string;
    sw?: string;
    skipWaiting?: boolean;
    disable?: boolean;
    buildExcludes?: RegExp[];
    publicExcludes?: string[];
    runtimeCaching?: any[];
  }
  
  export default function withPWA(config?: PWAConfig): (nextConfig: NextConfig) => NextConfig;
}
