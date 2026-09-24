// Shared card model used by the build step, the client script and the /api/saved endpoint.

export type CardType = 'news' | 'github' | 'chrome' | 'dev';

export interface NewsData { title: string; link: string; date: string; source: string; }
export interface RepoData { full_name: string; html_url: string; description: string; language: string; stargazers_count: number; isStarred?: boolean; }
export interface FeatureData { id: string; name: string; summary: string; category: string; status: string; }
export interface DevData { title: string; url: string; reactions: number; author: string; }

export type Card =
  | { type: 'news'; category: 'articles'; subcategory: string; data: NewsData }
  | { type: 'github'; category: 'repos'; subcategory: string; data: RepoData }
  | { type: 'chrome'; category: 'platform'; subcategory: string; data: FeatureData }
  | { type: 'dev'; category: 'articles'; subcategory: string; data: DevData };

const CATEGORY_BY_TYPE = { news: 'articles', github: 'repos', chrome: 'platform', dev: 'articles' } as const;

/** Returns the URL only if it is an absolute http(s) URL, otherwise null (blocks `javascript:` etc). */
export function safeUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null;
  } catch {
    return null;
  }
}

export function chromeFeatureUrl(id: string | number): string {
  return `https://chromestatus.com/feature/${encodeURIComponent(String(id))}`;
}

/**
 * Stable identity of a card: the URL it points to. Tolerates the legacy shapes
 * already stored in Redis (e.g. full Chrome Status feature objects).
 */
export function getCardKey(card: any): string | null {
  const d = card?.data;
  if (!d || typeof d !== 'object') return null;
  if (card.type === 'chrome' && d.id != null) return chromeFeatureUrl(d.id);
  return safeUrl(d.link ?? d.url ?? d.html_url);
}

function str(value: unknown, max = 300): string {
  return typeof value === 'string' ? value.slice(0, max) : '';
}

function num(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
}

/**
 * Validates untrusted input (API bodies, legacy Redis rows) into a well-formed Card
 * with only whitelisted fields. Returns null if the card is unusable.
 */
export function normalizeCard(input: any): Card | null {
  if (!input || typeof input !== 'object' || !input.data || typeof input.data !== 'object') return null;
  const type = input.type as CardType;
  if (!(type in CATEGORY_BY_TYPE)) return null;

  const d = input.data;
  const subcategory = /^[a-z0-9]{1,40}$/.test(input.subcategory) ? input.subcategory : 'all';

  switch (type) {
    case 'news': {
      const link = safeUrl(d.link);
      const title = str(d.title);
      if (!link || !title) return null;
      return { type, category: 'articles', subcategory, data: { title, link, date: str(d.date, 20), source: str(d.source, 60) } };
    }
    case 'dev': {
      const url = safeUrl(d.url);
      const title = str(d.title);
      if (!url || !title) return null;
      return { type, category: 'articles', subcategory, data: { title, url, reactions: num(d.reactions), author: str(d.author, 100) } };
    }
    case 'github': {
      const html_url = safeUrl(d.html_url);
      const full_name = str(d.full_name, 200);
      if (!html_url || !full_name) return null;
      return {
        type, category: 'repos', subcategory,
        data: { full_name, html_url, description: str(d.description, 1000), language: str(d.language, 40), stargazers_count: num(d.stargazers_count), isStarred: d.isStarred === true },
      };
    }
    case 'chrome': {
      const id = String(d.id ?? '');
      const name = str(d.name);
      if (!/^\d{1,20}$/.test(id) || !name) return null;
      return {
        type, category: 'platform', subcategory,
        data: {
          id, name,
          summary: str(d.summary, 2000),
          category: str(d.category, 60),
          status: str(d.status || d.browsers?.chrome?.status?.text, 60) || 'In Development',
        },
      };
    }
  }
}
