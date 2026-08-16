# Competitive Review

This document compares Quran Memorization School against 10 alternative apps across features, UX, and architecture. Findings drive the P0/P1/P2 backlog in Phases 3 and 4.

## Apps Reviewed

| # | App | Type | Platform | Notes |
|---|-----|------|----------|-------|
| 1 | **Tarteel** | Quran memorization | iOS/Android | AI-powered, most popular dedicated Quran memorization app |
| 2 | **Quran Companion** | Quran memorization | iOS/Android | Memorization tracker with audio |
| 3 | **Quranly** | Quran reading | iOS/Android/Web | Reading tracker with social/community features |
| 4 | **Quran Tracker** | Memorization tracker | Web | Simple web-based progress tracker |
| 5 | **MadrasaApp** | Islamic school mgmt | Web | Madrasa/student management |
| 6 | **Noor Platform** | Islamic education | Web | Multi-module Islamic education platform |
| 7 | **Classter** | School management SaaS | Web | General school management with modules |
| 8 | **Fedena** | School ERP | Web | Open source school management |
| 9 | **SchoolTime** | School management | Web | Cloud-based school management |
| 10 | **OpenSIS** | School information | Web | Open source student information system |

## Feature Matrix

### Core Features

| Feature | This App | Tarteel | Quran Companion | Quranly | Quran Tracker | MadrasaApp | Noor | Classter | Fedena | SchoolTime | OpenSIS |
|---------|----------|---------|-----------------|---------|---------------|------------|------|----------|--------|------------|---------|
| Student management | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Teacher management | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Attendance tracking | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Schedule management | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Quran memorization tracking | ⚠️ basic | ✅ AI | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Surah/para progress | ⚠️ seed data only | ✅ detailed | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Audio recitation | ❌ | ✅ AI | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Tajweed guidance | ❌ | ✅ AI | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Reports/analytics | ⚠️ basic | ✅ | ⚠️ | ✅ | ⚠️ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Payment/billing | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

### Technical Features

| Feature | This App | Tarteel | Quran Companion | Quranly | Quran Tracker | MadrasaApp | Noor | Classter | Fedena | SchoolTime | OpenSIS |
|---------|----------|---------|-----------------|---------|---------------|------------|------|----------|--------|------------|---------|
| Offline support | ✅ PWA | ✅ native | ✅ native | ⚠️ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Multi-language | ✅ 5 locales | ✅ many | ✅ | ✅ | ❌ | ⚠️ | ⚠️ | ✅ many | ✅ | ✅ | ✅ |
| RTL support | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ⚠️ | ⚠️ | ⚠️ |
| Mobile responsive | ⚠️ | ✅ native | ✅ native | ✅ | ⚠️ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| PWA installable | ✅ | N/A (native) | N/A (native) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Dark mode | ❌ broken | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Search | ⚠️ basic | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Push notifications | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ |
| Data export | ❌ | ✅ | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| API/backend | ❌ client-only | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Multi-device sync | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| User roles/permissions | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

### UX & Design

| Aspect | This App | Tarteel | Quran Companion | Quranly | Quran Tracker | MadrasaApp | Noor | Classter | Fedena | SchoolTime | OpenSIS |
|--------|----------|---------|-----------------|---------|---------------|------------|------|----------|--------|------------|---------|
| Visual polish | ⚠️ inconsistent | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| Arabic typography | ⚠️ fallback | ✅ native | ✅ native | ✅ | ❌ | ✅ | ✅ | ⚠️ | ⚠️ | ⚠️ | ⚠️ |
| Icons | ⚠️ emoji | ✅ custom | ✅ custom | ✅ custom | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Loading states | ⚠️ dead skeletons | ✅ smooth | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Error feedback | ⚠️ alert() | ✅ toasts | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Empty states | ⚠️ raw text | ✅ illustrated | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Onboarding | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Accessibility | ⚠️ basic | ⚠️ | ⚠️ | ⚠️ | ❌ | ⚠️ | ⚠️ | ✅ | ⚠️ | ⚠️ | ⚠️ |

**Legend:** ✅ Full | ⚠️ Partial/basic | ❌ Missing | ⭐ Visual quality rating

## Gap Analysis

### Where We Lead (Unique Strengths)

1. **Offline-first PWA** — Only this app + Tarteel/Quran Companion (native) offer true offline support. No web-based competitor does.
2. **All-in-one** — Only app combining student/teacher management + attendance + schedule + Quran tracking in one tool. Competitors specialize in one area.
3. **5-locale RTL support** — Most comprehensive locale coverage of any competitor. Tarteel has many locales but is consumer-focused.
4. **Open source / self-hostable** — No vendor lock-in. Most competitors are SaaS-only.

### Critical Gaps (vs Top Competitors)

