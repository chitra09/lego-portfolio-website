# Lego Gallery

A growing gallery of Lego creations, built with Next.js and deployed on
Vercel. See [SPEC.md](./SPEC.md) for the full design doc.

## Adding a new creation

Preferred way — via the CMS:

1. Go to `/admin` on the live site and log in with GitHub.
2. Fill out the form (title, date, theme, photos, story) and save.
3. It commits straight to `main`, which triggers a new Vercel deploy.

Manual way (for local testing) — add a Markdown file under
`content/creations/<slug>.md` with frontmatter matching the shape in
`lib/creations.ts`, and drop photos in `public/creations/<slug>/`. See the
two sample creations in `content/creations/` for the exact format.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploying

1. Push this repo to GitHub.
2. Import it into [Vercel](https://vercel.com/new) — it auto-detects
   Next.js, no config needed.
3. Every push to `main` redeploys automatically.

## Finishing the `/admin` CMS setup

`public/admin/config.yml` has `backend.repo` set to
`chitra09/lego-portfolio-website`.

Decap CMS's GitHub backend needs an OAuth app + a small proxy to complete
login (it was built with Netlify's auth in mind, and we're on Vercel
instead). Steps:

1. Create a GitHub OAuth App at
   `github.com/settings/developers` → "New OAuth App":
   - Homepage URL: your deployed site URL
   - Authorization callback URL: `https://<your-site>/api/auth/callback`
2. Deploy an OAuth provider proxy — a small pair of Vercel serverless API
   routes that handle the GitHub OAuth handshake on Decap's behalf. Search
   for "Decap CMS GitHub OAuth provider Vercel" to find a current
   community template (this ecosystem changes; I'm intentionally not
   hardcoding a specific repo link here since I can't vouch one is still
   maintained). Configure it with the OAuth App's client ID/secret as
   Vercel environment variables.
3. Point `config.yml`'s `backend.base_url` at that deployed proxy.

This is a one-time setup step — once done, adding new creations through
`/admin` never needs it touched again.
