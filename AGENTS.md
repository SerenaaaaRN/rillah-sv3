# rillah-sv3 — Portfolio + Admin CMS (rillah.dev)

Primary context for AI agents. Read this file before changing anything. When a habit conflicts with a rule below, the rule wins.

One package: SvelteKit 3 + Svelte 5 (runes forced) on Cloudflare Workers, with Supabase for Postgres, Auth, and Storage. No separate backend — server `load` + `actions` are the API.

## 1. Tooling

### Skills — load before the matching task

| Skill                              | Use for                                                                                                 |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `svelte-code-writer`               | MUST for any `.svelte`, `.svelte.ts`, `.svelte.js` create, edit, or review. Svelte 5 docs + validation. |
| `svelte-core-bestpractices`        | MUST when touching reactivity (`$state`/`$derived`/`$effect`), event handling, a11y, or performance.    |
| `supabase`                         | MUST for `src/lib/supabase/*`, `locals.supabase` queries, Auth, Storage buckets, SSR (`@supabase/ssr`). |
| `supabase-postgres-best-practices` | MUST when changing `types.ts` tables, `.select()/.order()/.eq()` queries, indexes, or RLS.              |

### MCP

| MCP      | Tools                                                                          | Use for                                                                                                                                                            |
| -------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `svelte` | `list-sections` → `get-documentation` → `svelte-autofixer` → `playground-link` | MUST for any Svelte/SvelteKit question. ALWAYS run `svelte-autofixer` before returning Svelte code. NEVER call `playground-link` once code lands in project files. |

## 2. What this project is

A personal portfolio and single-admin CMS for Duhairillah (Software Engineer). Business model: personal branding plus SEO
(`sitemap.xml`, `robots.txt`, JSON-LD from `src/lib/seo/site.ts`), deployed on Cloudflare Workers.

Public pages:

- `/` — intro/hero (`View My Work` CTA), scrolltelling, about, skills, career, education, GitHub contribution calendar,
  certificates preview, guestbook. User-facing copy is Indonesian; code and comments are English.
- `/projects` — grid with category filter, search, and sort. `/projects/[id]` accepts a UUID or slug (UUID + slug → 301 to
  the slug) and shows an embla carousel of images plus the video.
- `/certificates` — full grid, sharing `certificate-lightbox.svelte` with the landing preview.
- `/blog` — static writing page, `noindex`, not prerendered.

The landing has **no projects section on purpose**. Projects' entry points are the hero CTA, the sidebar, and the mobile
dock; `/projects` is the single home for work, so do not re-add a preview section to `/`.

## 3. Route map

| Route                 | Responsibility                                                                                         |
| --------------------- | ------------------------------------------------------------------------------------------------------ |
| `(landing)/`          | Public SEO pages: `/`, `projects`, `certificates`, `blog`. See the notes below.                        |
| `(auth)/login`        | `LoginSchema`, `signInWithPassword`, Indonesian error mapping. Signed-in visitors are redirected away. |
| `(auth)/logout`       | `POST` only: `locals.supabase.auth.signOut()` then `redirect(303, '/login')`.                          |
| `(dashboard)/`        | Layout guard for every `/admin/*` route. Sets `prerender = false` (the tree contains actions).         |
| `(dashboard)/admin`   | Overview: exact counts plus 3 latest rows per table via `getAdminOverview`.                            |
| `(dashboard)/admin/*` | `projects` and `certificates` CRUD: list, `new/` insert, `[id]/` update, plus `_components/*` forms.   |
| root                  | Root layout, auth load, `+error.svelte`, `layout.css`, `robots.txt` and `sitemap.xml` handlers.        |

Landing notes:

- `+page.server.ts` loads certifications and guestbook in one `Promise.all` and returns `github` un-awaited (streamed through
  `{#await}` plus a skeleton). The guestbook action also lives there.
- `career.svelte` is an accordion **on mobile only** (`IsMobile`); every description stays visible on desktop.
- `education.svelte` is a 2-column grid with an institution eyebrow, a duration badge, and a `GraduationCap` fallback when
  `image` is null.
- `robots.txt` sets `prerender = true`; `/blog` is `noindex` and not prerendered. Root layout owns `layout.css`, `ModeWatcher`,
  `theme()`, and the auth invalidation on sign-in/out.

