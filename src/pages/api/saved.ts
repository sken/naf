export const prerender = false;

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

export const DELETE: APIRoute = async ({ request }) => {
  const authHeader = request.headers.get('Authorization');
  const expectedPin = import.meta.env.ADMIN_PIN;

  if (!expectedPin || authHeader !== `Bearer ${expectedPin}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const card = await request.json();
    
    // Fetch all, filter manually, and rewrite to avoid JSON key ordering issues
    const rawCards = await redis.lrange('naf:saved_cards', 0, -1);
    const newCards = [];
    let removed = false;
    
    for (const raw of rawCards) {
      const parsed = JSON.parse(raw);
      
      const isMatch = JSON.stringify(parsed) === JSON.stringify(card) || 
                      (parsed.data && card.data && (
                        (parsed.data.link && parsed.data.link === card.data.link) ||
                        (parsed.data.url && parsed.data.url === card.data.url) ||
                        (parsed.data.html_url && parsed.data.html_url === card.data.html_url) ||
                        (parsed.data.id && parsed.data.id === card.data.id)
                      ));
                      
      if (isMatch && !removed) {
        removed = true; // Remove the first match
      } else {
        newCards.push(raw);
      }
    }
    
    if (removed) {
      await redis.del('naf:saved_cards');
      if (newCards.length > 0) {
        // rpush array of strings
        await redis.rpush('naf:saved_cards', ...newCards);
      }
    }
    
    return new Response(JSON.stringify({ success: true, removed }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: 'Database error' }), { status: 500 });
  }
};
