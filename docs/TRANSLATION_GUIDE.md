# Translation & Internationalization Guide

How translations and internationalization work in the Quran Memorization School app.

## How It Works

- **Library**: [next-intl](https://next-intl-docs.vercel.app/) (v4)
- **Locale routing**: `src/proxy.ts` — `localePrefix: 'always'`, so URLs look like `/ar/students`
- **Locales**: defined in `src/i18n/config.ts` (`locales` array, `defaultLocale`, `getDirection`, `isRTL`)
- **Messages**: static JSON files in `src/messages/` — `ar.json`, `en.json`, `fr.json`, `ur.json`, `id.json`
- **Loading**: `src/i18n/request.ts` (server/route) and `src/i18n/loadMessages.ts` (`getMessages()` for layout)

## Supported Languages

| Code | Language | Native Name | Direction | Status |
|------|----------|-------------|-----------|--------|
| `ar` | Arabic | العربية | RTL | Default |
| `en` | English | English | LTR | Complete |
| `fr` | French | Français | LTR | Core sections |
| `ur` | Urdu | اردو | RTL | Core sections |
| `id` | Indonesian | Bahasa Indonesia | LTR | Core sections |

## Using Translations in Components

```tsx
'use client';

import { useTranslations, useLocale } from 'next-intl';

export default function StudentsPage() {
  const t = useTranslations('studentsPage');
  const locale = useLocale();

  return (
    <h1>{t('title')}</h1>
    <p>{t('studentCard.versesMemorized', { count: 5 })}</p>
  );
}
```

- Use **nested keys** with `useTranslations('sectionName')`
- Variables: `t('showingStudents', { current: 5, total: 10 })` with `{current}` / `{total}` placeholders in the JSON
- Never hardcode UI strings — always add a translation key

## Message File Structure

Top-level sections (from `src/messages/ar.json`):

| Section | Contents |
|---------|----------|
| `metadata` | `title`, `description` (meta tags) |
| `layout` | `header`, `navigation`, `footer` |
| `homepage` | `welcome`, `stats`, `sections`, `studentCard`, `scheduleCard`, `actions` |
| `common` | shared labels, statuses, `grades` (1st–12th), `surahs` |
| `studentsPage` | list page + `studentCard` |
| `addStudentPage` | form: `fields`, `placeholders`, `actions` |
| `editStudentPage` | form: `fields`, `placeholders`, `actions` |
| `studentDetailPage` | detail view + `deleteConfirmation` |
| `teachersPage` | list + `teacherCard` + `teacherDetail` |
| `schedulePage` | `days`, `slotType`, `subjects`, `rooms`, `scheduleSummary` |
| `editTeacherPage` | form: `fields`, `errors`, `successMessage` |

## Adding a New Language

1. **Update `src/i18n/config.ts`** — add the code to `locales`, add a `localeNames` entry, and update `getDirection` if the language is RTL.
2. **Create `src/messages/<code>.json`** — copy an existing file (start from `en.json` or `ar.json`) and translate every value.
3. **Verify all 5 files have the same keys** — a missing key in one locale falls back to the default (Arabic) at runtime, which looks broken. There is no build-time check; verify manually or with a small script.
4. Restart the dev server (`next-intl` caches message files).

## Best Practices

- **Keep the key structure identical across all locale files.** `en.json` is the reference.
- **Use placeholders** for dynamic content instead of concatenating strings:
  ```json
  { "showingStudents": "Showing {current} of {total} students" }
  ```
- **Don't reorder words** in a sentence that contains a placeholder — translators need freedom to move `{total}` around.
- **Watch text overflow**: translated text can be 30%+ longer than English/Arabic. Test long labels (especially German/French).
- **RTL vs LTR**: use logical CSS utilities (`ms-*`, `me-*`, `ps-*`, `pe-*`, `text-start`, `text-end`) instead of physical ones (`ml-*`, `mr-*`, `text-left`, `text-right`). The app also provides `src/lib/rtl.ts` helpers.
- **Arabic is the default locale** — when in doubt, `ar.json` is the source of truth for the UI.

## Verifying Translations

- Switch the language via the `LanguageSwitcher` component (top-right of the header).
- Check all pages: dashboard, students (list/add/edit/detail), teachers (list/add/edit), schedule, attendance.
- Confirm RTL layout renders correctly for `ar` and `ur`.

## Common Pitfalls

- **Key mismatch between locales** — the most common bug. Always add keys to all 5 files at once.
- **Using `t('full.key.path')`** with `useTranslations('section')` → pass only the tail: `t('studentCard.versesMemorized')`, not `t('studentsPage.studentCard.versesMemorized')`.
- **Hardcoded strings** — grep for Arabic/English literals in `tsx` files; they belong in `messages/`.
