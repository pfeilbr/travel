import type { ImageMetadata } from 'astro';

export interface PlaceImage {
  src: ImageMetadata;
  alt: string;
  author: string;
  license: string;
  licenseUrl?: string;
  sourceUrl: string;
  nearby?: boolean;
}

interface Meta { file: string; title: string; alt: string; author: string; license: string; licenseUrl?: string; sourceUrl: string; nearby?: boolean }

// Both globs tolerate missing files: no photos yet -> empty lists and gradient placeholders.
const files = import.meta.glob<{ default: ImageMetadata }>('/src/assets/places/*/*.{jpg,jpeg,png,webp}', { eager: true });
const metaModules = import.meta.glob<{ default: Record<string, Meta[]> }>('/src/data/images.json', { eager: true });
const meta: Record<string, Meta[]> = Object.values(metaModules)[0]?.default ?? {};

export function imagesFor(id: string): PlaceImage[] {
  return (meta[id] ?? []).flatMap((m) => {
    const mod = files['/' + m.file.replace(/^\//, '')];
    return mod ? [{ src: mod.default, alt: m.alt, author: m.author, license: m.license, licenseUrl: m.licenseUrl, sourceUrl: m.sourceUrl, nearby: m.nearby }] : [];
  });
}

export function allCredits(): { id: string; images: PlaceImage[] }[] {
  return Object.keys(meta).sort().map((id) => ({ id, images: imagesFor(id) }));
}
