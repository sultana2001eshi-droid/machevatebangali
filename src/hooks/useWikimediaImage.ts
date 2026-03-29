import { useState, useEffect } from 'react';

// In-memory cache shared across all components
const imageCache = new Map<string, string>();
const pendingRequests = new Map<string, Promise<string | null>>();
const failedItems = new Set<string>();

// Direct name-to-Wikimedia-filename mappings — keys match exact nameEn from content.ts
const KNOWN_IMAGES: Record<string, string> = {
  // ===== Fish (exact nameEn from content.ts) =====
  'Hilsa': 'Tenualosa_ilisha.jpg',
  'Rohu': 'Labeo_rohita.jpg',
  'Catla': 'Catla_catla.jpg',
  'Pabda': 'Ompok_pabda.jpg',
  'Boal': 'Wallago_attu.jpg',
  'Prawn': 'Penaeus_monodon.jpg',
  'Tengra': 'Mystus_tengara.jpg',
  'Shing': 'Heteropneustes_fossilis.jpg',
  'Magur': 'Clarias_batrachus.jpg',
  'Pangasius': 'Pangasius_hypophthalmus.jpg',
  'Koi': 'Anabas_testudineus.jpg',
  'Snakehead': 'Channa_striata.jpg',
  'Ayre': 'Sperata_aor.jpg',
  'Tilapia': 'Oreochromis-niloticus-Nairobi.jpg',
  'Pomfret': 'Pampus_argenteus.jpg',
  'Puti': 'Puntius_sophore.jpg',

  // Fish with "Fish" suffix (legacy/fallback)
  'Hilsa Fish': 'Tenualosa_ilisha.jpg',
  'Rohu Fish': 'Labeo_rohita.jpg',
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
  'Mrigel Fish': 'Cirrhinus_cirrhosus.jpg',
  'Bata Fish': 'Labeo_bata.jpg',
  'Taki Fish': 'Channa_punctata.jpg',
  'Silver Carp': 'Hypophthalmichthys_molitrix.jpg',
  'Grass Carp': 'Ctenopharyngodon_idella.jpg',

  // ===== Rice Types (each UNIQUE — no duplicates) =====
  'Miniket Rice': 'Bowl_of_rice_(1).jpg',
  'Nazirshail Rice': 'Oryza_sativa_-_Köhler–s_Medizinal-Pflanzen-232.jpg',
  'Kalijira Rice': 'Kalijira_rice.jpg',
  'Chinigura Rice': 'Gobindobhog_Rice.jpg',
  'Kataribhog Rice': 'Kataribhog_rice.jpg',
  'Red Rice': 'Red_rice.jpg',
  'Parboiled Rice': 'Parboiled_rice.jpg',
  'Coarse Rice': 'US_long_grain_rice.jpg',
  'Atop Rice': 'Sona_Masuri_Rice.jpg',
  'Basmati Rice': 'Basmati_Rice.jpg',

  // ===== Rice Dishes (each UNIQUE) =====
  'White Rice': 'Cooked_white_rice_in_a_bowl.jpg',
  'Polao': 'Pulao.jpg',
  'Khichuri': 'Khichdi_(1).jpg',
  'Biryani': 'Chicken_Biryani.jpg',
  'Fried Rice': 'Nasi_goreng_in_Jakarta.jpg',
  'Payesh': 'Kheer.jpg',
  'Panta Bhat': 'Panta_Ilish.jpg',
};

// Reject images that are likely diagrams/maps/infographics/people
const REJECT_PATTERNS = /flag|map|diagram|chart|logo|icon|symbol|stamp|coat.of.arms|emblem|portrait|person|people|human|face|selfie|crowd|group.photo|illustration|drawing|cartoon|sketch|clipart|infographic|taxonomy|phylogeny|distribution|range|anatomy|lifecycle/i;

// Additional reject: file extensions that are likely SVG diagrams
const REJECT_EXTENSIONS = /\.svg$/i;

