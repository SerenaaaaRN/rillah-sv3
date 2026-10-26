# rillah.dev | Personal Portfolio

![SvelteKit](https://img.shields.io/badge/SvelteKit-3-FF3E00?logo=svelte)
![Svelte 5 Runes](https://img.shields.io/badge/Svelte-5-FF3E00?logo=svelte&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-DB%20%2B%20Auth%20%2B%20Storage-3ECF8E?logo=supabase)
![Cloudflare](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white)
![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)

This repository powers **[rillah.dev](https://rillah.dev)**, the personal portfolio of Duhairillah (Software Engineer). It is a single SvelteKit application: a public SEO landing backed by Supabase (Postgres + Auth + Storage), with a single-admin dashboard (`/admin/*`) for managing projects and certificates. Deployed on Cloudflare Workers.

---

## About the Project

**rillah.dev** turns a static portfolio into a self-editable one: content lives in Supabase and is curated through a login-gated CMS, while the public pages stay fast, SEO-first, and cacheable at the edge.

### Key Highlights:

- 🏠 **Public Landing** — intro, career timeline, education, skills, live GitHub contribution calendar (6h server cache), scrolltelling sections
- 🗂️ **Projects & Certificates** — searchable, filterable lists (`/projects`, `/certificates`) with detail pages + edge cache
- 🖼️ **Admin CMS** (`/admin/*`) — login-gated CRUD, image/video upload with automatic WebP compression (5 MB images / 50 MB videos), display ordering
- 📝 **Guestbook** — public entries with Indonesian relative timestamps, honeypot + XSS guard
- 🔍 **SEO** — sitemap, robots, JSON-LD, 301 canonical redirect, self-hosted fonts

### Architecture

Single-package SvelteKit app.

| Layer         | Role                                                                       |
| ------------- | -------------------------------------------------------------------------- |
| `(landing)`   | Public pages: `/`, `/projects`, `/certificates`, `/blog`, guestbook POST   |
| `(dashboard)` | `/admin/*` — auth-guarded at layout level, CRUD + uploads via `uploadTask` |
| `(auth)`      | `/login`, `/logout`                                                        |
| `src/lib/`    | supabase clients (ssr/browser/static), zod schemas, hooks, utils, SEO      |

---

## Tech Stack

- **SvelteKit 3 + Svelte 5** — runes forced (`$state`/`$derived`), SSR + form actions
- **Cloudflare Workers** — `adapter-cloudflare` + `wrangler`
- **Supabase** — Postgres + Auth (`signInWithPassword`) + Storage (`project-images`, `certificate-images`) via `supabase-js` + `@supabase/ssr`
- - **Tailwind CSS v4** — brutalist theme
- **Bits UI + shadcn-svelte** — primitive ui, vega style, phosphor icons, brutalist theme
- **Zod 4** — validation for every form (`FormData` never trusted raw)

---

## Features & User Guide

### Public

| Page                     | Description                                                                            |
| ------------------------ | -------------------------------------------------------------------------------------- |
| `/`                      | Landing — profile, career, skills, GitHub calendar (streamed), certificates, guestbook |
| `/projects`              | Searchable/filterable project grid (category filter)                                   |
| `/projects/[slug-or-id]` | Project detail — carousel, features, links; UUID links 301 to slug                     |
| `/certificates`          | Certificate gallery with issuer filter, highlight/timeline sorting, lightbox           |
| `/blog`                  | Blog index                                                                             |
| `/login`                 | Admin sign-in                                                                          |

### Admin (`/admin/*` — requires login)

| Page                                          | Description                                                               |
| --------------------------------------------- | ------------------------------------------------------------------------- |
| `/admin`                                      | Overview stats — totals, unique categories/tags, top technologies         |
| `/admin/projects`                             | Projects table + delete (`supabase:projects` invalidation)                |
| `/admin/projects/new`, `/admin/projects/[id]` | Create/edit — slug auto/manual, single-select category enum, media upload |
| `/admin/certificates`, `/new`, `[id]`         | Same pattern; dates stored as id-ID display strings                       |

---

## License

Code is available for reference/learning only — Duhairillah. All Rights Reserved.

Text, images, portfolio content, and design are **not** licensed for reuse, replication, or redistribution.
