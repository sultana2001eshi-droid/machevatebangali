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
    return (
      <div className={`flex flex-col items-center justify-center bg-muted/30 ${className}`}>
        <ImageIcon className="w-10 h-10 text-muted-foreground/30 mb-1" />
        <span className="text-[10px] text-muted-foreground/40 font-body">{alt}</span>
      </div>
    );
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
