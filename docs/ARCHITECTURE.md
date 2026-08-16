# Architecture

This document describes the current architecture of the Quran Memorization School app. It reflects the code as it exists today — if it doesn't match the code, the code changed and this doc is out of date.

## Overview

A **Quran Memorization School Management System** — an offline-first Progressive Web App (PWA) for managing students, teachers, class schedules, and daily attendance. All data lives in the browser (IndexedDB via Dexie.js); there is **no server-side database**.

## Tech Stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | Next.js 16 (App Router) | Turbopack dev, webpack production (for Serwist) |
| Language | TypeScript 5.9 (strict) | `tsconfig.json` strict mode |
| Styling | Tailwind CSS 4 | CSS-based config (no `tailwind.config.ts`) |
| Storage | Dexie.js 4 (IndexedDB) | Offline-first, versioned schema |
| Validation | Zod 4 | Runtime schemas in `src/lib/dexieDB.ts` |
| i18n | next-intl 4 | 5 locales, default Arabic |
| PWA | Serwist 9 | `@serwist/next` + `@serwist/cli`, generates `public/sw.js` |
| Icons | lucide-react 1 | |

> **Note:** `zod` is a direct dependency (`zod@^4`). Zod schemas live in `src/lib/dexieDB.ts` and validate all `add`/`update` operations.

## Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── [locale]/             # Internationalized routes (/ar, /en, /fr, /ur, /id)
│   │   ├── page.tsx          # Dashboard
│   │   ├── students/
│   │   │   ├── page.tsx      # Student list
│   │   │   ├── add-student/  # Add student form
│   │   │   └── [id]/         # Student detail + edit
│   │   ├── teachers/
│   │   │   ├── page.tsx      # Teacher list
│   │   │   ├── add-teacher/  # Add teacher form
│   │   │   └── [id]/edit/    # Edit teacher
│   │   ├── schedule/         # Weekly schedule
│   │   └── attendance/       # Attendance + reports
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Root redirect fallback
├── components/               # Layout, StudentCard, LanguageSwitcher, PWAInstallPrompt, ui/*
├── contexts/
│   └── DexieDataContext.tsx  # Data provider + useData() hook
├── data/seedData.ts          # Seed/mock data (students, teachers, schedule, surahs)
├── hooks/useLazyLoad.ts      # useLazyLoad, usePrefetch, useInViewport, useLazyImage
├── i18n/                     # config.ts, request.ts, loadMessages.ts
├── lib/
│   ├── dexieDB.ts            # DB schema, helpers, migration, Zod schemas
│   ├── accessibility.ts      # ARIA constants/helpers
│   ├── rtl.ts                # RTL-aware class helpers
│   ├── schedule.ts           # Weekly schedule helpers
│   ├── students.ts           # Student stats/query helpers
│   └── teachers.ts           # Teacher stats/query helpers
├── messages/                 # ar.json, en.json, fr.json, ur.json, id.json
├── proxy.ts               # next-intl locale routing (Next 16 convention)
├── services/deletionService.ts # Soft-delete workflows & checks
├── types/index.ts            # Student, Teacher, ScheduleSlot, Surah, Progress
└── utils/
    ├── dexieStorage.ts       # Thin convenience layer over dexieDB
    ├── dataUtils.ts          # Pure helpers over seedData (static data)
    └── clientDataUtils.ts    # Hooks over useData() (useTeacherOptions, useStudentById)
