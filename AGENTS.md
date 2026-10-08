# rillah-sv3 — Personal Portfolio + Admin CMS (rillah.dev)

Primary context file for AI agents. Read first before any changes.

## Split Architecture Guidance

Single architecture — read all sections. This is a single-package SvelteKit app. Frontend (landing) and backend (SvelteKit `load` + `actions` + Supabase) live in the same `src/routes/` tree distinguished only by route groups: `(landing)`, `(auth)`, `(dashboard)`.

## Available Skills

| Skill                              | When to use                                                                                                        |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `svelte-code-writer`               | Wajib for ANY `.svelte`, `.svelte.ts`, `.svelte.js` create/edit/review. Lookup Svelte 5 docs + validate.           |
| `svelte-core-bestpractices`        | Wajib for Svelte reactivity, `$state`/`$derived`/`$effect`, event handling, a11y, performance.                     |
| `supabase`                         | Wajib for ANY `src/lib/supabase/*`, `locals.supabase` query, Auth, Storage buckets, SSR (`@supabase/ssr`).         |
| `supabase-postgres-best-practices` | Wajib when touching `src/lib/supabase/types.ts` tables, `.order()/.select()/.eq()` queries, or adding indexes/RLS. |

## Available MCP

| MCP      | Tools                                                                          | When to use                                                                                                                                                                   |
| -------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `svelte` | `list-sections` → `get-documentation` → `svelte-autofixer` → `playground-link` | Wajib FIRST for any Svelte/SvelteKit question. ALWAYS run `svelte-autofixer` before returning Svelte code. NEVER call `playground-link` if code was written to project files. |

## About the Project

Personal portfolio + headless CMS for Duhairillah (AI Engineer, `https://rillah.dev`). Public landing shows intro, career, education, skills, GitHub contribution calendar, projects, certificates, guestbook (`reviews` table). Single-admin dashboard at `/admin/*` manages `projects` and `certificates` CRUD + Supabase Storage uploads. Business model: personal branding + SEO (`sitemap.xml`, `robots.txt`, JSON-LD in `src/lib/seo/site.ts`) + Cloudflare Workers deploy. Bilingual: code/comments English, user-facing strings Indonesian (`Email wajib diisi.`, `baru saja`, `mnt lalu`, `id-ID` dates).

## Architecture Overview

SvelteKit 2 + Svelte 5 (runes forced) + Cloudflare Workers. No separate backend; SvelteKit server `load`/`actions` + 3 Supabase client factories + zod schemas are the API layer. No REST `/api/*` except `src/routes/sitemap.xml/+server.ts`, `src/routes/robots.txt/+server.ts`, `src/routes/(auth)/logout/+server.ts`.

| Package                     | Role                                                                                                                                                                                                                                | Status                    |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `src/routes/(landing)`      | Public SEO landing, blog, projects, certificates                                                                                                                                                                                    | Active                    |
| `src/routes/(auth)`         | Login/logout only (`login/+page.server.ts`, `logout/+server.ts`)                                                                                                                                                                    | Active                    |
| `src/routes/(dashboard)`    | Auth-gated admin CMS (`admin/projects`, `admin/certificates`)                                                                                                                                                                       | Active                    |
| `src/lib/supabase`          | `server.ts` (cookie-aware + layout SSR), `client.ts` (browser + `uploadPublicFile`), `static.ts` (anon for public loads), `types.ts` (manual DB types + table/bucket consts)                                                        | Active, canonical         |
| `src/lib/hooks`             | `debounce` (internal, used by `searchFilter`), `searchFilter`, `ReducedMotion`, `slugField`, `uploadTask` (owns `kind`→limit policy), `IsMobile`, `theme()` — no `use-` prefix, arrow functions                                     | Active, canonical         |
| `src/lib/schema`            | zod source of truth: `projects.ts`, `certificate.ts`, `guestbook.ts`                                                                                                                                                                | Active, canonical         |
| `src/lib/utils`             | `array.ts` (`parseJsonOrCsv`, `asStringArray`), `bytes.ts` (`mb`, `formatBytes`), `date.ts` (id-ID format/parse), `error.ts` (`errorMessage`), `form.ts` (`formDataToRecord` + `getGithubThumbnailUrl` ⚠️ github concern misplaced) | Active, canonical         |
| `src/lib/data`              | Static content: `career.ts`, `education.ts`, `skills.ts`, `social.ts`, `scrolltelling.ts`, `github.ts` (zod)                                                                                                                        | Active                    |
| `src/lib/components/ui`     | shadcn-svelte primitives (button, card, table, sidebar, sheet, field, select, etc.)                                                                                                                                                 | Active — DO NOT duplicate |
| `src/lib/components/shared` | `seo-head.svelte`, `surface.svelte`, `stat-card.svelte`, `chip.svelte`, `blur-fade.svelte`, `section-heading/*`                                                                                                                     | Active                    |
| `src/lib/components/layout` | `app-sidebar/*`, `sidebar/*`, `dynamic-breadcrumb.svelte`, `dock-mobile.svelte`, `footer.svelte`, `scroll-progress.svelte`                                                                                                          | Active                    |

