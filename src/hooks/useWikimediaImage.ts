import { useState, useEffect } from 'react';

// In-memory cache shared across all components
const imageCache = new Map<string, string>();
const pendingRequests = new Map<string, Promise<string | null>>();
const failedItems = new Set<string>();

// Direct name-to-Wikimedia-filename mappings for accuracy
const KNOWN_IMAGES: Record<string, string> = {
  'Hilsa Fish': 'Tenualosa_ilisha.jpg',
  'Ilish': 'Tenualosa_ilisha.jpg',
  'Rohu Fish': 'Labeo_rohita.jpg',
  'Rohu': 'Labeo_rohita.jpg',
  'Katla Fish': 'Catla_catla.jpg',
  'Catla Fish': 'Catla_catla.jpg',
  'Pangasius Fish': 'Pangasius_hypophthalmus.jpg',
  'Tilapia Fish': 'Oreochromis-niloticus-Nairobi.jpg',
  'Shrimp': 'Penaeus_monodon.jpg',
  'Prawn Curry': 'Chingri_Malai_Curry.jpg',
  'Koi Fish': 'Anabas_testudineus.jpg',
  'Climbing Perch': 'Anabas_testudineus.jpg',
  'Pomfret Fish': 'Pampus_argenteus.jpg',
  'Pabda Fish': 'Ompok_pabda.jpg',
  'Boal Fish': 'Wallago_attu.jpg',
  'Shing Fish': 'Heteropneustes_fossilis.jpg',
  'Magur Fish': 'Clarias_batrachus.jpg',
  'Catfish': 'Clarias_batrachus.jpg',
  'Shoal Fish': 'Channa_striata.jpg',
  'Snakehead Fish': 'Channa_striata.jpg',
  'Ayre Fish': 'Sperata_aor.jpg',
  'Tengra Fish': 'Mystus_tengara.jpg',
  'Puti Fish': 'Puntius_sophore.jpg',
  'Barb Fish': 'Puntius_sophore.jpg',
  'Basmati Rice': 'Basmati_Rice.jpg',
  'Miniket Rice': 'Oryza_sativa_-_Köhler–s_Medizinal-Pflanzen-232.jpg',
  'Kalijira Rice': 'Kalijira_rice.jpg',
  'Chinigura Rice': 'Kalijira_rice.jpg',
  'Khichuri': 'Khichdi_(1).jpg',
  'Biryani Rice': 'Chicken_Biryani.jpg',
  'Biryani': 'Chicken_Biryani.jpg',
  'Polao Rice': 'Pulao.jpg',
  'Polao': 'Pulao.jpg',
  'White Rice': 'Cooked_white_rice_in_a_bowl.jpg',
  'Red Rice': 'Red_rice.jpg',
  'Atop Rice': 'Oryza_sativa_Rice.jpg',
  'Kataribhog Rice': 'Kataribhog_rice.jpg',
  'Nazirshail Rice': 'Oryza_sativa_Rice.jpg',
  'Mrigel Fish': 'Cirrhinus_cirrhosus.jpg',
  'Bata Fish': 'Labeo_bata.jpg',
  'Taki Fish': 'Channa_punctata.jpg',
  'Silver Carp': 'Hypophthalmichthys_molitrix.jpg',
  'Grass Carp': 'Ctenopharyngodon_idella.jpg',
  'Fried Rice': 'Nasi_goreng_in_Jakarta.jpg',
  'Payesh': 'Kheer.jpg',
  'Panta Bhat': 'Panta_Ilish.jpg',
};

// Reject images that are likely diagrams/maps/infographics
const REJECT_PATTERNS = /flag|map|diagram|chart|logo|icon|symbol|stamp|coat.of.arms|emblem/i;

function getKnownImageUrl(nameEn: string): string | null {
  const filename = KNOWN_IMAGES[nameEn];
  if (!filename) return null;
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=600`;
}

function buildSearchQuery(nameEn: string, category: string): string {
  const base = nameEn.trim();
  switch (category) {
    case 'fish':
      return `${base} fish realistic`;
    case 'rice-type':
      return `${base} rice grain`;
    case 'rice-dish':
      return `${base} cooked food dish`;
    default:
      return base;
  }
}

async function fetchWikimediaImage(query: string): Promise<string | null> {
  try {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url|mime|extmetadata&iiurlwidth=600&format=json&origin=*`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const pages = data?.query?.pages;
    if (!pages) return null;

    for (const page of Object.values(pages) as any[]) {
      const info = page?.imageinfo?.[0];
      if (!info) continue;
      if (!info.mime || (!info.mime.startsWith('image/jpeg') && !info.mime.startsWith('image/png'))) continue;

      // Reject by title
      const title = page.title || '';
      if (REJECT_PATTERNS.test(title)) continue;

      return info.thumburl || info.url;
    }
    return null;
  } catch {
    return null;
  }
}

async function resolveImage(nameEn: string, category: string): Promise<string | null> {
  const cacheKey = `${category}:${nameEn}`;

  if (imageCache.has(cacheKey)) return imageCache.get(cacheKey)!;
  if (failedItems.has(cacheKey)) return null;
  if (pendingRequests.has(cacheKey)) return pendingRequests.get(cacheKey)!;

  const promise = (async () => {
    // 1. Known direct mapping
    const known = getKnownImageUrl(nameEn);
    if (known) {
      imageCache.set(cacheKey, known);
      return known;
    }

    // 2. Search Wikimedia with category-specific query
    const query = buildSearchQuery(nameEn, category);
    const url = await fetchWikimediaImage(query);
    if (url) {
      imageCache.set(cacheKey, url);
      return url;
    }

    // 3. Simpler fallback query
    const fallback = await fetchWikimediaImage(nameEn);
    if (fallback) {
      imageCache.set(cacheKey, fallback);
      return fallback;
    }

    failedItems.add(cacheKey);
    return null;
  })();

  pendingRequests.set(cacheKey, promise);
  const result = await promise;
  pendingRequests.delete(cacheKey);
  return result;
}

export function useWikimediaImage(nameEn: string, category: string, localFallback?: string) {
  const cacheKey = `${category}:${nameEn}`;
  const [src, setSrc] = useState<string>(imageCache.get(cacheKey) || '');
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
      } else if (localFallback) {
        setSrc(localFallback);
      }
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, [nameEn, category, cacheKey, localFallback]);

  return { src, loading };
}
