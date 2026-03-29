import { useState, useEffect } from 'react';

// In-memory cache shared across all components
const imageCache = new Map<string, string>();
const pendingRequests = new Map<string, Promise<string | null>>();

function buildSearchQuery(nameEn: string, category: string): string {
  const base = nameEn.trim();
  switch (category) {
    case 'fish':
      return `${base} fish Bangladesh`;
    case 'rice-type':
      return `${base} grain`;
    case 'rice-dish':
      return `${base} Bengali dish`;
    default:
      return base;
  }
}

async function fetchWikimediaImage(query: string): Promise<string | null> {
  try {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=3&prop=imageinfo&iiprop=url|mime&format=json&origin=*`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const pages = data?.query?.pages;
    if (!pages) return null;

    // Find the first valid image (jpg/png, not svg/pdf)
    for (const page of Object.values(pages) as any[]) {
      const info = page?.imageinfo?.[0];
      if (info?.url && info.mime && (info.mime.startsWith('image/jpeg') || info.mime.startsWith('image/png'))) {
        return info.url;
      }
    }
    return null;
  } catch {
    return null;
  }
}

async function resolveImage(nameEn: string, category: string): Promise<string | null> {
  const cacheKey = `${category}:${nameEn}`;

  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey)!;
  }

  // Deduplicate concurrent requests for the same item
  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey)!;
  }

  const promise = (async () => {
    const query = buildSearchQuery(nameEn, category);
    const url = await fetchWikimediaImage(query);
    if (url) {
      imageCache.set(cacheKey, url);
      return url;
    }

    // Simpler fallback query
    const fallback = await fetchWikimediaImage(nameEn);
    if (fallback) {
      imageCache.set(cacheKey, fallback);
      return fallback;
    }

    return null;
  })();

  pendingRequests.set(cacheKey, promise);
  const result = await promise;
  pendingRequests.delete(cacheKey);
  return result;
}

export function useWikimediaImage(nameEn: string, category: string, localFallback?: string) {
  const cacheKey = `${category}:${nameEn}`;
  const [src, setSrc] = useState<string>(imageCache.get(cacheKey) || localFallback || '');
  const [loading, setLoading] = useState(!imageCache.has(cacheKey));

  useEffect(() => {
    if (imageCache.has(cacheKey)) {
      setSrc(imageCache.get(cacheKey)!);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    resolveImage(nameEn, category).then((url) => {
      if (cancelled) return;
      if (url) {
        setSrc(url);
      }
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, [nameEn, category, cacheKey]);

  return { src, loading };
}
