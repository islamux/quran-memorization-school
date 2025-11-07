# Netlify Deployment Guide

## Prerequisites
- GitHub/GitLab/Bitbucket account with your repository
- Netlify account (free tier available)

## Quick Deploy

### Method 1: Deploy via Git (Recommended)

1. **Push your code to a Git repository**
   ```bash
   git add .
   git commit -m "Prepare for Netlify deployment"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com) and sign in
   - Click "Add new site" → "Import an existing project"
   - Connect your Git provider and select this repository

3. **Configure build settings**
   - Netlify will auto-detect Next.js and fill in the settings
   - Verify the following settings:
     ```
     Build command: npm run build
     Publish directory: .next
     Node version: 18
     ```
   - If not auto-detected, update these settings manually

4. **Deploy**
   - Click "Deploy site"
   - Wait for the build to complete (2-3 minutes)
   - Your site will be available at `https://[random-name].netlify.app`

### Method 2: Deploy via CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod
   ```

## Environment Variables

If your app uses environment variables, set them in Netlify:

1. Go to Site settings → Environment variables
2. Add the following (if needed):
   - `NODE_VERSION`: `18`
   - `NPM_FLAGS`: `--legacy-peer-deps`

## Configuration Files

The following files have been created for optimal Netlify deployment:

- `netlify.toml` - Netlify configuration (build settings, headers, redirects)
- `public/_redirects` - Client-side routing redirects

## PWA Configuration

This app includes PWA (Progressive Web App) features:

- **Service Worker**: `/sw.js` - Caches resources for offline use
- **Manifest**: `/manifest.json` - Enables "Add to Home Screen"
- **Background Sync**: Syncs data when connection is restored

PWA features work in production build only (not in development).

## Post-Deployment

### 1. Test PWA Features
- Visit your deployed site
- Open browser DevTools → Application → Service Workers
- Verify service worker is registered
- Try "Add to Home Screen" from browser menu

### 2. Configure Custom Domain (Optional)
- Go to Site settings → Domain management
- Add custom domain and follow DNS configuration

### 3. Enable Netlify Analytics (Optional)
- Go to Site analytics in Netlify dashboard
- Enable analytics for visitor insights

## Troubleshooting

### Build Fails
- Check Build logs in Netlify dashboard
- Ensure Node.js version is 18
- Verify all dependencies are in package.json

### 404 Errors on Refresh
- Ensure `public/_redirects` file exists
- Check netlify.toml has proper configuration

### PWA Not Working
- PWA only works in production builds
- Ensure HTTPS is enabled (automatic with Netlify)
- Check browser console for service worker errors

### Locale Routes Not Working
- Ensure middleware.ts is properly configured
- Check that internationalization is working locally first

## Important Notes

1. **Node.js Version**: Netlify defaults to Node 16. Ensure it's set to 18 in Site settings.

2. **Build Size**: The app has a first load JS of ~100kB. This is normal for Next.js with PWA features.

3. **API Routes**: This app uses Dexie.js (IndexedDB) for client-side storage. API routes have been removed as they're not needed.

4. **Offline Support**: The app works offline after first load thanks to PWA features and IndexedDB storage.

## Support

For issues:
1. Check [Netlify Docs](https://docs.netlify.com/)
2. Check [Next.js on Netlify](https://docs.netlify.com/integrations/frameworks/next-js/)
3. Review build logs in Netlify dashboard

## Performance Optimization

After deployment:
- Netlify automatically handles compression and CDN
- Service worker caches resources for faster subsequent loads
- Static assets are cached for 1 year (immutable)
- Images are cached for 1 year
