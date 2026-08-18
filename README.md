# GitHub Insights Dashboard

A full-stack web app for exploring GitHub. Search users and repos, save repos to a personal watchlist with notes, and view a dashboard that visualizes commit activity and language breakdown across your watched repos. Sign in with GitHub — your watchlist and dashboard are private to your account.

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
- **Prisma** + **SQLite** (local dev database)
- **Auth.js (NextAuth v5)** with the GitHub OAuth provider and `@auth/prisma-adapter`
- **Recharts** for the dashboard charts
- **GitHub REST API** for search, repos, languages, and commit activity

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

Used for signing in with GitHub.

1. GitHub → Settings → Developer settings → OAuth Apps → New OAuth App
2. Homepage URL: `http://localhost:3000`
3. Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Register, then copy the **Client ID** and generate a **Client Secret**

### 4. Set up environment variables

Create `.env.local` in the project root:

```bash
GITHUB_TOKEN=your_personal_access_token
DATABASE_URL="file:./dev.db"
AUTH_GITHUB_ID=your_oauth_client_id
AUTH_GITHUB_SECRET=your_oauth_client_secret
AUTH_SECRET=your_generated_secret
```

Generate `AUTH_SECRET` with:

```bash
openssl rand -base64 32
```

### 5. Set up the database

```bash
npx prisma generate
npx prisma migrate dev
```

### 6. Run the app

```bash
npm run dev
```

Visit `http://localhost:3000`, sign in with GitHub, and start searching.

## How it works

- Every call to the GitHub API is proxied through server-side Route Handlers (`/api/github/*`) — the token is never sent to the browser.
- The watchlist and its notes live in a SQLite database via Prisma. Each `WatchlistItem` is linked to a `userId`; every watchlist and dashboard query is scoped to the signed-in user.
- Sign-in uses Auth.js's GitHub OAuth provider with a Prisma-backed (database) session — creating an account is just signing in with GitHub for the first time.
- `/watchlist` and `/dashboard` are protected: visiting either while signed out redirects to the home page.
- The dashboard aggregates live GitHub data (stars, languages, commit activity) across everything on your watchlist — nothing is duplicated into the database beyond the `owner`/`repo` reference and your notes.