# Lego Gallery — Project Spec

## 1. Goal

A public website showcasing every Lego creation your kid has built, growing over
the years. New creations should be easy to add (via a simple web form, not
hand-editing code), the site should be fast and photo-forward, and the whole
thing should cost $0 to run.

## 2. Tech Stack

| Layer          | Choice                              | Why |
|----------------|--------------------------------------|-----|
| Framework      | **Next.js** (App Router)            | First-class Vercel support, static generation, image optimization built in |
| Content        | **Markdown/JSON files in the repo**, edited via Decap CMS | No database to run or pay for; content is just git-versioned files |
| Content editor | **Decap CMS** at `/admin`           | Password-gated form UI for adding a creation — photo upload + fields — no git/code knowledge needed |
| Images         | Stored in the repo under `public/creations/...`, served via `next/image` | Simplest to start; revisit if the repo grows past a few thousand photos |
| Hosting        | **Vercel**, auto-deploy from GitHub `main` | Free tier, zero-config Next.js deploys, preview URLs per commit |
| Source control | **GitHub**                          | Already your plan; also what Decap CMS commits into |

## 3. How Adding a New Creation Works

1. You (or your kid) go to `yourdomain.com/admin`.
2. Log in (GitHub OAuth, restricted to your account).
3. Fill out a form: title, date built, theme/tags, piece count (optional),
   description, and upload one or more photos.
4. Decap CMS commits a new content file + images straight to the `main`
   branch (or opens a PR, configurable).
5. GitHub push triggers a Vercel deploy automatically — live in ~1 minute.

No local dev setup, no terminal, no git commands needed for day-to-day
additions. You'd only touch code again to change the site's design or add
features.

**Setup note:** Decap CMS's GitHub backend needs a small OAuth handshake
step. Since we're on Vercel (not Netlify), this means either (a) deploying a
tiny open-source OAuth proxy as a Vercel serverless function, or (b) using
Decap's hosted auth option if available at setup time. This is a one-time
setup detail, not something you'll deal with when adding creations later.

## 4. Content Model

Each creation is one Markdown file with frontmatter, e.g.
`content/creations/2026-07-13-millennium-falcon.md`:

```yaml
---
title: "Millennium Falcon"
date: 2026-07-13
theme: "Star Wars"
setNumber: "75257"       # optional, blank if it's an original MOC
pieceCount: 1351          # optional
tags: [starships, star-wars, large-build]
coverImage: /creations/millennium-falcon/cover.jpg
gallery:
  - /creations/millennium-falcon/01.jpg
  - /creations/millennium-falcon/02.jpg
videos:                     # optional, short clips (e.g. MP4)
  - /creations/millennium-falcon/flying.mp4
---

A few sentences about the build — how long it took, favorite part, any
modifications from the instructions.
```

Images for that creation live in `public/creations/millennium-falcon/`.

This structure is what the Decap CMS config maps its form fields to — you
won't hand-edit these files, but it's useful to know what's actually stored.

## 5. Pages / Features (MVP)

- **Home / Gallery grid** — cover photo + title for every creation, newest
  first, responsive grid.
- **Creation detail page** — full photo gallery (lightbox), description,
  metadata (date, theme, piece count, set number).
- **Filter/browse by theme or tag** — e.g. all Star Wars builds, all
  Technic builds.
- **Simple search** by title.
- **Admin** (`/admin`) — Decap CMS form, GitHub-auth gated.

### Nice-to-haves (post-MVP)
- Timeline view ("Lego builds by year").
- Stats page (total sets, total pieces, favorite theme).
- Tagging by builder if more than one kid contributes later.
- RSS/email notification to family when a new creation is added.
- Simple "guestbook" comments from family/friends (would need a backend —
  e.g. Vercel Postgres or a form service — out of scope for MVP).

## 6. Repo Structure (proposed)

```
/
├─ app/                    # Next.js App Router pages
│  ├─ page.tsx             # gallery home
│  ├─ creations/[slug]/    # detail page
│  └─ admin/               # Decap CMS mount (static config + index.html)
├─ content/
│  └─ creations/*.md       # one file per Lego build
├─ public/
│  └─ creations/<slug>/    # photos per build
├─ lib/                    # markdown loading/parsing helpers
├─ public/admin/config.yml # Decap CMS collection schema
└─ package.json
```

## 7. Deployment

1. Push repo to GitHub.
2. Import into Vercel (connect GitHub repo) — Vercel auto-detects Next.js.
3. Every push to `main` auto-deploys to production; PRs get preview URLs.
4. (Optional) attach a custom domain in Vercel once you pick one.

Public site — no auth needed to view; only `/admin` is gated.

## 8. Phased Plan

**Phase 1 — MVP**
- Next.js app scaffolded, deployed to Vercel, connected to GitHub.
- Content model + a handful of real creations added manually to prove the
  format.
- Gallery home page + detail pages, basic responsive styling.

**Phase 2 — Editing workflow**
- Wire up Decap CMS at `/admin` with GitHub OAuth.
- Verify the full loop: add a creation via the form → auto-deploy → shows
  up live.

**Phase 3 — Polish**
- Filtering/search, lightbox gallery, mobile pass, basic SEO/OpenGraph
  (nice for sharing a specific build with family).

**Phase 4 — Optional extras**
- Timeline/stats views, custom domain, anything from the nice-to-haves list.

## 9. Open Items to Revisit Later

- **Image volume:** if this grows to thousands of high-res photos over the
  years, the git repo will get heavy. Migrating images to Vercel Blob or
  Cloudinary is a contained change (swap image URLs) — not a rewrite.
- **Multiple contributors:** if your kid wants to add builds directly, just
  give them a login to `/admin` — no code access needed.
