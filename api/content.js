import { createClient } from '@supabase/supabase-js';

// All valid content keys
const VALID_KEYS = [
  'ft-events', 'ft-hero', 'ft-guides', 'ft-newest-guides',
  'ft-events-coming', 'ft-hg-thisweek', 'ft-hg-more', 'ft-hg-stories',
  'ft-ap-highlights', 'ft-ap-time', 'ft-ap-latest',
  'ft-ad-featured-main', 'ft-ad-featured-list', 'ft-ad-scene', 'ft-ad-editors-pick',
  'ft-subscribers', 'ft-messages', 'ft-updated'
];

let _supabase = null;
function getSupabase() {
  if (_supabase) return _supabase;
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      'Missing Supabase env vars. In Vercel go to: project → Settings → Environment Variables. ' +
      'Add SUPABASE_URL and SUPABASE_ANON_KEY then Redeploy.'
    );
  }
  _supabase = createClient(url, key);
  return _supabase;
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
      SUPABASE_URL: process.env.SUPABASE_URL ? 'SET ✓' : (process.env.VITE_SUPABASE_URL ? 'SET via VITE_SUPABASE_URL ✓' : 'MISSING ✗'),
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? 'SET ✓' : (process.env.VITE_SUPABASE_ANON_KEY ? 'SET via VITE_SUPABASE_ANON_KEY ✓' : 'MISSING ✗'),
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET ✓' : 'NOT SET (optional)',
      NODE_ENV: process.env.NODE_ENV || 'unknown'
    });
  }

  try {
    const supabase = getSupabase();

    // GET — fetch one or all content keys
    if (req.method === 'GET') {
      const { key } = req.query;

      if (key) {
        if (!VALID_KEYS.includes(key)) return res.status(400).json({ error: 'Invalid key' });
        const { data, error } = await supabase.from('content').select('value').eq('key', key).single();
        // PGRST116 = row not found — that's fine, just return null
        if (error && error.code !== 'PGRST116') {
          return res.status(500).json({ error: error.message, hint: 'Supabase query failed. Check RLS policies on the content table in Supabase dashboard.' });
        }
        return res.status(200).json({ key, value: data ? data.value : null });
      }

      // Fetch all keys at once
      const { data, error } = await supabase.from('content').select('*');
      if (error) {
        return res.status(500).json({ error: error.message, hint: 'Supabase query failed. Check RLS policies on the content table.' });
      }
      const results = {};
      if (data) {
        data.forEach(row => { results[row.key] = row.value; });
      }
      return res.status(200).json(results);
    }

    // POST — save one or multiple content keys
    if (req.method === 'POST') {
      const { key, value, batch } = req.body;

      if (batch && typeof batch === 'object') {
        const rows = Object.entries(batch)
          .filter(([k]) => VALID_KEYS.includes(k))
          .map(([k, v]) => {
            let parsed = v;
            if (typeof v === 'string') { try { parsed = JSON.parse(v); } catch(e) { parsed = v; } }
            return { key: k, value: parsed };
          });
        const { error } = await supabase.from('content').upsert(rows, { onConflict: 'key' });
        if (error) return res.status(500).json({ error: error.message, hint: 'Supabase upsert failed. Check RLS policies (INSERT/UPDATE must be allowed).' });
        return res.status(200).json({ ok: true, saved: rows.length });
      }

      if (!key || !VALID_KEYS.includes(key)) return res.status(400).json({ error: 'Invalid or missing key' });
      let parsedValue = value;
      if (typeof value === 'string') { try { parsedValue = JSON.parse(value); } catch(e) { parsedValue = value; } }
      const { error } = await supabase.from('content').upsert({ key, value: parsedValue }, { onConflict: 'key' });
      if (error) return res.status(500).json({ error: error.message, hint: 'Supabase upsert failed. Check RLS policies.' });
      return res.status(200).json({ ok: true, key });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (err) {
    console.error('Content API error:', err.message);
    return res.status(500).json({
      error: err.message,
      hint: 'Visit your-site.vercel.app/api/content?debug=1 to see which env vars are set. Then go to Vercel → project → Settings → Environment Variables and add SUPABASE_URL + SUPABASE_ANON_KEY, then Redeploy.'
    });
  }
}
