import { useState } from 'react';
import { useWikimediaImage } from '@/hooks/useWikimediaImage';
import { ImageIcon } from 'lucide-react';

// Local AI-generated fallback images for items that may not have Wikimedia coverage
import parboiledRiceFallback from '@/assets/fallback/parboiled-rice.jpg';
import coarseRiceFallback from '@/assets/fallback/coarse-rice.jpg';
import redRiceCookedFallback from '@/assets/fallback/red-rice-cooked.jpg';
import basmatCookedFallback from '@/assets/fallback/basmati-cooked.jpg';

const LOCAL_FALLBACKS: Record<string, string> = {
  'Parboiled Rice': parboiledRiceFallback,
  'Coarse Rice': coarseRiceFallback,
  'Red Rice:rice-dish': redRiceCookedFallback,
  'Basmati Rice:rice-dish': basmatCookedFallback,
};

function getLocalFallback(nameEn: string, category: string): string | undefined {
  // Check category-specific key first
  return LOCAL_FALLBACKS[`${nameEn}:${category}`] || LOCAL_FALLBACKS[nameEn];
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

  if (!src || error) {
    // Final fallback: show resolved local fallback or a styled gradient placeholder
    if (resolvedFallback && !error) {
      return (
        <img
          src={resolvedFallback}
          alt={alt}
          loading="lazy"
          className={className}
        />
      );
    }
    
    // Absolute last resort: styled gradient with category emoji (should rarely happen)
    const emoji = category === 'fish' ? '🐟' : category === 'rice-type' ? '🌾' : '🍚';
    return (
      <div className={`flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-accent/20 ${className}`}>
        <span className="text-4xl mb-1 opacity-60">{emoji}</span>
        <span className="text-[10px] text-muted-foreground/60 font-body px-2 text-center leading-tight">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setError(true)}
      className={`object-cover ${className}`}
    />
  );
};

export default RealImage;
