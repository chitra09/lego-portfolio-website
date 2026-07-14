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
`chitra09/lego-portfolio-website`, with `base_url` pointing at this same
site and `auth_endpoint: api/auth`.

Decap CMS's GitHub backend needs an OAuth app + a small proxy to complete
login (it was built with Netlify's auth in mind, and we're on Vercel
instead). Rather than depending on a third-party template, the proxy is
just two serverless routes in this app: `app/api/auth/route.ts` (kicks
off the GitHub OAuth redirect) and `app/api/callback/route.ts` (exchanges
the code for a token and hands it back to the CMS popup).

One-time setup:

1. Create a GitHub OAuth App at `github.com/settings/developers` →
   "OAuth Apps" → "New OAuth App":
   - Application name: anything, e.g. "Lego Gallery CMS"
   - Homepage URL: `https://guha-lego-creations.vercel.app`
   - Authorization callback URL:
     `https://guha-lego-creations.vercel.app/api/callback`
2. After registering, click "Generate a new client secret" and copy both
   the **Client ID** and **Client Secret**.
3. In the Vercel project → Settings → Environment Variables, add:
   - `OAUTH_CLIENT_ID` = the Client ID
   - `OAUTH_CLIENT_SECRET` = the Client Secret
4. Redeploy (Vercel does this automatically after saving env vars, or
   trigger one manually).

After that, `/admin` → "Login with GitHub" works end-to-end. This is a
one-time setup step — adding new creations through `/admin` afterward
never needs it touched again.