Root config: `vite.config.ts` is canonical (tailwind + sveltekit, adapter-cloudflare `fallback: 'plaintext'`, runes forced
outside `node_modules`) — do not remove. `wrangler.jsonc` holds the Workers entry and assets; secrets go through
`npx wrangler secret put`, never `vars`. Import order and formatting come from `prettier.config.js` and `eslint.config.js`;
shadcn aliases and style come from `components.json`.

## 4. Module map (`src/lib`)

| Module              | Contents                                                                                                                                                                                             |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `components/ui`     | shadcn-svelte primitives (accordion, badge, button, card, dialog, field, select, sheet, sidebar, table, tabs, …). NEVER rebuild or duplicate one.                                                    |
| `components/shared` | `seo-head`, `section-heading/*`, `stat-card`, `blur-fade`, `flickering-grid`, `eyebrow`, `mac-window`, `filter-toolbar`, `file-upload`, `delete-confirm`, `scroll-to-top`, `animated-theme-toggler`. |
| `components/layout` | `app-sidebar/*` (dashboard nav), `landing-sidebar/*` (public nav), `dock-mobile`, `dynamic-breadcrumb`, `footer`, `scroll-progress`.                                                                 |
| `supabase`          | `ssr.ts` (cookie server client), `client.ts` (browser + `uploadPublicFile`), `static.ts` (anon public reads), `types.ts` (manual DB types + constants).                                              |
| `server`            | `content.ts` (query layer), `github.ts`, `actions.ts`. Server-only.                                                                                                                                  |
| `schema`            | zod source of truth: `projects.ts`, `certificate.ts`, `guestbook.ts`.                                                                                                                                |
| `hooks`             | Reactive hooks, `*.svelte.ts` (see UI conventions).                                                                                                                                                  |
| `utils.ts`          | `cn()` plus the `WithoutChild`, `WithoutChildren`, `WithElementRef` types.                                                                                                                           |
| `utils/`            | Domain helpers: `array`, `bytes`, `date`, `error`, `form`, `image`.                                                                                                                                  |
| `seo`               | `site.ts`: site constants, canonical/absolute URLs, and the JSON-LD builders.                                                                                                                        |
| `data`              | Static content: `career`, `education`, `skills`, `social`, `scrolltelling`, `github` (zod).                                                                                                          |

### Query layer — `src/lib/server/content.ts`

- Public reads: `getProjects`, `getProjectCards`, `getProjectByParam`, `getCertificates`, `listCertifications`, `listGuestbook`, `listProjectSlugs`.
- Writes: `insertGuestbook`.
- Admin: `getAdminOverview`, `listAdminProjects`, `listAdminCertificates`.
- Also exports `UUID_RE`. On failure it logs and returns `[]`/`null` — it never throws, because public pages must still render.

### Action helpers — `src/lib/server/actions.ts`

`parseForm(schema, record)` returns a `{ data, errors }` union; `validationFail(errors)` is `fail(400, { error, errors })`;
`dbFail(message)` is `fail(500)`; `missingIdFail(noun)` is `fail(400, 'Missing <noun> id.')`.

### SEO — `src/lib/seo/site.ts`

`SITE_URL`, `SITE_NAME`, `SITE_LOCALE`, `TWITTER_HANDLE`, `GOOGLE_SITE_VERIFICATION`, `DEFAULT_OG_IMAGE`, `SAME_AS`,
`canonicalUrl`, `absoluteUrl`, `personSchema`, `webSiteSchema`, `breadcrumbSchema`, `creativeWorkSchema`.

## 5. Server conventions

- Keep routes thin. Every project/certificate/review read goes through the `content.ts` helpers above; inline
  `supabase.from(...)` chains are allowed only for single-table specialist actions (admin delete, detail by id, slug clash
  check). Duplicated query rules drift silently.
- Admin write flow: `parseForm(Schema, formDataToRecord(form))` → `validationFail(errors)` when parsing fails → slug clash
  `.neq('id', id).maybeSingle()` → `dbFail(error.message)` → `throw redirect(303, '/admin/...')`. The matching `load` fetches
  one row by `id` and throws 404 when it is missing.
- ALWAYS `formDataToRecord(form)` (`utils/form.ts`) before zod. NEVER `Object.fromEntries(formData)` — it leaks `File`
  objects into string schemas.
