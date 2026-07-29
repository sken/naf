# Medium Signal Optimizer

## Problem Statement
How might we filter Medium articles for high engagement entirely during our zero-config static build, given that standard RSS feeds lack engagement metrics?

## Recommended Direction
**Curated Sources + Build-Time Heuristics.** 
We abandon scraping Medium for exact clap counts because it introduces severe build fragility (Cloudflare blocking Vercel IPs). Instead, we replace broad RSS tags with specific, high-bar Medium Publications. We then run a lightweight heuristic filter in `index.astro` to drop articles that are suspiciously short or contain clickbait/spam title patterns (like ALL CAPS spam).

## Key Assumptions to Validate
- [ ] **Heuristic Accuracy:** Does dropping articles under 600 words actually remove the noise without destroying the signal? 
- [ ] **Publication Volume:** Do the top 3-4 Medium publications output enough content to keep the dashboard feeling fresh? 

## MVP Scope
**In Scope:**
- Update `hub.config.json` to replace generic tags with 3 high-quality publication feeds (e.g., UX Collective, Level Up Coding, Towards Data Science).
- Add a JS filter in `index.astro` that drops articles with `< 500` words based on the `<content:encoded>` RSS field.
- Add a title filter dropping ALL CAPS spam (e.g. "JASA WEBSITE...") and common clickbait phrases.

**Out of Scope:**
- Any HTTP requests outside of the standard RSS fetch.
- Scraping HTML for exact claps.
- Complex NLP or sentiment analysis.

## Not Doing (and Why)
- **Scraping Medium for Claps:** Will get rate-limited/blocked by Cloudflare during Vercel builds, violating the "stable static build" architecture.
- **Hacker News Cross-Referencing:** Too complex for the MVP, adds another point of network failure.
- **AI Scoring:** Unnecessary overhead. Simple heuristics will solve 90% of the problem.
