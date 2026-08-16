import { defaultCache } from "@serwist/next/worker";
import { Serwist } from "serwist";

const serwist = new Serwist({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  precacheEntries: (self as any).__SW_MANIFEST,
  navigationPreload: true,
  runtimeCaching: defaultCache,
  skipWaiting: true,
  clientsClaim: true,
});

serwist.addEventListeners();
