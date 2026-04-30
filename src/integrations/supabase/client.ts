"use client";
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';

// Usa cookies (mesmo storage do servidor) para que o OAuth callback funcione corretamente
export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);