import { createBrowserClient } from '@supabase/ssr'

type Database = {
  // Add your database types here when needed
}

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
