import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';

/** A 1200px JPEG for og:image / JSON-LD, instead of linking the full-size original (often 500 KB+). */
export async function ogImage(src: ImageMetadata | undefined): Promise<string | undefined> {
  if (!src) return undefined;
  return (await getImage({ src, width: Math.min(1200, src.width), format: 'jpg', quality: 78 })).src;
}
