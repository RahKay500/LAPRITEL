import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables')
}

export const supabase = createClient(SUPABASE_URL.trim(), SUPABASE_SERVICE_ROLE_KEY.trim(), {
  auth: {
    persistSession: false,
  },
  // Node 20 has no native WebSocket global, which the realtime client
  // requires even though we only use plain REST table queries here.
  realtime: {
    transport: ws,
  },
})
