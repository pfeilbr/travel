import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL as string | undefined;
const SUPABASE_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string | undefined;

export const authConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);

let client: SupabaseClient | null = null;

/** Browser Supabase client, or null when the site was built without Supabase config. */
export function supabase(): SupabaseClient | null {
  if (!authConfigured || typeof window === 'undefined') return null;
  client ??= createClient(SUPABASE_URL!, SUPABASE_KEY!, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'pkce' },
  });
  return client;
}

type Listener = (user: User | null) => void;
const listeners = new Set<Listener>();
let currentUser: User | null = null;
let started = false;

/** Subscribe to the signed-in user. Fires immediately with the current value once known. */
export function onUser(fn: Listener): () => void {
  listeners.add(fn);
  start().then(() => fn(currentUser));
  return () => listeners.delete(fn);
}

export function getUser(): User | null {
  return currentUser;
}

async function start() {
  if (started) return;
  started = true;
  const sb = supabase();
  if (!sb) return;
  const { data } = await sb.auth.getSession();
  currentUser = data.session?.user ?? null;
  sb.auth.onAuthStateChange((_event, session) => {
    currentUser = session?.user ?? null;
    listeners.forEach((l) => l(currentUser));
  });
}

/** Where OAuth / magic-link / email-confirm flows return to. */
export function redirectTo(): string {
  return new URL(import.meta.env.BASE_URL + 'auth/callback/', window.location.origin).toString();
}

export function displayName(user: User): string {
  const m = user.user_metadata ?? {};
  return m.full_name || m.name || user.email?.split('@')[0] || 'Traveler';
}

export function avatarUrl(user: User): string | null {
  const m = user.user_metadata ?? {};
  return m.avatar_url || m.picture || null;
}
