import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

// All valid content keys
const VALID_KEYS = [
  'ft-events', 'ft-hero', 'ft-guides', 'ft-newest-guides',
  'ft-events-coming', 'ft-hg-thisweek', 'ft-hg-more', 'ft-hg-stories',
  'ft-ap-highlights', 'ft-ap-time', 'ft-ap-latest',
  'ft-ad-featured-main', 'ft-ad-featured-list', 'ft-ad-scene', 'ft-ad-editors-pick',
  'ft-subscribers', 'ft-updated'
];

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
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
    console.error('Content API error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
