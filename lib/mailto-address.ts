/** Extract display address from a mailto URL (query stripped). */
export function mailtoDisplayAddress(url: string): string | null {
  if (!url.toLowerCase().startsWith("mailto:")) return null;
  const raw = url.slice("mailto:".length).split("?")[0];
  try {
    return decodeURIComponent(raw) || null;
  } catch {
    return raw || null;
  }
}
