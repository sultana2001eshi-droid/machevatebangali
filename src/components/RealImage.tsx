import { useState } from 'react';
import { useWikimediaImage } from '@/hooks/useWikimediaImage';
import { ImageIcon } from 'lucide-react';

// AI-generated photorealistic fallback images for every item
import hilsaFallback from '@/assets/fallback/hilsa-fish.jpg';
import rohuFallback from '@/assets/fallback/rohu-fish.jpg';
import catlaFallback from '@/assets/fallback/catla-fish.jpg';
import pabdaFallback from '@/assets/fallback/pabda-fish.jpg';
import boalFallback from '@/assets/fallback/boal-fish.jpg';
import prawnFallback from '@/assets/fallback/prawn.jpg';
import tengraFallback from '@/assets/fallback/tengra-fish.jpg';
import shingFallback from '@/assets/fallback/shing-fish.jpg';
import magurFallback from '@/assets/fallback/magur-fish.jpg';
import pangasiusFallback from '@/assets/fallback/pangasius-fish.jpg';
import koiFallback from '@/assets/fallback/koi-fish.jpg';
import snakeheadFallback from '@/assets/fallback/snakehead-fish.jpg';
import ayreFallback from '@/assets/fallback/ayre-fish.jpg';
import tilapiaFallback from '@/assets/fallback/tilapia-fish.jpg';
import pomfretFallback from '@/assets/fallback/pomfret-fish.jpg';
import putiFallback from '@/assets/fallback/puti-fish.jpg';
import miniketFallback from '@/assets/fallback/miniket-rice.jpg';
import parboiledFallback from '@/assets/fallback/parboiled-rice.jpg';
import coarseFallback from '@/assets/fallback/coarse-rice.jpg';
import redRiceCookedFallback from '@/assets/fallback/red-rice-cooked.jpg';
import basmatCookedFallback from '@/assets/fallback/basmati-cooked.jpg';
import biryaniDishFallback from '@/assets/fallback/biryani.jpg';
import polaoFallback from '@/assets/fallback/polao.jpg';
import khichuriFallback from '@/assets/fallback/khichuri.jpg';

// Complete fallback mapping: nameEn → local image (covers ALL items)
const LOCAL_FALLBACKS: Record<string, string> = {
  // Fish
  'Hilsa': hilsaFallback,
  'Rohu': rohuFallback,
  'Catla': catlaFallback,
  'Pabda': pabdaFallback,
  'Boal': boalFallback,
  'Prawn': prawnFallback,
  'Tengra': tengraFallback,
  'Shing': shingFallback,
  'Magur': magurFallback,
  'Pangasius': pangasiusFallback,
  'Koi': koiFallback,
  'Snakehead': snakeheadFallback,
  'Ayre': ayreFallback,
  'Tilapia': tilapiaFallback,
  'Pomfret': pomfretFallback,
  'Puti': putiFallback,
  // Rice types
  'Miniket Rice': miniketFallback,
  'Nazirshail Rice': miniketFallback,
  'Kalijira Rice': miniketFallback,
  'Chinigura Rice': miniketFallback,
  'Kataribhog Rice': miniketFallback,
  'Atop Rice': miniketFallback,
  'Basmati Rice': basmatCookedFallback,
  'Parboiled Rice': parboiledFallback,
  'Coarse Rice': coarseFallback,
  'Red Rice': miniketFallback,
  // Rice dishes
  'White Rice': miniketFallback,
  'Polao': polaoFallback,
  'Khichuri': khichuriFallback,
  'Biryani': biryaniDishFallback,
  'Fried Rice': polaoFallback,
  'Payesh': miniketFallback,
  'Panta Bhat': miniketFallback,
};

// Category-specific fallbacks for items not in the map
const CATEGORY_FALLBACKS: Record<string, string> = {
  'fish': hilsaFallback,
  'rice-type': miniketFallback,
  'rice-dish': polaoFallback,
};

function getLocalFallback(nameEn: string, category: string): string {
  // Always return a fallback — never allow empty
  return LOCAL_FALLBACKS[nameEn] || CATEGORY_FALLBACKS[category] || miniketFallback;
}

interface RealImageProps {
  nameEn: string;
  category: string;
  alt: string;
  className?: string;
  localFallback?: string;
}

const RealImage = ({ nameEn, category, alt, className = '', localFallback }: RealImageProps) => {
  const resolvedFallback = localFallback || getLocalFallback(nameEn, category);
  const { src, loading } = useWikimediaImage(nameEn, category, resolvedFallback);
  const [error, setError] = useState(false);

  if (loading) {
    return (
      <div className={`flex items-center justify-center bg-muted/50 animate-pulse ${className}`}>
        <ImageIcon className="w-10 h-10 text-muted-foreground/30" />
      </div>
    );
  }

  // If Wikimedia image loaded but errored, or no src — use local fallback (NEVER emoji)
  const displaySrc = (!src || error) ? resolvedFallback : src;

  return (
    <img
      src={displaySrc}
      alt={alt}
      loading="lazy"
      onError={() => {
        if (!error) {
          setError(true);
        }
      }}
      className={`object-cover ${className}`}
    />
  );
};

export default RealImage;
