import type { APIRoute } from 'astro';
import Redis from 'ioredis';

// Initialize ioredis with the standard REDIS_URL
const redis = new Redis(import.meta.env.REDIS_URL || process.env.REDIS_URL || '');

export const GET: APIRoute = async ({ request }) => {
  const authHeader = request.headers.get('Authorization');
  const expectedPin = import.meta.env.ADMIN_PIN;

  if (!expectedPin || authHeader !== `Bearer ${expectedPin}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const rawCards = await redis.lrange('naf:saved_cards', 0, -1);
    const cards = rawCards.map(c => JSON.parse(c));
    
    return new Response(JSON.stringify(cards), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: 'Database error' }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  const authHeader = request.headers.get('Authorization');
  const expectedPin = import.meta.env.ADMIN_PIN;

  if (!expectedPin || authHeader !== `Bearer ${expectedPin}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const card = await request.json();
    await redis.lpush('naf:saved_cards', JSON.stringify(card));
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: 'Database error' }), { status: 500 });
  }
};