## Project Structure

```
rillah-sv3/
├── package.json              # SvelteKit lib packaging: svelte "./dist/index.js", sideEffects:true. Scripts: dev/build/start/check/lint/format. Uses bun per config but scripts call vite/svelte-kit.
├── vite.config.ts            # Canonical: tailwindcss()+sveltekit(adapter-cloudflare fallback:'plaintext', platformProxy.persist:true) + compilerOptions.runes force-true except node_modules (lines 20-23). DO NOT remove.
├── wrangler.jsonc            # Cloudflare: main ".svelte-kit/cloudflare/_worker.js", assets ".svelte-kit/cloudflare", compatibility_date "2025-09-20". Secrets via platform.env, NOT vars.
├── tsconfig.json             # Extends ./.svelte-kit/tsconfig.json, strict:true, moduleResolution:bundler, allowJs+checkJs:true.
├── eslint.config.js          # js+ts+svelte recommended + prettier last + svelte/no-navigation-without-resolve:off (line 39, SvelteKit resolve() false-positive).
├── prettier.config.js        # useTabs:true, singleQuote:true, trailingComma:none, printWidth:100, plugins sort-imports+svelte+tailwindcss, importOrder BUILTIN>THIRD_PARTY>$lib>./
├── components.json           # shadcn-svelte: css "src/routes/layout.css", baseColor neutral, style vega, iconLibrary phosphor, aliases $lib/components,$lib/utils,$lib/hooks.
├── src/app.html              # Shell. DO NOT add script tags; use +layout.svelte.
├── src/app.d.ts              # App.Locals {supabase:SupabaseClient<Database>, safeGetSession, session, user}, PageData {session,user}, Platform.env {GH_READ_USER_TOKEN_PERSONAL,GITHUB_USERNAME}. Update here when adding env/locals.
├── src/hooks.server.ts       # Canonical middleware: 1) seoRedirect (lowercase+trailing-slash 301, lines 4-18), 2) createSupabaseServerClient(event)->event.locals.supabase, 3) safeGetSession (sb-*-auth-token cookie check -> getUser -> getSession, lines 28-44). DO NOT call getSession without cookie guard.
├── src/routes/+layout.svelte # Imports ./layout.css, ModeWatcher, theme(), onAuthStateChange->invalidate('supabase:auth'). Root only; no UI.
├── src/routes/+layout.ts     # Creates browser/server supabase client, depends('supabase:auth'), getSession. Returns {supabase,session,user}.
├── src/routes/+layout.server.ts # Returns {session,user,cookies:getAll()} via safeGetSession. Feeds +layout.ts cookies for SSR.
├── src/routes/layout.css      # Tailwind v4: @import tailwindcss+tw-animate-css+shadcn-svelte/tailwind.css, @font-face Inter/Bricolage/Instrument Serif/JetBrains Mono, @custom-variant dark, CSS vars neutral + --radius:0rem (sharp, lines 165-172). Design token source.
├── src/routes/(landing)/     # Public. _components/* co-located (intro, about, career, education, skills, marquee, scrolltelling, typing-animation, contribution/*, certificates/*, guestbook/*). +page.server.ts loads github+certifications+guestbook in parallel; action guestbook only.
├── src/routes/(landing)/projects/[id]/+page.server.ts # Canonical slug/UUID loader: depends('supabase:projects'), cache-control public max-age=30 s-maxage=300, UUID regex -> by id else by slug, 301 /projects/:slug if UUID hit with slug (lines 38-40).
├── src/routes/(auth)/login/+page.server.ts # LoginSchema zod (email wajib diisi, password wajib diisi, redirectTo default /admin). signInWithPassword, Indonesian error mapping Invalid login credentials->Email atau password salah.
├── src/routes/(dashboard)/+layout.server.ts # THE guard: safeGetSession, if !session redirect 303 /login?redirectTo=<encoded path>. All /admin/* inherit. DO NOT add second guard.
├── src/routes/(dashboard)/admin/projects|certificates/ # CRUD: +page.server.ts list, new/+page.server.ts insert, [id]/+page.server.ts update, project-form.svelte/certificate-form.svelte + *-table.svelte + *-manager.svelte. Uploads via `uploadTask` hook + `uploadPublicFile`.
└── src/lib/supabase/types.ts # Manual DB types (NOT supabase gen): ProjectsRow/CertificatesRow/ReviewsRow + Database. Update manually when SQL changes.
```

