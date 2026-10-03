// Browser-only: the list + map split used by the ski and outdoors explorers.
// Pins and popups are plain HTML; cards and pins highlight each other on hover.
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export interface MapRow {
  id: string;
  coords: [number, number];
  /** Pin label (already HTML-escaped by the caller via `esc`). */
  pin: string;
  major?: boolean;
  popup: () => string;
}

export const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

/** Keep only the values some chip in `root` offers for `data-<attr>`, so stale or mistyped links don't empty the list. */
export function offeredOnly<T extends string>(root: HTMLElement, attr: string, values: T[]): T[] {
  const ok = new Set([...root.querySelectorAll<HTMLElement>(`[data-${attr}]`)].map((b) => b.getAttribute(`data-${attr}`)));
  return values.filter((v) => ok.has(v));
}

const isDark = () => document.documentElement.dataset.theme === 'dark'
  || (!document.documentElement.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches);

/** Wire the map inside `root` ([data-map], [data-split], [data-map-toggle], [data-map-fab], [data-fab-label]). */
export function setupListMap(root: HTMLElement, rows: MapRow[], cards: Map<string, HTMLElement>) {
  const split = root.querySelector<HTMLElement>('[data-split]')!;
  const map = L.map(root.querySelector<HTMLElement>('[data-map]')!, { zoomControl: true, scrollWheelZoom: true });
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19, className: isDark() ? 'tiles-dark' : 'tiles',
  }).addTo(map);

  const icon = (r: MapRow, label = r.pin) => L.divIcon({ className: '', html: `<div class="map-pin${r.major ? ' major' : ''}" data-pin="${esc(r.id)}">${label}</div>`, iconSize: [0, 0] });
  const markers = new Map<string, L.Marker>();
  rows.forEach((r) => {
    const m = L.marker(r.coords, { icon: icon(r), riseOnHover: true, zIndexOffset: r.major ? 100 : 0 });
    m.bindPopup(() => r.popup(), { offset: [0, -8], maxWidth: 260 });
    markers.set(r.id, m.addTo(map));
  });
  const fit = () => (rows.length
    ? map.fitBounds(L.latLngBounds(rows.map((r) => r.coords)), { padding: [40, 40], maxZoom: 10 })
    : map.setView([45, -100], 3));
  fit();

  const pin = (id: string) => root.querySelector<HTMLElement>(`[data-pin="${CSS.escape(id)}"]`);
  cards.forEach((card, id) => {
    card.addEventListener('mouseenter', () => { pin(id)?.classList.add('active'); markers.get(id)?.setZIndexOffset(1000); });
    card.addEventListener('mouseleave', () => { pin(id)?.classList.remove('active'); markers.get(id)?.setZIndexOffset(0); });
  });
  markers.forEach((m, id) => {
    m.on('mouseover', () => cards.get(id)?.classList.add('hl'));
    m.on('mouseout', () => cards.get(id)?.classList.remove('hl'));
  });

  const deskBtn = root.querySelector<HTMLButtonElement>('[data-map-toggle]');
  deskBtn?.addEventListener('click', () => {
    const hide = !split.classList.contains('no-map');
    split.classList.toggle('no-map', hide);
    deskBtn.querySelector('span')!.textContent = hide ? 'Show map' : 'Hide map';
    deskBtn.setAttribute('aria-pressed', String(!hide));
    setTimeout(() => map.invalidateSize(), 50);
  });
  const fab = root.querySelector<HTMLButtonElement>('[data-map-fab]');
  fab?.addEventListener('click', () => {
    const on = split.classList.toggle('show-map-mobile');
    root.querySelector('[data-fab-label]')!.textContent = on ? 'List' : 'Map';
    fab.classList.remove('off');
    root.scrollIntoView({ block: 'start' });
    setTimeout(() => { map.invalidateSize(); fit(); }, 50);
  });
  // On pages where the explorer sits below other content, show the button only while the list is on screen.
  if (fab && 'IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => {
      fab.classList.toggle('off', !e.isIntersecting && !split.classList.contains('show-map-mobile'));
    }, { rootMargin: '0px 0px -40% 0px' }).observe(split);
  }

  return {
    map,
    /** Show only these ids on the map. */
    show(ids: Set<string>) { markers.forEach((m, id) => (ids.has(id) ? m.addTo(map) : m.remove())); },
    /** Replace a pin's label (e.g. once live data arrives). */
    relabel(r: MapRow, label: string) { markers.get(r.id)?.setIcon(icon(r, label)); },
  };
}
