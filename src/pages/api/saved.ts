export const prerender = false;

import type { APIContext, APIRoute } from 'astro';
import Redis from 'ioredis';
import { createHash, timingSafeEqual } from 'node:crypto';
import { getCardKey, normalizeCard } from '../../lib/cards';

// Legacy `naf:` prefix from before the rename to Hub; changing it would orphan existing bookmarks
const LIST_KEY = 'naf:saved_cards';
const MAX_BODY_BYTES = 16 * 1024;
const MAX_AUTH_FAILURES = 10;
const AUTH_FAILURE_WINDOW_SECONDS = 15 * 60;

const redisUrl = import.meta.env.REDIS_URL || process.env.REDIS_URL;
const redis = redisUrl ? new Redis(redisUrl, { maxRetriesPerRequest: 2 }) : null;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const sha256 = (value: string) => createHash('sha256').update(value).digest();

function clientIp({ request, clientAddress }: APIContext): string {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  if (forwarded) return forwarded;
  try {
    return clientAddress;
  } catch {
    return 'unknown';
  }
}

/** Returns an error Response if the request is not authorized, otherwise null. */
async function authorize(context: APIContext): Promise<Response | null> {
  if (!redis) return json({ error: 'Storage not configured' }, 503);

  const expectedPin = import.meta.env.ADMIN_PIN || process.env.ADMIN_PIN;
  if (!expectedPin) return json({ error: 'Unauthorized' }, 401);

  const failKey = `naf:auth_fail:${clientIp(context)}`;
  const failures = Number(await redis.get(failKey).catch(() => 0)) || 0;
  if (failures >= MAX_AUTH_FAILURES) return json({ error: 'Too many attempts' }, 429);

  const header = context.request.headers.get('Authorization') ?? '';
  // Compare fixed-length digests so the check is constant-time regardless of input length
  if (timingSafeEqual(sha256(header), sha256(`Bearer ${expectedPin}`))) return null;

  await redis.multi().incr(failKey).expire(failKey, AUTH_FAILURE_WINDOW_SECONDS).exec().catch(() => {});
  return json({ error: 'Unauthorized' }, 401);
}

async function readJsonBody(request: Request): Promise<unknown> {
  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) throw new Response(null, { status: 413 });
  try {
    return JSON.parse(text);
  } catch {
    throw new Response(null, { status: 400 });
  }
}

async function readStoredCards(client: Redis) {
  const raw = await client.lrange(LIST_KEY, 0, -1);
  return raw.map(entry => {
    let parsed: unknown = null;
    try { parsed = JSON.parse(entry); } catch {}
    return { raw: entry, card: normalizeCard(parsed), key: getCardKey(parsed) };
  });
}

export const GET: APIRoute = async (context) => {
  const denied = await authorize(context);
  if (denied) return denied;

  try {
    const stored = await readStoredCards(redis!);
    const seen = new Set<string>();
    const cards = stored.filter(({ card, key }) => {
      if (!card || !key || seen.has(key)) return false;
      seen.add(key);
      return true;
    }).map(({ card }) => card);
    return json(cards);
  } catch (e) {
    console.error(e);
    return json({ error: 'Database error' }, 500);
  }
};

export const POST: APIRoute = async (context) => {
  const denied = await authorize(context);
  if (denied) return denied;

  try {
    const card = normalizeCard(await readJsonBody(context.request));
    const key = getCardKey(card);
    if (!card || !key) return json({ error: 'Invalid card' }, 400);

    const stored = await readStoredCards(redis!);
    if (stored.some(entry => entry.key === key)) return json({ success: true, duplicate: true });

    await redis!.lpush(LIST_KEY, JSON.stringify(card));
    return json({ success: true });
  } catch (e) {
    if (e instanceof Response) return e;
    console.error(e);
    return json({ error: 'Database error' }, 500);
  }
};

export const DELETE: APIRoute = async (context) => {
  const denied = await authorize(context);
  if (denied) return denied;

  try {
    const key = getCardKey(await readJsonBody(context.request));
    if (!key) return json({ error: 'Invalid card' }, 400);

    // Remove each matching entry by its exact stored string. LREM is atomic per call, so
    // concurrent saves are never lost (unlike rewriting the whole list), and re-serialized
    // JSON key-ordering drift can't cause a miss because we never re-serialize.
    const stored = await readStoredCards(redis!);
    let removed = 0;
    for (const entry of stored) {
      if (entry.key === key) removed += await redis!.lrem(LIST_KEY, 1, entry.raw);
    }
    return json({ success: true, removed });
  } catch (e) {
    if (e instanceof Response) return e;
    console.error(e);
    return json({ error: 'Database error' }, 500);
  }
};