## Tech Stack & Technical Decisions

| Decision        | Choice                                                                                                            | Reason                                                                                                                                 |
| --------------- | ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Framework       | SvelteKit `^2.63.0` + Svelte `^5.56.1`, runes forced `vite.config.ts:20-23`                                       | Single codebase SSR+actions, no API server. Runes `true` outside node_modules gives `$state`/`$derived`/`$effect` everywhere.          |
| Deploy          | `@sveltejs/adapter-cloudflare@^7.2.9`, `wrangler.jsonc` Workers                                                   | Edge SSR. Requires `platform.env` token fallback (see `(landing)/+page.server.ts:119-124`).                                            |
| Styling         | `tailwindcss@^4.3.0` + `@tailwindcss/vite@^4.3.0` + `tw-animate-css@^1.4.0`, `layout.css` tokens, `--radius:0rem` | Sharp brutalist (radius 0), dark via `.dark` + `mode-watcher@^1.1.0`.                                                                  |
| UI              | `bits-ui@^2.18.0` + `shadcn-svelte@^1.6.1` `vega/neutral/phosphor`                                                | Canonical primitives in `src/lib/components/ui/*`. Never rebuild dialog/sheet/table/select.                                            |
| DB+Auth+Storage | `@supabase/supabase-js@^2.116.0` + `@supabase/ssr@^0.12.7`                                                        | 3 clients: `server.ts` (cookie `getAll`/`setAll` path `/`), `client.ts` (browser), `static.ts` (public anon for landing loads).        |
| Validation      | `zod@^4.6.5` (`z.coerce.number`, `.transform(parseJsonOrCsv)`)                                                    | All forms: `ProjectSchema`, `CertificateSchema`, `GuestbookSchema`, `GithubCalendarSchema`, `LoginSchema`. Never trust `FormData` raw. |
| Icons/Media     | `phosphor-svelte@^3.1.0`, `embla-carousel-svelte@^8.6.0`                                                          | Phosphor only (components.json). Embla for certificate/project carousels.                                                              |
| Utils           | `clsx@^2.1.1` + `tailwind-merge@^3.6.0` + `tailwind-variants@^3.3.1` via `cn()` in `src/lib/utils.ts:4-6`         | Single class merge entry. Always use `cn()`, never string concat.                                                                      |
| Lint/Format     | `eslint@^10.4.1` + `typescript-eslint@^8.60.1` + `eslint-plugin-svelte@^3.19.0` + `prettier@^3.8.3`               | `bun run lint` = `prettier --check . && eslint .`. Tabs, single quotes, no trailing comma.                                             |
| Check           | `svelte-check@^4.6.0`, `vite@^8.0.16`, `typescript@^6.0.3`                                                        | `bun run check` = `svelte-kit sync && svelte-check`. Must pass before PR.                                                              |
| Fonts           | Self-hosted `/static/fonts/*.woff2` via `@font-face` in `layout.css:5-43`                                         | Inter + Bricolage Grotesque + Instrument Serif + JetBrains Mono, `display:swap`. Never Google Fonts CDN.                               |