- ALWAYS `mapRowTo*` on read and `mapInputToRow` on write (`schema/projects.ts`, `schema/certificate.ts`). NEVER map a row
  inline.
- ALWAYS use `locals.supabase` under `(dashboard)`. `createStaticClient()` is for public reads only (`(landing)` loads and
  the sitemap); in admin it has no session, so RLS hides the rows you meant to edit.
- Ordering: projects `.order('display_order')` then `.order('created_at', { ascending: false })`; certificates
  `.order('display_order')`; guestbook `.order('created_at', { ascending: false })` with NO limit (intentional, small data).
- Admin loads set `cache-control: private, no-store`, declare `depends('supabase:...')`, and use `.limit()`; counts use
  `count: 'exact'` through the helpers, never estimated from a limited window. Deletes call `invalidate()` on the targeted
  tag instead of refreshing everything.
- Logging: `console.error('[content] <fn> failed:', …)` in `content.ts`, `console.error('[admin/...] load failed:', …)` in
  admin routes, `console.warn('[github] …')` for public fallbacks. NEVER throw on a public load failure.
- Guestbook action (public): honeypot `website` filled → silent `{ success: true }` (never reveal it); zod failure →
  `fail(400, { error: firstMessage })`; insert failure → `fail(500, { error: 'Something went wrong. Please try again later.' })`;
  success → `{ success: true }` and the enhanced form re-runs the load.
- Uploads: only through `uploadTask({ bucket, slug, folder, kind })` plus `uploadPublicFile()`. The hook owns the policy —
  `image`: 5 MB, `image/*`, JPEG/PNG converted to WebP by `compressImage()` (1920 px, q0.85; GIF/SVG/HEIC pass through)
  before the size check; `video`: 50 MB, `video/*`, never compressed. Storage path is `{slug}/{Date.now()}-{slug}.{ext}`, one
  folder per slug for images and video. Buckets: `project-images`, `certificate-images`. Uploads are client-side; the URL
  lands in a hidden input of the same form, so there is no upload action.

## 6. Database and schema

| Table                 | Columns                                                                                                                                              | Notes                                                          |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `projects`            | `id`, `title`, `slug` (unique), `description`, `github`, `demo`, `tags[]`, `category`, `features[]`, `display_order`, `image[]`, `video`, timestamps | `Insert` requires `title`, `slug`, `description`.              |
| `certificates`        | `id`, `title`, `issuer`, `date`, `image_url`, `display_order`, `created_at`                                                                          | `date` is the display string `15 September 2026`, never ISO.   |
| `reviews` (guestbook) | `id` (serial), `name`, `message`, `created_at`                                                                                                       | Public insert; no limit (small dataset); honeypot + XSS guard. |

Rules:

- Update `src/lib/supabase/types.ts` by hand whenever SQL changes. There is no codegen and no migrations folder in the repo.
- IDs: projects and certificates are `uuid` generated server-side, reviews are integers. NEVER coerce a project id to a number.
- Arrays are `text[]`, but forms submit CSV or JSON strings: `parseJsonOrCsv()` via zod `.transform()` on write,
  `asStringArray()` on read. NEVER store the raw CSV.
- `display_order` blank or missing MUST preprocess to `UNSORTED_ORDER` (99), never `0`.
- `category` is a SINGLE string, `z.enum(PROJECT_CATEGORIES)`: Full Stack App, Data Science, AI, Education. Edited with shadcn
  `Select type="single"`, rendered as one `secondary` badge, filtered with a single select. It was migrated from `text[]`
  (legacy multi-value rows kept their first element) — never write an array or CSV here.
- Dates: certificates store the display string. Use `formatDisplayDate()` on write, `parseDisplayDateToISO()` on read,
  `toDateInputValue()` for `<input type="date">`, and `formatDate`/`formatFullDate`/`timeAgo` for output (`baru saja`,
  `mnt lalu`, `jam lalu`, `hari lalu`). NEVER `new Date(row.date)`.
- Storage: public URLs via `getPublicUrl()`; the path is sanitized and slug-prefixed inside `buildStoragePath()`.

## 7. UI conventions

- Co-locate private components in `_components/*` beside the route; `_`-prefixed files are never routes. Shared UI belongs in
  `src/lib/components/*`, never in `src/routes`.
