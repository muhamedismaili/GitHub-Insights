# GitHub Insights Dashboard

A full-stack web app for exploring GitHub. Search users and repos, save repos to a personal watchlist with notes, and view a dashboard that visualizes commit activity and language breakdown across your watched repos. Sign in with GitHub — your watchlist and dashboard are private to your account.

**Live app:** https://github-insights-dusky.vercel.app

## Features

- **Search** — find GitHub users/orgs and browse their public repositories
- **Repo detail** — stars, forks, language, description, and a direct link to GitHub
- **Watchlist** — save repos, add notes, remove items, paginated (8 per page)
- **Dashboard** — total repos watched, most-starred repo, most recently added, a language-breakdown chart, and a commit-activity chart per watched repo
- **Authentication** — sign in with GitHub (OAuth). Each account has its own private watchlist and dashboard; `/watchlist` and `/dashboard` require sign-in
- Loading skeletons, styled error states, and empty states throughout
- Responsive layout

## Tech stack

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS**
- **Prisma** + **PostgreSQL** (Neon, via the Vercel Marketplace) — SQLite locally is also supported with a small config change, see below
- **Auth.js (NextAuth v5)** with the GitHub OAuth provider and `@auth/prisma-adapter` (database-backed sessions)
- **Recharts** for the dashboard charts
- **GitHub REST API** for search, repos, languages, and commit activity — called directly from Server Components (not proxied through the app's own domain) so the app works correctly behind Vercel's deployment protection on preview URLs
- Deployed on **Vercel**

## Setup

### 1. Clone and install

```bash
git clone <this-repo-url>
cd github_insights_project
npm install
```

### 2. Create a GitHub personal access token

Used server-side to call the GitHub API with a higher rate limit (5,000/hour instead of 60/hour).

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token (classic) — no scopes needed for public data
3. Copy the token

### 3. Create a GitHub OAuth App

Used for signing in with GitHub. You'll need one callback URL per environment you run this in (e.g. one for local dev, one for your deployed domain — GitHub OAuth Apps support multiple callback URLs).

1. GitHub → Settings → Developer settings → OAuth Apps → New OAuth App
2. Homepage URL: `http://localhost:3000` (or your deployed URL)
3. Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
   - For a deployed instance, also add: `https://<your-domain>/api/auth/callback/github`
4. Register, then copy the **Client ID** and generate a **Client Secret**

### 4. Set up a database

This project uses PostgreSQL. The quickest way to get one for free:

- **Neon** (neon.tech) — sign up, create a project, copy the connection string, or
- **Vercel Postgres/Marketplace** — if deploying on Vercel, add a Postgres integration from the Storage tab in your project, which provisions a Neon database and injects `DATABASE_URL` automatically

If you'd rather run SQLite locally instead, change `provider = "postgresql"` to `provider = "sqlite"` in `prisma/schema.prisma`, set `DATABASE_URL="file:./dev.db"`, and swap the driver adapter in `app/lib/prisma.ts` from `@prisma/adapter-pg` to `@prisma/adapter-better-sqlite3`.

### 5. Set up environment variables

Create `.env.local` in the project root:

```bash
GITHUB_TOKEN=your_personal_access_token
DATABASE_URL="your_postgres_connection_string"
AUTH_GITHUB_ID=your_oauth_client_id
AUTH_GITHUB_SECRET=your_oauth_client_secret
AUTH_SECRET=your_generated_secret
```

Generate `AUTH_SECRET` with:

```bash
openssl rand -base64 32
```

**Note:** `prisma.config.ts` loads variables from `.env`, not `.env.local`, for CLI commands (`prisma migrate`, `prisma studio`). If you hit a "provided database string is invalid" error while migrating, make sure `DATABASE_URL` is also set in a plain `.env` file at the project root, matching `.env.local`.

### 6. Set up the database schema

```bash
npx prisma generate
npx prisma migrate dev
```

### 7. Run the app

```bash
npm run dev
```

Visit `http://localhost:3000`, sign in with GitHub, and start searching.

## How it works

- Every GitHub API call is made directly from Server Components/Route Handlers to `api.github.com`, using the server-side token — the token is never sent to the browser, and pages never proxy through the app's own domain (which avoids issues with Vercel's deployment protection on preview/branch URLs).
- The watchlist and its notes live in a Postgres database via Prisma. Each `WatchlistItem` is linked to a `userId`; every watchlist and dashboard query is scoped to the signed-in user.
- Sign-in uses Auth.js's GitHub OAuth provider with a Prisma-backed (database) session — creating an account is just signing in with GitHub for the first time.
- `/watchlist` and `/dashboard` are protected: visiting either while signed out redirects to the home page.
- The dashboard aggregates live GitHub data (stars, languages, commit activity) across everything on your watchlist — nothing is duplicated into the database beyond the `owner`/`repo` reference and your notes.

## Deploying

1. Push to GitHub, import the repo into Vercel.
2. Add a Postgres database via the Storage tab (Neon, via the Marketplace) — this sets `DATABASE_URL` automatically.
3. Add `GITHUB_TOKEN`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`, and `AUTH_SECRET` in Project Settings → Environment Variables, scoped to Production (and Preview, if you want preview deploys to work too).
4. Add your deployed domain's callback URL to the GitHub OAuth App (step 3 above).
5. Make sure your `package.json` build script generates the Prisma client before building: `"build": "prisma generate && next build"`.
6. Push — Vercel deploys automatically on every push to `main`.