## Backend/API Conventions

No REST. Canonical is SvelteKit `load` + named `actions` + `locals.supabase` + zod + `fail()` / `redirect()`.

Canonical module pattern for every admin table (see `src/routes/(dashboard)/admin/projects/[id]/+page.server.ts`): `load` fetches one row by `id` via `locals.supabase` and throws 404 if missing; `update`/`create` actions parse `FormData` via `formDataToRecord` into the zod schema, return `fail(400)` on validation error, check slug clash with `.neq('id', id).maybeSingle()`, return `fail(500)` on DB error, and `throw redirect(303, ...)` on success.

Rules:

- ALWAYS `formDataToRecord(form)` (`src/lib/utils/form.ts`) before zod. NEVER `Object.fromEntries(formData)` — it leaks `File` into string schemas.
- ALWAYS `mapRowTo*` on read, `mapInputToRow` on write (`src/lib/schema/projects.ts:95-132`, `certificate.ts:53-74`). NEVER inline row mapping.
- ALWAYS slug clash check with `.neq('id', id).maybeSingle()` before update (projects `[id]/+page.server.ts`). Certificates have no `slug` column — no clash check applicable.
- ALWAYS `fail(400,{error,errors})` for validation, `fail(500,{error:dbError.message})` for DB, `throw redirect(303,...)` on success. Public guestbook returns `{success:true}` without redirect (`(landing)/+page.server.ts:174`).
- ALWAYS `locals.supabase` in `load`/`actions` under `(dashboard)` (cookie-authenticated). Use `createStaticClient()` (`src/lib/supabase/static.ts:4-5`) ONLY for public reads in `(landing)/+page.server.ts:125` and guestbook insert `:161`. NEVER use static client in admin — it bypasses user session.
- Uploads: ONLY via `uploadTask({bucket, slug, folder, kind})` hook (`src/lib/hooks/upload-task.svelte.ts`) + `uploadPublicFile()` (`src/lib/supabase/client.ts`). Limits owned by hook `kind` preset: images `5MB mimePrefix:'image/'`, videos `50MB mimePrefix:'video/'`; explicit `maxBytes`/`mimePrefix` override allowed. Buckets `project-images` / `certificate-images`, video folder `videos`. Storage path `{folder/}{slug}/{Date.now()}-{sanitized}`. Hook pre-validates `file instanceof File && file.size>0 && file.type.startsWith(prefix)` with `formatBytes()` message.
- Ordering: ALWAYS `.order('display_order',{ascending:true})` then `.order('created_at',{ascending:false})` for projects; certificates `.order('display_order')`; guestbook `.order('created_at',{ascending:false}).limit(20)`.
- Logging: `console.error('[admin/projects] load failed:', ...)` for admin, `console.warn('[github] load fallback ...')` for public fallbacks returning `[]`/`null`. NEVER throw on public load failure.

## Frontend/UI Conventions