- Runes only: `$props`, `$state`, `$derived`, `$effect`. `vite.config.ts` forces `runes: true`. NEVER `export let`,
  `on:click`, `$$props`, or stores for local UI state.
- Data comes from `load`. No tanstack-query, no client-side Supabase fetch for SSR data. Public detail routes keep their
  `cache-control: public, max-age=30, s-maxage=300`.
- Surfaces are shadcn `Card`; never add a custom `Surface`/`Chip` wrapper. Tags are `Badge` — `secondary` or `outline`,
  `size="md"` (h-6) on the landing, `size="sm"` (h-5) in tables and toolbars.
- Icons are `phosphor-svelte` only. Colors come from tokens (`bg-background`, `text-foreground`, `border-border`); NEVER
  hardcode a color. Radius is `0` everywhere — NEVER add `rounded-*`.
- Class merging uses `cn()` from `src/lib/utils.ts`; the `WithoutChild`/`WithoutChildren`/`WithElementRef` types live there
  too. Domain helpers stay in `src/lib/utils/`.
- Navigation: `ui/sidebar/*` is the primitive (dashboard only); `layout/landing-sidebar/*` and `layout/app-sidebar/*` are
  compositions; `layout/dock-mobile.svelte` is the generic mobile dock (`items`, optional `menu`, `header`, `onNavigate`).
  Public nav is single-sourced in `landing-sidebar/constant.ts` (`publicNavItems`, `buildPublicMenu`): `/admin` "Dashboard"
  when signed in, `/login` "Login" otherwise. NEVER hardcode nav items, and never link `/profile` — that route does not exist.
- Hooks live in `src/lib/hooks/*.svelte.ts`: kebab-case, arrow functions, no `use-` prefix. Current set: `debounce`
  (internal, only `searchFilter` uses it), `searchFilter` (landing projects + certificates only, not admin tables),
  `reduced-motion`, `slug-field`, `upload-task`, `is-mobile` (sidebars, conditional layout mount, and the mobile-only career
  accordion), `theme` (`d` toggles mode and ignores inputs). Add a hook only if it owns reactive state and is used in two or
  more places.
- Styling: Tailwind v4 tokens in `src/routes/layout.css`; fonts are self-hosted `@font-face` (Inter → `font-sans`, Bricolage →
  `font-display`, Instrument Serif → `font-serif`, JetBrains Mono → `font-mono`, all `display: swap`). NEVER load Google Fonts.
- Naming: `kebab-case.svelte`, `PascalCase` zod schemas, `UPPER_SNAKE` table and bucket constants, `mapRowToX`/`mapInputToRow`/
  `toProjectCard` mappers. Form state is `{ status: 'idle' | 'success' | 'error', message, errors? }`.
- SEO: every public page renders `SeoHead` with helpers from `src/lib/seo/site.ts` (canonical URL, JSON-LD). NEVER write meta
  tags by hand. `hooks.server.ts` lowercases the path and strips trailing slashes with a 301 before routing.

## 8. Auth and access

Single admin, no roles or RBAC. The only guards are `hooks.server.ts` and `(dashboard)/+layout.server.ts`.

| Role × resource                          | Public pages | Guestbook POST                 | `/login`       | `/admin/*`                            | `/logout`                 |
| ---------------------------------------- | ------------ | ------------------------------ | -------------- | ------------------------------------- | ------------------------- |
| Anonymous                                | read         | allowed (honeypot + zod + XSS) | view + POST    | 303 → `/login?redirectTo=%2Fadmin...` | —                         |
| Authenticated (any `supabase.auth` user) | read         | allowed                        | 303 → `/admin` | full CRUD                             | `POST` clears the session |

- Rely on the `(dashboard)` layout guard for admin. NEVER add a second per-page session check — duplicate redirects corrupt
  `redirectTo`.
- Auth decisions use `await locals.safeGetSession()` (cookie `sb-*-auth-token` pre-check, then `getUser()`). NEVER call
  `supabase.auth.getSession()` in server code for authorization — it trusts unvalidated storage. `+layout.ts` reuses
  `data.session` and never calls `getSession()`.
- Login POST: `LoginSchema` (`redirectTo` defaults to `/admin`), Indonesian errors (`Email atau password salah`), and on
  failure `fail(400, { status: 'error', message, email })` so the field can refill. The redirect target ALWAYS goes through
  `safeRedirectTo()` — relative paths only, rejecting `//` and `\` — which blocks open redirects like `//evil.com`. The same
  policy applies to the logged-in redirect inside `load`.

