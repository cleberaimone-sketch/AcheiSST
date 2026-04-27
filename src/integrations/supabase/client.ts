"use client";
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Adaptação dos tokens do Vite (import.meta.env) para o padrão Serverless Next.js
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Evita que o SSR do Next.js tente acessar localStorage prematuramente
const getStorage = () => {
  if (typeof window !== 'undefined') {
    return localStorage;
  }
  return undefined;
};

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: getStorage(),
    persistSession: true,
    autoRefreshToken: true,
  }
});