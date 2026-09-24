# Naf - Frontend Ecosystem Dashboard

Naf is a lightning-fast, statically generated discovery dashboard that tracks multiple vectors of the frontend ecosystem, including industry news, GitHub trending repositories, and browser platform updates.

It executes server-side data fetching entirely at build-time to avoid API rate limits, ensuring instant client-side loads while remaining perfectly optimized for zero-config deployments.

## ✨ Features

- **Reel Feed:** A masonry feed built on CSS multi-column layout on desktop, and a full-screen, scroll-snapping vertical reel on mobile.
- **Aarhus Light Design System:** A premium, colorful Nordic aesthetic utilizing three custom palettes (ARoS Modernism, Historic Heritage, Coastal Minimalism).
- **Butter-Smooth Filtering:** Client-side category filtering powered entirely by the native `View Transitions API` for seamless DOM morphing.
- **Fair Representation RSS:** An algorithmic ingest engine that guarantees representation from every defined RSS source and caps each source, so high-volume publishers can't dominate the feed.
- **Resilient Builds:** All sources are fetched in parallel with timeouts; a failing source is logged and skipped rather than breaking the build.
- **Persistent Bookmarks:** A built-in, serverless capability to securely save cards directly to a Redis database via hybrid API endpoints (PIN-protected, rate-limited, validated).

## 🛠 Tech Stack

- **Framework:** [Astro](https://astro.build) (SSG with Hybrid API Routes)
- **Styling:** Vanilla CSS (Zero external CSS frameworks)
- **Database:** Redis (via `ioredis`)
- **Package Manager:** `pnpm` (Strictly enforced)

## 🚀 Quick Start

### 1. Installation
Clone the repository and install dependencies strictly using `pnpm`:

```bash
git clone https://github.com/sken/naf.git
cd naf
pnpm install
```

### 2. Environment Variables
To enable the persistent bookmarking feature, create a `.env.local` file in the root of the project with your Redis connection string and a custom admin PIN:

```env
REDIS_URL="redis://your-redis-database-url:port"
ADMIN_PIN="choose-a-long-pin" # Used to authorize saves from the frontend
GITHUB_TOKEN="" # Optional: raises the GitHub API rate limit for the starred-repos fetch
```

### 3. Development
Start the local Astro development server:

```bash
pnpm run dev
```

Visit `http://localhost:4321` in your browser.

Type-check the project with:

```bash
pnpm run check
```

## ⚙️ Configuration (`hub.config.json`)

Naf is designed to be a "Zero-Config" deployment. There is no database required for the core dashboard, no complex authentication, and no SSR admin panels. 

The entire dashboard is driven by a single local JSON file: `hub.config.json`.
To add a new RSS feed, track a new GitHub handle, or update layout constraints, simply modify this file. The Astro build step will automatically ingest the new sources.

```json
{
  "githubUser": "sken",
  "limits": {
    "chromeFeatures": 12,
    "rssNews": 36,
    "rssMaxPerSource": 6,
    "githubTrending": 6,
    "githubStarred": 10,
    "devToArticles": 6
  },
  "frameworks": ["react", "next", "astro"],
  "rssSources": [
    { "url": "https://www.smashingmagazine.com/feed", "name": "Smashing Mag" }
  ]
}
```

Sources whose name starts with `Medium` go through an extra quality filter (English-only, no clickbait, and full-text posts of 500+ words, which drops member-only teasers).

## 📝 License

MIT
