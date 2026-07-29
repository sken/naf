# Naf - Frontend Ecosystem Dashboard

Naf is a lightning-fast, statically generated discovery dashboard that tracks multiple vectors of the frontend ecosystem, including industry news, GitHub trending repositories, and browser platform updates.

It executes server-side data fetching entirely at build-time to avoid API rate limits, ensuring instant client-side loads while remaining perfectly optimized for zero-config deployments.

## ✨ Features

- **Unified Bento Grid:** A dynamic, masonry-style layout powered by CSS Grid `dense` and container queries. Cards intelligently size themselves based on their content weight.
- **Aarhus Light Design System:** A premium, colorful Nordic aesthetic utilizing three custom palettes (ARoS Modernism, Historic Heritage, Coastal Minimalism).
- **Butter-Smooth Filtering:** Client-side category filtering powered entirely by the native `View Transitions API` for seamless DOM morphing.
- **Fair Representation RSS:** An algorithmic ingest engine that guarantees representation from every defined RSS source to prevent high-volume publishers from dominating the feed.
- **Persistent Bookmarks:** A built-in, serverless capability to securely save cards directly to a Redis database via hybrid API endpoints.

## 🛠 Tech Stack

- **Framework:** [Astro](https://astro.build) (SSG with Hybrid API Routes)
- **Styling:** Vanilla CSS (Zero external CSS frameworks)
- **Database:** Redis (via `ioredis`)
- **Package Manager:** `pnpm` (Strictly enforced)

## 🚀 Quick Start

### 1. Installation
Clone the repository and install dependencies strictly using `pnpm`:

```bash
git clone https://github.com/skendlba/naf.git
cd naf
pnpm install
```

### 2. Environment Variables
To enable the persistent bookmarking feature, create a `.env.local` file in the root of the project with your Redis connection string and a custom admin PIN:

```env
REDIS_URL="redis://your-redis-database-url:port"
ADMIN_PIN="1234" # Used to authorize saves from the frontend
```

### 3. Development
Start the local Astro development server:

```bash
pnpm run dev
```

Visit `http://localhost:4300` in your browser.

## ⚙️ Configuration (`naf.config.json`)

Naf is designed to be a "Zero-Config" deployment. There is no database required for the core dashboard, no complex authentication, and no SSR admin panels. 

The entire dashboard is driven by a single local JSON file: `naf.config.json`.
To add a new RSS feed, track a new GitHub handle, or update layout constraints, simply modify this file. The Astro build step will automatically ingest the new sources.

```json
{
  "limits": {
    "totalNews": 36,
    "githubTrending": 12,
    "githubStarred": 6
  },
  "sources": [
    {
      "name": "Smashing Magazine",
      "url": "https://www.smashingmagazine.com/feed/"
    }
  ]
}
```

## 📝 License

MIT
