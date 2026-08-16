# Deployment

The app is an **offline-first PWA**. All application data lives in the browser (IndexedDB), so **no database, cache, or environment variables are required** at runtime.

## Requirements

- Node.js **18.18+** (Next.js 15 requirement)
- HTTPS in production (required for service workers / PWA)

## Build

```bash
npm install
npm run build      # Produces .next/ + public/sw.js (service worker)
npm start          # Serve the production build locally
```

The service worker and workbox runtime files are generated into `public/` during `npm run build`. They are gitignored — do not commit them.

## Deploying to Netlify

The repo ships with `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = ".next"
  environment = { NODE_VERSION = "18", NPM_FLAGS = "--legacy-peer-deps" }
```

Headers are already configured for `sw.js` (correct `Service-Worker-Allowed`), the manifest, and long-lived static asset caching.

Steps:

1. Push the repo to GitHub/GitLab.
2. In Netlify: **Add new site → Import an existing project**.
3. Build settings are auto-detected from `netlify.toml`.
4. Deploy. The site is served from `.next`.

## Deploying to Vercel

Vercel auto-detects Next.js — no config needed:

1. Import the repo in Vercel.
2. Framework preset: **Next.js**, build command `npm run build`.
3. Deploy.

## PWA in Production

- PWA features are **disabled in development** (`disable: process.env.NODE_ENV === 'development'` in `next.config.ts`). Test PWA with `npm run build && npm start`.
- HTTPS is mandatory for service workers. Both Netlify and Vercel provide it by default.

## Deployment Checklist

- [ ] `npm run build` succeeds
- [ ] `npm start` serves the app
- [ ] `/sw.js` and `/manifest.json` respond correctly
- [ ] Locale routes work (`/ar/...`, `/en/...`)
- [ ] Offline mode works after first load (via IndexedDB + service worker)
- [ ] PWA is installable (DevTools → Application → Manifest valid)
