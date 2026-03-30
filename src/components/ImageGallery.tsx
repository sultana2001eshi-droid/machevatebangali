import { useLanguage } from '@/contexts/LanguageContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useItems, dbItemToFoodItem } from '@/hooks/useItems';
import { useMemo, useState, useEffect, useCallback, useRef } from 'react';

const VISIBLE_COUNT = 8;
const SWAP_INTERVAL = 20000;

const ImageGallery = () => {
  const { lang, t } = useLanguage();
  const { ref, isVisible } = useScrollReveal<HTMLElement>(0.1);
  const { data: dbItems } = useItems();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  // All items with images, shuffled once
  const allGalleryItems = useMemo(() => {
    if (!dbItems) return [];
    const items = dbItems
      .filter(item => item.image_url)
      .map(dbItemToFoodItem);
    // Shuffle
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  }, [dbItems]);

  const totalPages = Math.max(1, Math.ceil(allGalleryItems.length / VISIBLE_COUNT));

  const currentItems = useMemo(() => {
    const start = (page % totalPages) * VISIBLE_COUNT;
    const slice = allGalleryItems.slice(start, start + VISIBLE_COUNT);
    // If we don't have enough, wrap around
    if (slice.length < VISIBLE_COUNT && allGalleryItems.length >= VISIBLE_COUNT) {
      return [...slice, ...allGalleryItems.slice(0, VISIBLE_COUNT - slice.length)];
    }
    return slice;
  }, [allGalleryItems, page, totalPages]);

  const nextPage = useCallback(() => {
    if (allGalleryItems.length <= VISIBLE_COUNT) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setPage(p => p + 1);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 600);
  }, [allGalleryItems.length]);

  // Auto-swap
  useEffect(() => {
    if (allGalleryItems.length <= VISIBLE_COUNT) return;
    intervalRef.current = setInterval(nextPage, SWAP_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [nextPage, allGalleryItems.length]);

  if (allGalleryItems.length === 0) return null;

  // Masonry spans
  const getSpanClass = (i: number) => {
    const pattern = [
      'col-span-1 row-span-1',
      'col-span-1 row-span-2',
      'col-span-1 row-span-1',
      'col-span-1 row-span-1',
      'col-span-1 row-span-2',
      'col-span-1 row-span-1',
      'col-span-1 row-span-1',
      'col-span-1 row-span-1',
    ];
    return pattern[i % pattern.length];
  };

  return (
    <section id="gallery" className="py-20 md:py-24 relative" ref={ref}>
      <div className="container mx-auto px-4 md:px-6">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="font-accent text-xs tracking-[0.2em] uppercase gold-accent mb-3">
            {t('গ্যালারি', 'Gallery')}
          </p>
          <h2 className="section-heading text-3xl md:text-5xl">{t('🖼️ ছবির গ্যালারি', '🖼️ Image Gallery')}</h2>
          <p className="section-subheading mt-3">{t('বাংলার খাবারের সৌন্দর্য', 'The beauty of Bengali cuisine')}</p>
        </div>

        <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[160px] md:auto-rows-[200px] gap-3 md:gap-4 transition-all duration-600 ${isTransitioning ? 'opacity-0 scale-[0.97] blur-sm' : 'opacity-100 scale-100 blur-0'}`}>
          {currentItems.map((item, i) => (
            <div
              key={`${item.id}-${page}`}
              className={`${getSpanClass(i)} group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
              style={{
                transitionDelay: `${i * 0.05}s`,
                boxShadow: '0 4px 20px -4px hsl(var(--foreground) / 0.08)',
              }}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <img
                src={item.image}
                alt={lang === 'bn' ? item.name : item.nameEn}
                loading="lazy"
                className={`w-full h-full object-cover transition-transform duration-700 ${hoveredId === item.id ? 'scale-110' : 'scale-100'}`}
              />
              <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-4 transition-opacity duration-300 ${hoveredId === item.id ? 'opacity-100' : 'opacity-0'}`}>
                <div>
                  <span className="font-heading text-sm md:text-base font-bold text-white drop-shadow-lg">
                    {lang === 'bn' ? item.name : item.nameEn}
                  </span>
                  {item.subCategory && (
                    <p className="text-[10px] font-accent text-white/70 mt-0.5">{lang === 'bn' ? item.subCategory : item.subCategoryEn}</p>
                  )}
                </div>
              </div>
              <div className={`absolute inset-0 rounded-2xl border-2 transition-all duration-500 pointer-events-none ${hoveredId === item.id ? 'border-gold/40 shadow-lg' : 'border-transparent'}`}
                style={hoveredId === item.id ? { boxShadow: '0 0 20px hsl(43, 72%, 55% / 0.15)' } : {}}
              />
            </div>
          ))}
        </div>

        {/* Page indicators */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: Math.min(totalPages, 6) }).map((_, i) => (
              <button
                key={i}
                onClick={() => { setIsTransitioning(true); setTimeout(() => { setPage(i); setTimeout(() => setIsTransitioning(false), 50); }, 600); }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${(page % totalPages) === i ? 'bg-gold w-6' : 'bg-border hover:bg-muted-foreground/40'}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ImageGallery;