- Routing: SvelteKit route groups `(landing)`, `(auth)`, `(dashboard)`. Co-locate private components as `_components/*` or `*/_components/*` (e.g. `(landing)/_components/guestbook/guestbook.svelte`, `admin/projects/_components/project-form.svelte`). Files starting `_` are NOT routes. NEVER put shared UI in routes — put in `src/lib/components/*`.
- State: Svelte 5 runes ONLY (`$props()`, `$state`, `$derived`, `$effect`). `vite.config.ts:20-23` forces `runes:true`. Example canonical: `let { children, data } = $props()` in `src/routes/+layout.svelte:8`. NEVER use Svelte 4 `export let`, stores for local UI, or `on:` directives.
- Data fetching: SvelteKit `load` only. No tanstack-query/fetch wrappers. `depends('supabase:auth')` in `src/routes/+layout.ts:6` + `invalidate('supabase:auth')` on auth change (`+layout.svelte:12-16`); `depends('supabase:projects')` in `projects/[id]/+page.server.ts:6`. After mutation, `throw redirect` or `invalidate()`. NEVER client-fetch Supabase directly for SSR data.
- Components: `shadcn-svelte` `ui/*` primitives + `cn()` (`src/lib/utils.ts:4-6`) + `WithoutChild`/`WithoutChildren`/`WithElementRef` types. Shared: `seo-head.svelte` (JSON-LD via `src/lib/seo/site.ts:30-87`), `section-heading/*`, `surface`/`chip`/`stat-card`/`blur-fade`. Icons: `phosphor-svelte` ONLY. Theme: `mode-watcher` + `theme()` (`src/lib/hooks/theme.svelte.ts`) — `d` key toggles mode, ignores inputs (`closest('input,textarea,select,button,a[href]')`). NEVER hardcode colors; use `bg-background text-foreground border-border` tokens.
- Hooks: `src/lib/hooks/*.svelte.ts` — no `use-` prefix, arrow functions, `kebab-case` filenames. Current set: `debounce` (internal, only used by `searchFilter`), `searchFilter` (landing projects + certificates pages), `ReducedMotion` (`blur-fade`, `flickering-grid`), `slugField` (project + certificate forms), `uploadTask` (3 upload managers, owns `kind`→limit/mime policy), `IsMobile` (sidebar only), `theme()` (`+layout.svelte`, `d`-key toggle). New hook layak only if reactive state (`$state`/`$derived`/`$effect`) + used in ≥2 places. `blur-fade`/`flickering-grid` keep inline `IntersectionObserver`; `scroll-progress`/`scroll-to-top` fully inline (no hook).
- Styling: Tailwind v4 in `layout.css`. Fonts via `font-sans`/`font-display`/`font-serif`/`font-mono` theme vars (`layout.css:127-130`). Radius is `0px` everywhere — Dilarang adding `rounded-*`. Dark variant `@custom-variant dark (&:is(.dark *))`.
- Naming: `kebab-case.svelte` files, `PascalCase` zod schemas (`ProjectSchema`), `UPPER_SNAKE` table/bucket consts (`PROJECTS_TABLE`, `PROJECT_IMAGE_BUCKET`), `mapRowToX`/`mapInputToRow`/`toProjectCard` mappers. Form state type `{status:'idle'|'success'|'error',message,errors?}` (`schema/projects.ts:50-54`).
- SEO: Every landing page MUST use `SeoHead` + `canonicalUrl()`/`absoluteUrl()`/`personSchema()`/`breadcrumbSchema()`/`creativeWorkSchema()` from `src/lib/seo/site.ts`. `SITE_URL=https://rillah.dev`. `hooks.server.ts:4-18` lowercases + strips trailing slash (301). Sitemap/robots via `+server.ts`. NEVER add meta tags manually.

## Database & ORM

No Prisma/Drizzle. Direct `supabase-js` + manual types in `src/lib/supabase/types.ts:1-63`.

| Table                 | Key columns                                                                                                                                                                             | ID              | Notes                                                                                                                                                                             |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `projects`            | `id, title, slug UNIQUE, description, content, github, demo, tags[]\|null, featured[]\|null, features[]\|null, display_order\|null, image[]\|null, video\|null, created_at, updated_at` | `uuid string`   | `Insert` requires `title,slug,description`. Order by `display_order asc, created_at desc`. Slug is URL (`/projects/[id]` tries UUID then slug). `display_order ?? 99` = unsorted. |
| `certificates`        | `id, title, issuer\|null, date\|null (stored "15 September 2026" id-ID), image_url\|null, display_order\|null, created_at`                                                              | `uuid string`   | `UNSORTED_ORDER=99` (`certificate.ts:7`). Date normalized via `formatDisplayDate()` on write, parsed via `parseDisplayDateToISO()` on read (`utils/date.ts`).                     |
| `reviews` (guestbook) | `id number, name\|null, message\|null, created_at`                                                                                                                                      | `serial number` | Public insert allowed (static client). Limit 20 desc. XSS guard `FORBIDDEN_CONTENT=/<\s*(script\|iframe)/i` + honeypot `website` field.                                           |

