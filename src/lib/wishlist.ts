import { getUser, onUser, supabase } from './supabase';
import { openAuth } from './auth-modal';

const DEFAULT_LIST = 'Favorites';
let saved = new Set<string>();
let listId: string | null = null;
const subs = new Set<(s: Set<string>) => void>();
const emit = () => subs.forEach((f) => f(saved));

/** Subscribe to the set of saved place ids for the signed-in user. */
export function onSaved(fn: (s: Set<string>) => void) {
  subs.add(fn);
  fn(saved);
  return () => subs.delete(fn);
}

async function ensureList(): Promise<string | null> {
  const sb = supabase();
  if (!sb || !getUser()) return null;
  if (listId) return listId;
  const { data } = await sb.from('wishlists').select('id').eq('name', DEFAULT_LIST).maybeSingle();
  if (data) return (listId = data.id);
  const { data: created, error } = await sb.from('wishlists').insert({ name: DEFAULT_LIST }).select('id').single();
  if (error) throw error;
  return (listId = created.id);
}

async function refresh() {
  const sb = supabase();
  if (!sb || !getUser()) { saved = new Set(); listId = null; return emit(); }
  const { data } = await sb.from('wishlist_items').select('place_id, wishlists!inner(user_id)');
  saved = new Set((data ?? []).map((r) => r.place_id as string));
  emit();
}

let started = false;
function start() {
  if (started) return;
  started = true;
  onUser(() => { listId = null; refresh(); });
}

/** Toggle a place in the user's Favorites. Prompts sign-in when signed out. */
export async function toggleSave(placeId: string, placeName: string): Promise<boolean | null> {
  if (!getUser()) {
    openAuth('login', `Log in to save ${placeName} to your wishlist.`);
    return null;
  }
  const sb = supabase()!;
  const id = await ensureList();
  if (!id) return null;
  const was = saved.has(placeId);
  was ? saved.delete(placeId) : saved.add(placeId); // optimistic
  emit();
  const { error } = was
    ? await sb.from('wishlist_items').delete().eq('wishlist_id', id).eq('place_id', placeId)
    : await sb.from('wishlist_items').insert({ wishlist_id: id, place_id: placeId });
  if (error) { was ? saved.add(placeId) : saved.delete(placeId); emit(); throw error; }
  return !was;
}

/** Wire every [data-save] heart on the page. */
export function wireHearts(root: ParentNode = document) {
  start();
  const hearts = () => root.querySelectorAll<HTMLButtonElement>('[data-save]');
  hearts().forEach((b) => {
    if (b.dataset.wired) return;
    b.dataset.wired = '1';
    b.addEventListener('click', async (e) => {
      e.preventDefault(); e.stopPropagation();
      b.classList.add('pop');
      setTimeout(() => b.classList.remove('pop'), 300);
      try { await toggleSave(b.dataset.save!, b.dataset.name ?? 'this place'); } catch (err) { console.error(err); }
    });
  });
  onSaved((s) => hearts().forEach((b) => {
    const on = s.has(b.dataset.save!);
    b.setAttribute('aria-pressed', String(on));
    b.setAttribute('aria-label', `${on ? 'Remove' : 'Save'} ${b.dataset.name ?? ''}`.trim());
  }));
}
