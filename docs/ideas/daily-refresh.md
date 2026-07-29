# Daily Automated Refresh

## Problem Statement
How Might We automate the daily rebuilding of the Hub dashboard so that the static RSS feeds and data are always fresh, using the simplest possible path?

## Recommended Direction
**GitHub Action + Vercel Deploy Hook.** 
We will generate a unique "Deploy Hook" URL in the Vercel dashboard. Then, we will create a 10-line GitHub Action that runs daily on a cron schedule. The action will simply send a silent POST request to that Vercel URL, triggering a fresh production build.

## Key Assumptions to Validate
- [x] Vercel account allows Deploy Hooks (Available on all tiers, including Hobby).
- [x] GitHub Actions are enabled for this repository.

## MVP Scope
- Create a Vercel Deploy Hook URL.
- Store the URL as a GitHub Repository Secret (`VERCEL_DEPLOY_HOOK`).
- Add a `.github/workflows/daily-rebuild.yml` file that runs `curl -X POST` to that secret on a `0 4 * * *` (daily at 4 AM) cron schedule.

## Not Doing (and Why)
- **Migrating to GitHub Pages:** Too much overhead and disruption for a simple automation task.
- **Converting to SSR/Real-time:** Would expose the app to RSS rate limits and slow down the snappy client-side experience.
- **Committing Data to Git:** Committing automated data files pollutes the git history and makes rollbacks confusing.