Rules:

- ALWAYS update `src/lib/supabase/types.ts` manually when SQL changes. No codegen, no migrations folder in repo — ⚠️ UNCERTAIN: RLS/migration source (Supabase dashboard?). Check dashboard before assuming RLS.
- IDs: projects/certificates `uuid` (gen server-side), reviews `number`. NEVER coerce project id to number.
- Arrays stored as `text[]\|null` but forms submit CSV/JSON strings → ALWAYS `parseJsonOrCsv()` (`utils/array.ts:1-19`) via zod `.transform()` + `asStringArray()` on read. NEVER store raw CSV string.
- Dates: certificates store display string `15 September 2026`, NOT ISO. ALWAYS `formatDisplayDate()` before insert (`certificate.ts:66`), `toDateInputValue()` for `<input type=date>`, `formatDate`/`formatFullDate`/`timeAgo` (`baru saja`/`mnt lalu`/`jam lalu`/`hari lalu` Indonesian) for display. NEVER `new Date(row.date)` directly.
- Storage buckets: `project-images` (images + `videos/` folder), `certificate-images`. Public URLs via `getPublicUrl()`. Upload entry is `uploadPublicFile()` + `UploadPublicFileOptions` (`client.ts`); path sanitized + slug prefix inside `buildStoragePath()`.

## Auth & Authorization

Single-admin, NO RBAC/roles. `hooks.server.ts` + `(dashboard)/+layout.server.ts` are the ONLY guards.

| Role × Resource                          | Public landing (`/`, `/projects`, `/certificates`, `/blog`) | Guestbook POST                 | `/login`                       | `/admin/*` (projects, certificates CRUD + upload) | `/logout`                |
| ---------------------------------------- | ----------------------------------------------------------- | ------------------------------ | ------------------------------ | ------------------------------------------------- | ------------------------ |
| Anonymous                                | ✅ read via `createStaticClient` / `locals.supabase`        | ✅ with honeypot+zod+XSS check | ✅ view + POST                 | ❌ 303 → `/login?redirectTo=%2Fadmin...`          | —                        |
| Authenticated (any `supabase.auth` user) | ✅                                                          | ✅                             | ❌ 303 → `/admin` (if session) | ✅ full CRUD                                      | ✅ `POST` clears session |

Canonical guard (`src/routes/(dashboard)/+layout.server.ts`): `load` calls `locals.safeGetSession()`, and if there is no session throws `redirect(303, ...)` to `/login` with the current path as encoded `redirectTo`. All `/admin/*` routes inherit it.

- ALWAYS rely on this layout guard for admin. Dilarang adding per-page session checks — redundant.
- ALWAYS `locals.safeGetSession()` (cookie `sb-*-auth-token` pre-check in `hooks.server.ts:29-32`), NEVER `supabase.auth.getSession()` server-side for auth decisions (unsafe). `+layout.ts:25` `getSession()` is ONLY for reactive client sync after `safeGetSession` already validated.
- Login POST: `signInWithPassword({email,password})`, Indonesian errors, `fail(400,{status:'error',message,email})`. Preserve `email` on fail for refill.
- Logout: `src/routes/(auth)/logout/+server.ts` — ⚠️ UNCERTAIN content (not re-read this session), verify it calls `supabase.auth.signOut()`.

## Environment Variables

