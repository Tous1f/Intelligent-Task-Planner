// Minimal supabase client stub for type-checking in server environment
export function createClient() {
  return {
    auth: {
      async getUser() {
        return { data: { user: null }, error: null };
      }
    }
  };
}
