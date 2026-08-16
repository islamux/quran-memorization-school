import { defaultCache } from "@serwist/next/worker";
import { Serwist } from "serwist";

const CACHE_VERSION = "v4.0.0";

const serwist = new Serwist({
  precacheEntries: (self as any).__SW_MANIFEST,
  navigationPreload: true,
  runtimeCaching: defaultCache,
  skipWaiting: true,
  clientsClaim: true,
});

serwist.addEventListeners();
