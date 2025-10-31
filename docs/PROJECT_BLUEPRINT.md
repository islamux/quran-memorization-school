# New Muslim Stories - Project Blueprint

## Overview

A Next.js 15 application showcasing inspiring conversion stories. Features:
- **Multi-language**: English & Arabic with RTL support
- **Static generation**: Fast, SEO-friendly pages
- **TypeScript**: Full type safety
- **Tailwind CSS**: Utility-first styling
- **File-based content**: Markdown stories

---

## Phases

### Phase 1: Project Setup
1. **Initialize project**
   ```bash
   npx create-next-app@latest new-muslim-stories --typescript --tailwind --app --eslint
   cd new-muslim-stories
   ```

2. **Install dependencies**
   ```bash
   npm install next-intl gray-matter remark remark-html
   ```

3. **Configure locales** - Edit `src/i18n/config.ts`:
   ```typescript
   export const locales = ['en', 'ar'] as const;
   export const defaultLocale = 'en';
   ```

4. **Setup middleware** - Create `src/middleware.ts`:
   ```typescript
   import createMiddleware from 'next-intl/middleware';
   import {locales, defaultLocale} from '@/i18n/config';

   export default createMiddleware({
     locales,
     defaultLocale,
     localePrefix: 'always'
   });
   ```

### Phase 2: Content Structure
1. **Create directories**
   ```
   src/
   ├── stories/          # Markdown files
   ├── messages/         # i18n translations
   └── lib/
       └── stories.ts    # Content logic
   ```

2. **Add story files** - Create markdown with frontmatter:
   ```yaml
   ---
   title: "My Journey to Islam"
   author: "John Doe"
   country: "USA"
   language: "en"
   ---
   Story content here...
   ```

3. **Setup i18n files** - `messages/en.json` and `messages/ar.json`:
   ```json
   {
     "Home": {
       "title": "New Muslim Stories",
       "subtitle": "Inspiring conversion stories"
     }
   }
   ```

### Phase 3: Core Implementation
1. **Build stories utility** - `src/lib/stories.ts`:
   - Read markdown files
   - Parse frontmatter with gray-matter
   - Convert markdown to HTML
   - Filter by locale

2. **Create layouts**:
   - Root layout: `src/app/layout.tsx`
   - Locale layout: `src/app/[locale]/layout.tsx` (with RTL support)

3. **Build pages**:
   - Home page: List all stories
   - Story detail: Individual story page with static generation

### Phase 4: UI & Styling
1. **Components to create**:
   - Story card component
   - Language switcher
   - Layout wrapper
   - Navigation

2. **Styling approach**:
   - Use Tailwind CSS
   - RTL support with `dir={locale === 'ar' ? 'rtl' : 'ltr'}`
   - Responsive design
   - Clean, readable typography

### Phase 5: Optimization
1. **Static generation**:
   ```typescript
   export async function generateStaticParams() {
     // Generate paths for all stories
   }
   ```

2. **SEO**:
   - Add metadata in `generateMetadata`
   - Open Graph tags
   - Sitemap generation

3. **Performance**:
   - Image optimization
   - Code splitting
   - Prefetch links

### Phase 6: Testing & Deployment
1. **Test locally**:
   ```bash
   npm run dev
   npm run build
   npm run start
   ```

2. **Deploy to Vercel**:
   ```bash
   npm install -g vercel
   vercel
   ```

---

## Technology Stack

### Core
- **Next.js 15** - Latest App Router
- **TypeScript 5** - Type safety
- **React 19** - UI library

### Content
- **Markdown files** - Story content
- **gray-matter** - Frontmatter parser
- **remark/remark-html** - Markdown to HTML

### Internationalization
- **next-intl** - i18n solution (native, not next-i18next)

### Styling
- **Tailwind CSS 4** - Utility-first CSS
- **Native CSS** - Simple custom styles

### Deployment
- **Vercel** - Optimized for Next.js
- **Static export** - Or use Vercel hosting

---

## Project Structure

```
new-muslim-stories/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── page.tsx          # Home page
│   │   │   └── stories/
│   │   │       └── [slug]/
│   │   │           └── page.tsx  # Story page
│   │   └── layout.tsx            # Root layout
│   ├── i18n/
│   │   └── config.ts             # Locale settings
│   ├── lib/
│   │   └── stories.ts            # Story utilities
│   ├── messages/
│   │   ├── en.json               # English translations
│   │   └── ar.json               # Arabic translations
│   └── stories/                  # Markdown stories
│       ├── story-1.md
│       └── story-1-ar.md
├── middleware.ts                 # i18n middleware
├── next.config.ts               # Next.js config
└── tailwind.config.ts           # Tailwind config
```

---

## Best Practices

### Content Management
1. **File naming**: Use lowercase, hyphens (e.g., `my-journey.md`)
2. **Frontmatter required**: `title`, `author`, `language` (en/ar)
3. **Images**: Store in `public/images/` and reference in markdown
4. **Content length**: Aim for 500-2000 words per story

### Code Quality
1. **TypeScript**: Define interfaces for story data
2. **Components**: Keep small, reusable components
3. **Error handling**: Graceful fallbacks for missing content
4. **Performance**: Use React Server Components where possible

### Internationalization
1. **Translation keys**: Use nested objects (e.g., `Home.title`)
2. **Content**: Write Arabic stories for RTL testing
3. **Date/number formatting**: Use Intl APIs
4. **Text direction**: Set `dir` attribute on layout

### SEO & Accessibility
1. **Metadata**: Each story needs unique title/description
2. **Headings**: Proper heading hierarchy (h1, h2, h3)
3. **Images**: Add alt text
4. **Links**: Use descriptive link text

---

## Common Tasks

### Adding a New Story
1. Create markdown file in `src/stories/`
2. Add required frontmatter
3. Write content in markdown
4. Create Arabic version if needed (add `-ar` suffix)
5. Add translation keys if needed
6. Rebuild site (auto-reload in dev)

### Adding Translations
1. Update `messages/en.json` with new keys
2. Add translations to `messages/ar.json`
3. Use in components: `useTranslations('Section')`

### Modifying Styling
1. Edit component files
2. Use Tailwind classes
3. Custom CSS: Add to `src/app/globals.css`
4. Test both LTR and RTL layouts

---

## Troubleshooting

### Story Not Showing
- Check file name matches slug
- Verify `language` in frontmatter
- Ensure markdown is valid

### Translation Not Working
- Verify key exists in both language files
- Check for typos in key names
- Restart dev server after changes

### RTL Issues
- Add `dir="rtl"` to Arabic layout
- Check Tailwind CSS RTL plugin
- Test navigation flow

### Build Errors
- Run `npm run lint` to check code quality
- Verify TypeScript types
- Check for broken imports

---

## Resources

### Documentation
- [Next.js 15 App Router](https://nextjs.org/docs/app)
- [next-intl Guide](https://next-intl-docs.vercel.app/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Markdown Guide](https://www.markdownguide.org/)

### Tools
- [Gray Matter](https://github.com/jonschlinkert/gray-matter)
- [remark](https://github.com/remarkjs/remark)

---

## Notes

- Keep dependencies minimal - use native solutions when possible
- Start simple, add complexity only when needed
- Test on mobile devices for RTL support
- Consider caching for better performance
- Use TypeScript strictly for better DX
