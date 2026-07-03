import { Redis } from '@upstash/redis';

// All valid content keys
const VALID_KEYS = [
  'ft-events', 'ft-hero', 'ft-guides', 'ft-newest-guides',
  'ft-events-coming', 'ft-hg-thisweek', 'ft-hg-more', 'ft-hg-stories',
  'ft-ap-highlights', 'ft-ap-time', 'ft-ap-latest',
  'ft-ad-featured-main', 'ft-ad-featured-list', 'ft-ad-scene', 'ft-ad-editors-pick',
  'ft-subscribers', 'ft-messages', 'ft-updated'
];

// Lazy Redis instance — initialized only when first needed, not at module load.
// This prevents a crash when env vars are missing.
let _redis = null;
function getRedis() {
  if (_redis) return _redis;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error(
      'Missing Upstash env vars. In Vercel go to: project → Settings → Environment Variables. ' +
      'Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN. ' +
      'Get values from https://console.upstash.com then Redeploy.'
    );
  }

  _redis = new Redis({ url, token });
  return _redis;
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Debug endpoint — visit /api/content?debug=1 to check env var status
  if (req.method === 'GET' && req.query.debug === '1') {
    return res.status(200).json({
      UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL ? 'SET ✓' : 'MISSING ✗',
      UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN ? 'SET ✓' : 'MISSING ✗',
      NODE_ENV: process.env.NODE_ENV || 'unknown'
    });
  }

  try {
    const redis = getRedis();

    // GET — fetch one or all content keys
    if (req.method === 'GET') {
      const { key } = req.query;

      // Single key
      if (key) {
        if (!VALID_KEYS.includes(key)) {
          return res.status(400).json({ error: 'Invalid key' });
        }
        const value = await redis.get(`content:${key}`);
        return res.status(200).json({ key, value });
      }

      // All keys — fetch everything at once for content-loader
      const pipeline = redis.pipeline();
      VALID_KEYS.forEach(k => pipeline.get(`content:${k}`));
      const results = await pipeline.exec();

      const data = {};
      VALID_KEYS.forEach((k, i) => {
        if (results[i] !== null && results[i] !== undefined) {
          data[k] = results[i];
        }
      });

      return res.status(200).json(data);
    }

    // POST — save one or multiple content keys
    if (req.method === 'POST') {
      const { key, value, batch } = req.body;

      // Batch save (multiple keys at once)
      if (batch && typeof batch === 'object') {
        const pipeline = redis.pipeline();
        for (const [k, v] of Object.entries(batch)) {
          if (!VALID_KEYS.includes(k)) continue;
          pipeline.set(`content:${k}`, typeof v === 'string' ? v : JSON.stringify(v));
        }
        await pipeline.exec();
        return res.status(200).json({ ok: true, saved: Object.keys(batch).length });
      }

      // Single key save
      if (!key || !VALID_KEYS.includes(key)) {
        return res.status(400).json({ error: 'Invalid or missing key' });
      }
      await redis.set(`content:${key}`, typeof value === 'string' ? value : JSON.stringify(value));
      return res.status(200).json({ ok: true, key });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (err) {
    console.error('Content API error:', err.message);
    return res.status(500).json({
      error: err.message,
      hint: 'Go to Vercel → project → Settings → Environment Variables. Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN from https://console.upstash.com'
    });
  }
}
