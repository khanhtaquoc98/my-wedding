import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://opveafkzzdzkvektgkog.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_e8MyU8EkgerJ-wMiDR9_RQ_OIDx-J3z';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
