import { useState } from 'react';
import { useWikimediaImage } from '@/hooks/useWikimediaImage';
import { ImageIcon } from 'lucide-react';

// Unique AI-generated fallback images for EVERY item
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
// Rice types — each unique
import miniketFallback from '@/assets/fallback/miniket-rice.jpg';
import nazirshailFallback from '@/assets/fallback/nazirshail-rice.jpg';
import kalijiraFallback from '@/assets/fallback/kalijira-rice.jpg';
import chiniguraFallback from '@/assets/fallback/chinigura-rice.jpg';
import kataribhogFallback from '@/assets/fallback/kataribhog-rice.jpg';
import atopFallback from '@/assets/fallback/atop-rice.jpg';
import parboiledFallback from '@/assets/fallback/parboiled-rice.jpg';
import coarseFallback from '@/assets/fallback/coarse-rice.jpg';
import redRiceFallback from '@/assets/fallback/red-rice-cooked.jpg';
import basmatiFallback from '@/assets/fallback/basmati-cooked.jpg';
// Rice dishes — each unique
import whiteRiceFallback from '@/assets/fallback/white-rice.jpg';
import polaoFallback from '@/assets/fallback/polao.jpg';
import khichuriFallback from '@/assets/fallback/khichuri.jpg';
import biryaniDishFallback from '@/assets/fallback/biryani.jpg';
import friedRiceFallback from '@/assets/fallback/fried-rice.jpg';
import payeshFallback from '@/assets/fallback/payesh.jpg';
import pantaBhatFallback from '@/assets/fallback/panta-bhat.jpg';

// Complete 1:1 mapping — every nameEn gets its OWN unique image
const LOCAL_FALLBACKS: Record<string, string> = {
  // Fish (16 unique)
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
  // Rice types (10 unique — NO duplicates)
  'Miniket Rice': miniketFallback,
  'Nazirshail Rice': nazirshailFallback,
  'Kalijira Rice': kalijiraFallback,
  'Chinigura Rice': chiniguraFallback,
  'Kataribhog Rice': kataribhogFallback,
  'Atop Rice': atopFallback,
  'Basmati Rice': basmatiFallback,
  'Parboiled Rice': parboiledFallback,
  'Coarse Rice': coarseFallback,
  'Red Rice': redRiceFallback,
  // Rice dishes (7 unique — NO duplicates)
  'White Rice': whiteRiceFallback,
  'Polao': polaoFallback,
  'Khichuri': khichuriFallback,
  'Biryani': biryaniDishFallback,
  'Fried Rice': friedRiceFallback,
  'Payesh': payeshFallback,
  'Panta Bhat': pantaBhatFallback,
};

// Category fallbacks (last resort)
const CATEGORY_FALLBACKS: Record<string, string> = {
  'fish': hilsaFallback,
  'rice-type': miniketFallback,
  'rice-dish': polaoFallback,
};

function getLocalFallback(nameEn: string, category: string): string {
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

  // If Wikimedia errored or no src → always use local fallback (NEVER empty)
  const displaySrc = (!src || error) ? resolvedFallback : src;

  return (
    <img
      src={displaySrc}
      alt={alt}
      loading="lazy"
      onError={() => {
        if (!error) setError(true);
      }}
      className={`object-cover ${className}`}
    />
  );
};

export default RealImage;
