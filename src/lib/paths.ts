/** Prefix an app path with the deploy base ("/travel/"). `url("places/x/")` -> "/travel/places/x/". */
export function url(path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
  return base + path.replace(/^\//, '');
}
