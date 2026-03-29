import { useState } from 'react';
import { useWikimediaImage } from '@/hooks/useWikimediaImage';
import { ImageIcon } from 'lucide-react';

interface RealImageProps {
  nameEn: string;
  category: string;
  alt: string;
  className?: string;
  localFallback?: string;
}

// SVG placeholder with food icon for fallback
const CategoryPlaceholder = ({ category, alt, className }: { category: string; alt: string; className: string }) => {
  const emoji = category === 'fish' ? '🐟' : category === 'rice-type' ? '🌾' : '🍚';
  return (
    <div className={`flex flex-col items-center justify-center bg-muted/30 ${className}`}>
      <span className="text-3xl mb-1">{emoji}</span>
      <span className="text-[10px] text-muted-foreground/50 font-body px-2 text-center leading-tight">{alt}</span>
    </div>
  );
};

const RealImage = ({ nameEn, category, alt, className = '', localFallback }: RealImageProps) => {
  const { src, loading } = useWikimediaImage(nameEn, category, localFallback);
  const [error, setError] = useState(false);

  if (loading) {
    return (
      <div className={`flex items-center justify-center bg-muted/50 animate-pulse ${className}`}>
        <ImageIcon className="w-10 h-10 text-muted-foreground/30" />
      </div>
    );
  }

  if (!src || error) {
    return <CategoryPlaceholder category={category} alt={alt} className={className} />;
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setError(true)}
      className={className}
    />
  );
};

export default RealImage;