function getKnownImageUrl(nameEn: string): string | null {
  const filename = KNOWN_IMAGES[nameEn];
  if (!filename) return null;
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=600`;
}

function buildSearchQuery(nameEn: string, category: string): string {
  const base = nameEn.trim();
  switch (category) {
    case 'fish':
      return `${base} fish freshwater Bangladesh`;
    case 'rice-type':
      return `${base} rice grains close up`;
    case 'rice-dish':
      return `${base} cooked food plate Bengali`;
    default:
      return `${base} food`;
  }
}

// Category-specific title validation
function isRelevantForCategory(title: string, category: string): boolean {
  const t = title.toLowerCase();
  
  // Universal rejections
  if (REJECT_PATTERNS.test(t)) return false;
  if (REJECT_EXTENSIONS.test(t)) return false;
  
  // Category-specific positive signals
  switch (category) {
    case 'fish':
      // Reject if it's clearly about geography, people, culture (not the fish itself)
      if (/village|market|festival|ceremony|boat|river.scene|landscape|fisherman|fishing.net/i.test(t)) return false;
      return true;
    case 'rice-type':
      if (/field|paddy.field|harvest|farmer|agriculture|terrace/i.test(t)) return false;
      return true;
    case 'rice-dish':
      return true;
    default:
      return true;
  }
}

async function fetchWikimediaImages(query: string, category: string): Promise<string | null> {
  try {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=8&prop=imageinfo&iiprop=url|mime|extmetadata&iiurlwidth=600&format=json&origin=*`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const pages = data?.query?.pages;
    if (!pages) return null;

    // Score and rank candidates
    const candidates: { url: string; score: number }[] = [];

    for (const page of Object.values(pages) as any[]) {
      const info = page?.imageinfo?.[0];
      if (!info) continue;
      if (!info.mime || (!info.mime.startsWith('image/jpeg') && !info.mime.startsWith('image/png'))) continue;

      const title = page.title || '';
      
      // Apply strict validation
      if (!isRelevantForCategory(title, category)) {
        console.log(`[ImageFetch] REJECTED: "${title}" for category ${category}`);
        continue;
      }

      // Score the image based on relevance signals
      let score = 0;
      const tLower = title.toLowerCase();
      
      // Higher score for photos (jpg typically = photo)
      if (info.mime === 'image/jpeg') score += 2;
      
      // Higher score if title contains food-related terms
      if (/fish|mach|matsya/i.test(tLower) && category === 'fish') score += 3;
      if (/rice|chawal|chal|grain/i.test(tLower) && (category === 'rice-type' || category === 'rice-dish')) score += 3;
      if (/food|dish|curry|cooked|plate|bowl/i.test(tLower)) score += 2;
      
      // Penalize generic/scientific images
      if (/specimen|museum|herbarium|dried|preserved/i.test(tLower)) score -= 2;

      const imageUrl = info.thumburl || info.url;
      if (imageUrl) {
        candidates.push({ url: imageUrl, score });
      }
    }

    // Sort by score descending, pick best
    candidates.sort((a, b) => b.score - a.score);
    
    if (candidates.length > 0) {
      console.log(`[ImageFetch] Selected: score=${candidates[0].score} from ${candidates.length} candidates`);
      return candidates[0].url;
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
    console.log(`[ImageFetch] Resolving: "${nameEn}" (${category})`);
    
    // 1. Known direct mapping (most reliable)
    const known = getKnownImageUrl(nameEn);
    if (known) {
      console.log(`[ImageFetch] ✅ Known mapping for "${nameEn}"`);
      imageCache.set(cacheKey, known);
      return known;
    }

    // 2. Search Wikimedia with category-specific query
    const query = buildSearchQuery(nameEn, category);
    console.log(`[ImageFetch] Searching: "${query}"`);
    const url = await fetchWikimediaImages(query, category);
    if (url) {
      console.log(`[ImageFetch] ✅ Found via search for "${nameEn}"`);
      imageCache.set(cacheKey, url);
      return url;
    }

    // 3. Simpler fallback query
    const fallbackQuery = category === 'fish' ? `${nameEn} fish` : `${nameEn} food`;
    const fallback = await fetchWikimediaImages(fallbackQuery, category);
    if (fallback) {
      console.log(`[ImageFetch] ✅ Found via fallback for "${nameEn}"`);
      imageCache.set(cacheKey, fallback);
      return fallback;
    }

    console.log(`[ImageFetch] ❌ No valid image for "${nameEn}"`);
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