```

## Data Layer

### Database Schema (`src/lib/dexieDB.ts`)

Dexie DB name: `QuranSchoolDB`, **schema version 3**:

```typescript
this.version(3).stores({
  students:   'id, name, parentPhone, teacherId, status, parentName, createdAt, updatedAt, [status+teacherId], name.lower',
  teachers:   'id, name, email, phone, status, [status+name], createdAt',
  schedule:   'id, teacherId, day, startTime, endTime, [teacherId+day], [day+startTime]',
  attendance: '++id, studentId, date, status, [studentId+date], [date+status], timestamp',
  syncQueue:  '++id, type, action, timestamp, [type+timestamp]'
});
```

A `students.hook('reading')` lowercases student names so the `name.lower` index works for search.

### Entity Types (`src/types/index.ts`)

- `Student` — `status: 'active' | 'inactive' | 'graduated'`, soft-delete fields (`isDeleted`, `deletedAt`, `deletedBy`)
- `Teacher` — `status: 'active' | 'inactive'`, `students: string[]` (IDs), `schedule: ScheduleSlot[]`
- `ScheduleSlot` — `day` is a named weekday (`'monday'` … `'sunday'`), `startTime`/`endTime` as `"HH:MM"`
- `AttendanceRecord` — defined in `dexieDB.ts`, keyed by `[studentId + date]`
- `Surah`, `Progress` — used by seed data / dashboards

### Validation (Zod)

`dexieDB.ts` exports `studentSchema`, `teacherSchema`, `attendanceSchema`, `scheduleSchema`. All `add`/`update` operations on `studentDB` and `teacherDB` validate input. Validation failure throws a descriptive Arabic error message.

### Query Cache (`cachedDB` in `dexieDB.ts`)

A small in-memory cache (TTL 5 min, max 100 entries) wraps common reads:

- `cachedDB.getStudents / getStudentsByTeacher / getStudentsByStatus / getTeachers / getAttendanceByDate / getAttendanceByStudent`
- `cachedDB.invalidateCache(pattern)` — **must be called after every mutation** (the `studentDB`/`teacherDB`/`attendanceDB` helpers already do this internally)

### Helper Modules

| Module | Purpose |
|--------|---------|
| `studentDB` | `getAll`, `getById`, `add`, `update`, `delete`, `search`, `getByTeacher`, `getByStatus` |
| `teacherDB` | `getAll`, `getById`, `add`, `update`, `delete`, `getActive` |
| `scheduleDB` | `getAll`, `add`, `update`, `delete`, `getByTeacherId` |
| `attendanceDB` | `mark`, `markForDate`, `markBatch`, `getByDate`, `getTodayAttendance`, `getByStudent`, `getStats` |
| `db` | Raw Dexie instance for complex queries |

`src/utils/dexieStorage.ts` is a thin wrapper that also seeds default data on first load (from `src/data/seedData.ts`).

### Migration

`migrateFromLocalStorage()` migrates legacy `localStorage` data (`quran_school_students`, `quran_school_teachers`, `quran_school_schedule`, `attendance_<date>`) into Dexie. It runs once, guarded by the `quran_school_migration_v3` flag.

## Data Flow

```
Pages (src/app/[locale]/*)
  → DexieDataContext (useData: students, teachers, CRUD wrappers)
      → lib helpers (studentDB, teacherDB, scheduleDB, attendanceDB)
          → IndexedDB (Dexie)
```

- **Reads** go through `cachedDB` for caching.
- **Mutations** (`add`/`update`/`delete`) invalidate the relevant cache patterns, then the context calls `loadData()` to refresh in-memory state.
- `deletionService` runs pre-delete checks (related classes, payments, assessments, linked students) and performs soft delete.

## State Management

`DexieDataContext` (client component) is the single source of truth:

- Exposes `students`, `teachers` (non-deleted), `allStudents`, `allTeachers` (includes deleted)
- Mutations: `addStudent`, `updateStudent`, `deleteStudent`, `addTeacher`, `updateTeacher`, `deleteTeacher`
- Deletion checks: `checkStudentDeletion`, `checkTeacherDeletion`
- Shows a loading spinner until data is loaded
- Wrap page content with `DataProvider` and consume via `useData()`

## Internationalization

- 5 locales: `ar` (default, RTL), `en`, `fr`, `ur` (RTL), `id` — defined in `src/i18n/config.ts`
- `src/proxy.ts` uses `next-intl` with `localePrefix: 'always'` (URLs like `/ar/students`)
- `src/i18n/request.ts` loads the message JSON per locale at runtime
- `src/i18n/loadMessages.ts` provides typed `getMessages(locale)`
- UI strings come from `useTranslations('...')` — never hardcoded
- See [TRANSLATION_GUIDE.md](./TRANSLATION_GUIDE.md)

## PWA

Configured in `next.config.ts` via `@serwist/next` (`disable: process.env.NODE_ENV === 'development'`). The service worker source is `src/app/sw.ts` and `public/sw.js` is **generated at build time** using `next build --webpack` — do not commit/commit-track it (it's gitignored now).

- Manifest: `public/manifest.json` (shortcuts → `/ar/students/add-student`, `/ar/attendance`, `/ar/schedule`)
- Icons: `public/icon-192x192.png`, `public/icon-512x512.png` (+ `.svg` sources) — regenerate with `node scripts/generate-icons.js`
- `public/_redirects` + `netlify.toml` headers serve `sw.js` with `Service-Worker-Allowed: /`

## Key Patterns

### Soft Delete

Never hard-delete students/teachers. Mark `isDeleted: true`, set `status` inactive, record `deletedAt`/`deletedBy`. `deletionService` centralizes the logic.

### Hydration Safety

- Never call `Date()`/`Math.random()` during initial render — use `useEffect`
- Keep loading-state structure identical to loaded-state structure
- Client-only logic must live in `useEffect`

### Cache Invalidation

After any data mutation, invalidate the affected cache keys (e.g. `cachedDB.invalidateCache('students:')`). The helpers do this; when writing new mutations, don't forget it.

### Conventions

- Absolute imports via `@/` (maps to `src/`)
- Named exports for utilities/hooks; default export for pages
- Error handling with `try/catch` + `console.error` with context
