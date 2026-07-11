import { Redis } from '@upstash/redis';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

// Load variables from .env
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!REDIS_URL || !REDIS_TOKEN) {
    console.error('Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN in .env');
    process.exit(1);
}
if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env');
    process.exit(1);
}

const redis = new Redis({ url: REDIS_URL, token: REDIS_TOKEN });
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const VALID_KEYS = [
    'ft-events', 'ft-hero', 'ft-guides', 'ft-newest-guides',
    'ft-events-coming', 'ft-hg-thisweek', 'ft-hg-more', 'ft-hg-stories',
    'ft-ap-highlights', 'ft-ap-time', 'ft-ap-latest',
    'ft-ad-featured-main', 'ft-ad-featured-list', 'ft-ad-scene', 'ft-ad-editors-pick',
    'ft-subscribers', 'ft-messages', 'ft-updated'
];

async function migrate() {
    console.log('Starting migration from Upstash Redis to Supabase...');
    
    const pipeline = redis.pipeline();
    VALID_KEYS.forEach(k => pipeline.get(`content:${k}`));
    
    console.log('Fetching data from Redis...');
    const results = await pipeline.exec();
    
    const rowsToInsert = [];
    VALID_KEYS.forEach((key, i) => {
        let value = results[i];
        if (value !== null && value !== undefined) {
            // Parse stringified JSON if needed
            if (typeof value === 'string') {
                try { value = JSON.parse(value); } catch (e) {}
            }
            rowsToInsert.push({ key, value });
        }
    });
    
    if (rowsToInsert.length === 0) {
        console.log('No data found in Redis. Migration complete.');
        return;
    }
    
    console.log(`Found ${rowsToInsert.length} keys to migrate. Inserting into Supabase...`);
    
    const { error } = await supabase.from('content').upsert(rowsToInsert);
    
    if (error) {
        console.error('Error inserting into Supabase:', error.message);
    } else {
        console.log('Migration successful! All data has been copied to Supabase.');
    }
}

migrate().catch(err => console.error(err));