| Variable                          | Client                                                                          | Server                                                                                    | Notes                                                                                                                                                                       |
| --------------------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PUBLIC_SUPABASE_URL`             | ✅ `$env/static/public` in `supabase/server.ts:3`, `client.ts:2`, `static.ts:2` | ✅                                                                                        | Wajib. Supabase project URL.                                                                                                                                                |
| `PUBLIC_SUPABASE_PUBLISHABLE_KEY` | ✅ same                                                                         | ✅                                                                                        | Wajib. Anon publishable key (NOT secret).                                                                                                                                   |
| `GH_READ_USER_TOKEN_PERSONAL`     | ❌                                                                              | ✅ `platform.env` → `$env/dynamic/private` fallback (`(landing)/+page.server.ts:119-122`) | GitHub GraphQL token. Missing → `console.warn missing_token` + calendar `null`, page still renders. In Cloudflare MUST be `platform.env` (Workers), local `.env` via `env`. |
| `GITHUB_USERNAME`                 | ❌                                                                              | ✅ same fallback, default `'SerenaaaaRN'` (`:124`)                                        | Override per-deploy.                                                                                                                                                        |

`.env.example` lists all four. NEVER prefix server secrets with `PUBLIC_`. NEVER commit `.env`.

## Common Mistakes to Avoid

1. ❌ DO NOT use `Object.fromEntries(formData)` or `formData.get()` directly into zod. ✅ DO `formDataToRecord(form)` (`utils/form.ts`) then `ProjectSchema`/`CertificateSchema.safeParse()` — Files must be skipped or image/video string transforms fail.
2. ❌ DO NOT query admin tables with `createStaticClient()` or `createSupabaseBrowserClient()` in `load`/`actions`. ✅ DO `locals.supabase` (cookie-authenticated from `hooks.server.ts:24`). Static client has no user session and breaks RLS.
3. ❌ DO NOT call `supabase.auth.getSession()` in `*.server.ts` for guard decisions. ✅ DO `await locals.safeGetSession()` (cookie `sb-` check + `getUser()` validation). `getSession` alone trusts unvalidated storage.
4. ❌ DO NOT add a second auth guard in `admin/*/​+page.server.ts`. ✅ DO rely on `(dashboard)/+layout.server.ts` redirect. Duplicate redirects break `redirectTo` param.
5. ❌ DO NOT store CSV string or `null` mishandled for `tags`/`featured`/`features`/`image`. ✅ DO zod `.transform(parseJsonOrCsv)` + `mapInputToRow` trim/null-coalesce (`github||null`, `video||null`, `display_order??99`). DB expects arrays/null.
6. ❌ DO NOT store certificate `date` as ISO or raw datepicker value. ✅ DO `formatDisplayDate(input.date)` on write (`schema/certificate.ts:66`), `toDateInputValue()` for inputs, `formatDate`/`formatFullDate` for display. DB format is `15 September 2026`.
7. ❌ DO NOT upload without `uploadTask` hook or skip mime/size checks. ✅ DO `uploadTask({bucket, slug, folder, kind:'image'|'video'})`. Images 5 MB, videos 50 MB — owned by hook `kind` preset.
8. ❌ DO NOT use Svelte 4 syntax (`export let`, `$$props`, `on:click`, writable stores for local state) or `rounded-*` classes. ✅ DO runes (`$props`/`$state`/`$derived`/`$effect`), `onclick={}`, `cn()` + square `radius 0` tokens. `vite.config.ts` forces runes; prettier/tailwind plugins enforce style.
9. ❌ DO NOT client-fetch GitHub GraphQL directly or remove the 6h cache. ✅ DO `fetchGithubCached()` (`GITHUB_TTL_MS=6*60*60*1000`, module `githubCache` in `(landing)/+page.server.ts:29-45`) with `platform.env` token + `User-Agent:rillah-sv3` + `X-GitHub-Api-Version` headers. Missing token must fallback to `null`, never throw.
10. ❌ DO NOT create `src/lib/components/ui/*` from scratch or import `mode-watcher` incorrectly. ✅ DO reuse shadcn-svelte `vega`/`neutral`/`phosphor` primitives, `ModeWatcher` in root layout only, `theme()` for `d`-key toggle. NEVER bypass `seo-head.svelte` + `src/lib/seo/site.ts` for meta/JSON-LD.

## Performance Rules

- GitHub calendar: in-memory `githubCache {at,data}` TTL 6h (`(landing)/+page.server.ts:29-45`). ALWAYS serve cache if `Date.now()-at < GITHUB_TTL_MS`. On fetch fail return `null` + `console.warn`, NEVER block `loadCertifications`/`loadGuestbook` — they run `Promise.all` (`:127-131`). Dilarang sequential awaits.
- Project detail: `setHeaders({'cache-control':'public, max-age=30, s-maxage=300'})` (`projects/[id]/+page.server.ts:7`). Preserve on any new public detail page. Admin loads: NO cache, always fresh + `.order()`.
- Images: `perf: reduce size image` history — ALWAYS compress before upload, prefer `embla-carousel` lazy + `project-card.svelte` thumbnails (`image[0]` via `toProjectCard`). Videos ONLY in `project-images/videos/`, max 50 MB, NEVER inline base64.
- Fonts: self-hosted `woff2` `display:swap` (`layout.css:5-43`). Dilarang Google Fonts links or new `@font-face` without `100 900` variable range.
- Bundle: `sideEffects:true`, `svelte:./dist/index.js` lib packaging (`package.json:16-29`). Dilarang importing `node_modules` directly in routes; use `$lib` alias (`importOrder ^\$lib` in prettier). Run `bun run check` + `bun run lint` before push — Cloudflare build fails on `svelte-check` errors.
- Latency target: ⚠️ UNCERTAIN — no APM. Keep public `load` <500 ms P50 (Supabase `select(*)` + limit 20 guestbook, no joins). If adding queries, add `.limit()` + `display_order` index (verify in Supabase dashboard).

## Data Fetching Pattern

No react-query. SvelteKit `load` + `depends`/`invalidate` ONLY.

| Data                      | Loader                                                                                                    | Cache / Revalidate                                                                                                             | Invalidation                                                                                           |
| ------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| `session,user`            | `src/routes/+layout.server.ts` → `+layout.ts` (`depends('supabase:auth')`)                                | SSR per-request via `safeGetSession`; client sync via `onAuthStateChange→invalidate('supabase:auth')` (`+layout.svelte:12-16`) | `invalidate('supabase:auth')` on auth change, login redirect, logout                                   |
| `github` calendar         | `(landing)/+page.server.ts:fetchGithubCached`                                                             | Module `githubCache` 6h (`GITHUB_TTL_MS`), no `setHeaders`                                                                     | Time expiry only; Dilarang manual invalidate                                                           |
| `certifications` (public) | `loadCertifications()` `select(*).order(display_order)` via `createStaticClient`                          | Per-request, no browser cache                                                                                                  | New admin cert → full page reload fetches fresh                                                        |
| `guestbook` (20 latest)   | `loadGuestbook()` `select(*).order(created_at desc).limit(20)`                                            | Per-request                                                                                                                    | Guestbook action returns `{success:true}` → re-run `load` via form enhance                             |
| `projects` list (admin)   | `admin/projects/+page.server.ts:load` `order(display_order).order(created_at desc)` via `locals.supabase` | No cache                                                                                                                       | Delete action returns `{success:true}` → invalidate; update/new `redirect(303,/admin/projects)`        |
| `project` detail (public) | `projects/[id]/+page.server.ts` `depends('supabase:projects')` + `cache-control max-age=30 s-maxage=300`  | Edge 5 min, browser 30 s                                                                                                       | UUID→slug 301 (`:38-40`); slug clash check on admin update                                             |
| `project`/`cert` edit     | `admin/**/[id]/+page.server.ts:load` `.eq('id',params.id).single()` → 404 if missing                      | No cache                                                                                                                       | `update` action `redirect(303,...)` on success, `fail(400,{errors:flatten().fieldErrors})` on zod fail |

Mutation pattern: `<form method="POST" action="?/update|?/delete|?/uploadImage|?/uploadVideo|?/guestbook" use:enhance>` + server `actions:{...}` returning `fail()` or `redirect`/`{success,publicUrl}`. Preserve `id`/`slug` hidden inputs. NEVER use `fetch()` POST to actions — use `use:enhance` or native form submit.