1. **Quran memorization tracking is weak** — Tarteel, Quran Companion, Quranly all have detailed per-ayah tracking, audio, AI feedback. Our app has seed data for surahs but no real tracking UI.
2. **No audio/recitation** — Every Quran-focused competitor has audio playback. We have none.
3. **No multi-device sync** — Client-only IndexedDB means data is trapped in one browser. Every SaaS competitor syncs across devices.
4. **No user roles** — No admin/teacher/student distinction. Every school management competitor has role-based access.
5. **No reports/analytics** — Basic attendance reports only. Competitors have dashboards, trends, exportable reports.
6. **No payment/billing** — MadrasaApp, Noor, Classter all handle tuition tracking.
7. **No push notifications** — No way to notify students/teachers of schedule changes or attendance.
8. **No dark mode** — Broken dark mode (removed in plan). Every competitor has it.
9. **No data export** — Can't export student lists, attendance records, or reports.
10. **UX polish gap** — Emoji icons, alert() feedback, inconsistent layouts, broken skeletons, hardcoded Arabic in attendance pages.

### What Competitors Lack (Our Opportunities)

1. **Offline-first school management** — No web-based school management tool works offline. We can own this niche.
2. **Quran + school management combo** — No app combines Quran memorization tracking with school administration. This is our unique value proposition.
3. **Lightweight / no-backend** — Our zero-infrastructure model (no server, no database, no API keys) is simpler than any SaaS competitor.
4. **Arabic-first design** — Most competitors are English-first with Arabic bolted on. We can be Arabic-first by design.

## Prioritized Backlog

### P0 — Must Have (Ship Blockers)

These close critical gaps that prevent the app from being usable.

| # | Item | Effort | Source |
|---|------|--------|--------|
| P0.1 | **Fix broken layouts** — attendance pages (hardcoded Arabic, blue accents, raw HTML), schedule page consistency | Medium | UX gap #9, design survey |
| P0.2 | **i18n attendance pages** — add `attendancePage.*` keys, replace hardcoded Arabic/English strings with t() calls | Medium | UX gap #9 |
| P0.3 | **Replace alert() with Toast** — all CRUD feedback (add/edit/delete student/teacher) uses browser alert() | Small | UX gap #5 |
| P0.4 | **Fix locale switcher** — currently shows only 2 of 5 locales (ar/en only) | Small | UX gap #3 |
| P0.5 | **Remove broken dark mode** — partial, inconsistent, YAGNI (per user decision) | Small | YAGNI cleanup |
| P0.6 | **Delete dead code** — `src/lib/rtl.ts` (unused), dead "Add class" button, unused skeleton components (keep skeletons for Phase 4 redesign) | Small | Code cleanup |

### P1 — Should Have (Competitive Parity)

These close gaps that prevent competing with alternatives.

| # | Item | Effort | Source |
|---|------|--------|--------|
| P1.1 | **Quran memorization progress tracker** — per-student per-surah progress with last-reviewed date, confidence level, next-review scheduling (spaced repetition) | Large | Gap #1 |
| P1.2 | **Student attendance report with charts** — attendance rate by student, by class, by month with bar/line charts | Medium | Gap #5 |
| P1.3 | **Data export** — export students, attendance, schedule as CSV/PDF | Medium | Gap #8 |
| P1.4 | **Search across all entities** — students, teachers, surahs with fuzzy matching | Medium | Gap #9 (UX) |
| P1.5 | **User roles** — admin vs teacher vs student views with permission gating | Large | Gap #4 |
| P1.6 | **Multi-device sync** — backend API + cloud sync for cross-device access | Large | Gap #3 |
| P1.7 | **Print-friendly views** — attendance sheets, student lists, schedule grids | Small | Gap #5 (reports) |

### P2 — Nice to Have (Differentiation)

These create competitive advantage beyond parity.

| # | Item | Effort | Source |
|---|------|--------|--------|
| P2.1 | **Audio recitation playback** — play surah audio for each memorization session | Large | Gap #2 |
| P2.2 | **Push notifications** — schedule reminders, attendance alerts, new lesson notifications | Medium | Gap #7 |
| P2.3 | **Payment/tuition tracking** — monthly fees, payment history, outstanding balances | Large | Gap #6 |
| P2.4 | **Dark mode (proper)** — design token based, system preference detection | Medium | Gap #8 |
| P2.5 | **Onboarding wizard** — first-run experience for new schools/admins | Medium | Gap #7 (UX) |
| P2.6 | **Tajweed feedback** — AI-powered pronunciation analysis (like Tarteel) | Very Large | Gap #2 (advanced) |
| P2.7 | **Multi-school support** — single deployment serving multiple schools | Large | Competitive |
| P2.8 | **Community features** — leaderboards, class rankings, parent views | Medium | Gap #1 (social, like Quranly) |

## Recommendations

### Short-term (Phase 3 + 4: this sprint)

Focus on **P0 items** + **P1.7** (print-friendly views). These close the most visible gaps with minimal effort:

1. Fix layouts + i18n attendance pages (P0.1, P0.2) — makes the app feel polished
2. Toast notifications + locale switcher + dark mode removal (P0.3, P0.4, P0.5) — quick wins
3. Delete dead code (P0.6) — reduces confusion
4. Print-friendly views (P1.7) — useful for offline-first madrasas

### Medium-term (next sprint)

1. Quran memorization tracker (P1.1) — this is THE differentiator
2. Attendance reports with charts (P1.2)
3. Data export (P1.3)
4. Search (P1.4)

### Long-term (post-MVP)

1. Multi-device sync (P1.6) — requires backend architecture decision
2. User roles (P1.5)
3. Audio recitation (P2.1)
4. Payment tracking (P2.3)