## 9. Quality gates and performance

| Command          | Runs                              |
| ---------------- | --------------------------------- |
| `bun run dev`    | `bun --bun vite dev`              |
| `bun run build`  | `bun --bun vite build`            |
| `bun run check`  | `svelte-kit sync && svelte-check` |
| `bun run lint`   | `prettier --check . && eslint .`  |
| `bun run format` | `prettier --write .`              |

`bun run check` and `bun run lint` MUST pass before push — the Cloudflare build fails on `svelte-check` errors. Formatting is
tabs, single quotes, no trailing commas, 100 columns, with import sorting and Tailwind class sorting.

- GitHub calendar: module-level `githubCache` with a 6 h TTL (`GITHUB_TTL_MS`) inside `github.ts`. Serve the cache while it is
  fresh; on failure return `null` and `console.warn`. The landing returns `github` un-awaited so certifications and the
  guestbook are never blocked — never await it sequentially.
- Project detail sets `public, max-age=30, s-maxage=300`. Admin loads set `private, no-store`. Public lists select explicit
  columns, never `select('*')`.
- Images: compress before upload and prefer the `image[0]` thumbnail (`toProjectCard`). Videos live beside images in the slug
  folder, max 50 MB, never inlined as base64.
- Fonts: self-hosted `woff2` with `display: swap`; no Google Fonts links, and no new `@font-face` without the `100 900`
  variable range.
- Bundle: private site, no package publishing (`private: true`). Route code imports through the `#lib/*` alias from
  `package.json`, never a `node_modules` path.
- Latency target: keep public `load` under ~500 ms P50 (explicit selects, no joins). New queries need `.limit()` and, if they
  filter or sort on it, a `display_order` index.

## 10. Data flow

| Data                      | Loader                                                               | Cache                            | Invalidated by                                                            |
| ------------------------- | -------------------------------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------- |
| `session`, `user`         | `+layout.server.ts` → `+layout.ts`                                   | per request via `safeGetSession` | `onAuthStateChange` → `invalidate('supabase:auth')`                       |
| GitHub calendar           | `fetchGithubCalendar()`                                              | module cache, 6 h                | TTL only                                                                  |
| Certifications, guestbook | `listCertifications`, `listGuestbook` (static client)                | per request                      | full page reload                                                          |
| Projects grid             | `getProjectCards` (`/projects`), `getCertificates` (`/certificates`) | per request                      | full page reload                                                          |
| Admin lists and overview  | `listAdminProjects`, `listAdminCertificates`, `getAdminOverview`     | `private, no-store`              | delete → `invalidate('supabase:projects')` or `('supabase:certificates')` |
| Project detail            | `getProjectByParam`                                                  | edge 5 min, browser 30 s         | UUID + slug → 301 to the slug                                             |

Mutations are `<form method="POST" action="?/update|?/create|?/delete|?/guestbook" use:enhance>` against server `actions`,
returning `fail()` or `redirect()`. Keep `id`/`slug` in hidden inputs. NEVER `fetch()` a form action — use `use:enhance` or a
native submit.

## 11. Environment

| Variable                          | Side   | Notes                                                                                                                            |
| --------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `PUBLIC_SUPABASE_URL`             | client | MUST be set. Supabase project URL.                                                                                               |
| `PUBLIC_SUPABASE_PUBLISHABLE_KEY` | client | MUST be set. Publishable (anon) key, not a secret.                                                                               |
| `GH_READ_USER_TOKEN_PERSONAL`     | server | GitHub GraphQL token. Missing → warning plus a `null` calendar; the page still renders. `npx wrangler secret put` in Cloudflare. |
| `GITHUB_USERNAME`                 | server | Defaults to `SerenaaaaRN`.                                                                                                       |

Declared in `src/env.ts` (`$app/env/public` and `$app/env/private`), consumed through `locals`/helpers — not `platform.env`,
which was removed in Kit 3. `.env.example` lists all four. NEVER prefix a secret with `PUBLIC_` and never commit `.env`.

## 12. Known gaps

- RLS policies and the migration history live outside this repo (Supabase dashboard). Verify them there before assuming a
  policy exists or that a column change is safe.
- No APM is wired up, so the latency figures above are estimates rather than measurements.
