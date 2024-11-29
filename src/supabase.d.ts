// supabase.d.ts
import { Database } from './types/supabase'; // Adjust the path to your database types

declare module '@supabase/supabase-js' {
  interface SupabaseClient {
    rpc<T = any>(fn: 'get_status_counts', params?: any): Promise<{ data: T | null; error: Error | null }>;
  }
}
