import { useLanguage } from '@/contexts/LanguageContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useItems, dbItemToFoodItem } from '@/hooks/useItems';
import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, X, ZoomIn } from 'lucide-react';

const FEATURED_COUNT = 4;
const SWAP_INTERVAL = 18000;
const STAGGER_DELAY = 400;

const ImageGallery = () => {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const { ref, isVisible } = useScrollReveal<HTMLElement>(0.1);
  const { data: dbItems } = useItems();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [lightboxItem, setLightboxItem] = useState<any>(null);
  const [setIndex, setSetIndex] = useState(0);
  const [exitingSlots, setExitingSlots] = useState<Set<number>>(new Set());
  const [enteringSlots, setEnteringSlots] = useState<Set<number>>(new Set());
  const prevSetRef = useRef<string[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  // All items with images, shuffled once
  const allGalleryItems = useMemo(() => {
    if (!dbItems) return [];
    const items = dbItems
      .filter(item => item.image_url)
      .map(dbItemToFoodItem);
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  }, [dbItems]);

  const totalSets = Math.max(1, Math.ceil(allGalleryItems.length / FEATURED_COUNT));

  const currentItems = useMemo(() => {
    const start = (setIndex % totalSets) * FEATURED_COUNT;
    const slice = allGalleryItems.slice(start, start + FEATURED_COUNT);
    if (slice.length < FEATURED_COUNT && allGalleryItems.length >= FEATURED_COUNT) {
      return [...slice, ...allGalleryItems.slice(0, FEATURED_COUNT - slice.length)];
    }
    return slice;
  }, [allGalleryItems, setIndex, totalSets]);

  // Staggered rotation
  const rotateImages = useCallback(() => {
    if (allGalleryItems.length <= FEATURED_COUNT) return;
    
    // Stagger exit: one slot at a time
    const slots = [0, 1, 2, 3];
    slots.forEach((slot, i) => {
      setTimeout(() => {
        setExitingSlots(prev => new Set([...prev, slot]));
      }, i * STAGGER_DELAY);
    });

    // After all exits, swap set and stagger enter
    setTimeout(() => {
      setSetIndex(p => p + 1);
      setExitingSlots(new Set());
      slots.forEach((slot, i) => {
        setTimeout(() => {
          setEnteringSlots(prev => new Set([...prev, slot]));
          setTimeout(() => {
            setEnteringSlots(prev => {
              const n = new Set(prev);
              n.delete(slot);
              return n;
            });
          }, 500);
        }, i * STAGGER_DELAY);
      });
    }, slots.length * STAGGER_DELAY + 300);
  }, [allGalleryItems.length]);

  useEffect(() => {
    if (allGalleryItems.length <= FEATURED_COUNT) return;
    intervalRef.current = setInterval(rotateImages, SWAP_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [rotateImages, allGalleryItems.length]);

  // Close lightbox on escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxItem(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  if (allGalleryItems.length === 0) return null;

  const getSlotAnimation = (index: number) => {
    if (exitingSlots.has(index)) {
      return 'opacity-0 scale-95 blur-sm';
    }
    if (enteringSlots.has(index)) {
      return 'opacity-0 scale-105';
    }
    return 'opacity-100 scale-100 blur-0';
  };

  return (
    <>
      <section id="gallery" className="py-20 md:py-28 relative" ref={ref}>
        {/* Subtle background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/30 to-transparent pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          {/* Header */}
          <div className={`text-center mb-14 md:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="font-accent text-[10px] md:text-xs tracking-[0.3em] uppercase gold-accent mb-3">
              {t('কিউরেটেড গ্যালারি', 'Curated Gallery')}
            </p>
            <h2 className="section-heading text-3xl md:text-5xl lg:text-6xl tracking-tight">
              {t('ছবির গ্যালারি', 'Image Gallery')}
            </h2>
            <p className="section-subheading mt-3 max-w-md mx-auto text-sm md:text-base">
              {t('বাংলার খাবারের অপরূপ সৌন্দর্য', 'The exquisite beauty of Bengali cuisine')}
            </p>
          </div>

          {/* Bento Grid */}
          <div className={`flex flex-col gap-3 md:gap-5 max-w-4xl mx-auto transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            {(() => {
              const items = currentItems.slice(0, FEATURED_COUNT);
              const hero = items[0];
              const rest = items.slice(1);
              const restIsOdd = rest.length % 2 === 1;
              const pairedItems = restIsOdd ? rest.slice(0, -1) : rest;
              const lastItem = restIsOdd ? rest[rest.length - 1] : null;

              const renderCard = (item: any, i: number, isWide: boolean) => (
                <div
                  key={`${item.id}-${setIndex}`}
                  className={`
                    relative overflow-hidden cursor-pointer group rounded-3xl
                    transition-all duration-700 ease-out
                    ${getSlotAnimation(i)}
                    ${isWide ? 'aspect-[16/9] md:aspect-[2/1]' : 'aspect-square'}
                  `}
                  style={{
                    transitionDelay: `${i * 80}ms`,
                    boxShadow: '0 8px 32px -8px hsl(var(--foreground) / 0.06)',
                  }}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => setLightboxItem(item)}
                >
                  <img
                    src={item.image}
                    alt={lang === 'bn' ? item.name : item.nameEn}
                    loading={i < 2 ? 'eager' : 'lazy'}
                    className={`w-full h-full object-cover transition-transform duration-1000 ease-out ${hoveredId === item.id ? 'scale-110' : 'scale-100'}`}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent transition-opacity duration-500 ${hoveredId === item.id ? 'opacity-100' : 'opacity-60'}`} />
                  <div className={`absolute bottom-0 left-0 right-0 p-4 md:p-6 transition-all duration-500 ${hoveredId === item.id ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-70'}`}>
                    <h3 className={`font-heading text-white drop-shadow-md ${isWide ? 'text-base md:text-xl' : 'text-sm md:text-base'}`}>
                      {lang === 'bn' ? item.name : item.nameEn}
                    </h3>
                    {item.subCategory && (
                      <p className="text-[10px] md:text-xs font-accent text-white/70 mt-1">
                        {lang === 'bn' ? item.subCategory : item.subCategoryEn}
                      </p>
                    )}
                  </div>
                  <div className={`absolute top-3 right-3 md:top-4 md:right-4 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-400 ${hoveredId === item.id ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
                    <ZoomIn className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <div className={`absolute inset-0 rounded-3xl border transition-all duration-500 pointer-events-none ${hoveredId === item.id ? 'border-gold/30' : 'border-white/5'}`} />
                </div>
              );

              return (
                <>
                  {/* Hero - always full width */}
                  {hero && renderCard(hero, 0, true)}

                  {/* Paired rows - 2 per row */}
                  {Array.from({ length: Math.ceil(pairedItems.length / 2) }).map((_, rowIdx) => (
                    <div key={rowIdx} className="grid grid-cols-2 gap-3 md:gap-5">
                      {renderCard(pairedItems[rowIdx * 2], rowIdx * 2 + 1, false)}
                      {pairedItems[rowIdx * 2 + 1] && renderCard(pairedItems[rowIdx * 2 + 1], rowIdx * 2 + 2, false)}
                    </div>
                  ))}

                  {/* Orphan last card → full-width featured */}
                  {lastItem && renderCard(lastItem, rest.length, true)}
                </>
              );
            })()}
          </div>

          {/* CTA */}
          {allGalleryItems.length > FEATURED_COUNT && (
            <div className={`text-center mt-10 md:mt-14 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <button
                onClick={() => navigate('/gallery')}
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-heading text-sm md:text-base
                  bg-gradient-to-r from-primary/10 to-accent/40 hover:from-primary/20 hover:to-accent/60
                  border border-border/50 hover:border-gold/30
                  text-foreground hover:text-foreground
                  transition-all duration-500 hover:shadow-lg hover:shadow-primary/5"
              >
                {t('আরো ছবি দেখুন', 'View All Photos')}
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              <p className="text-[11px] font-accent text-muted-foreground mt-3">
                {t(`মোট ${allGalleryItems.length}টি ছবি`, `${allGalleryItems.length} photos total`)}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in"
          onClick={() => setLightboxItem(null)}
        >
          <button
            className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
            onClick={() => setLightboxItem(null)}
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <div className="max-w-3xl max-h-[85vh] w-full mx-4 animate-scale-in" onClick={e => e.stopPropagation()}>
            <img
              src={lightboxItem.image}
              alt={lang === 'bn' ? lightboxItem.name : lightboxItem.nameEn}
              className="w-full h-auto max-h-[75vh] object-contain rounded-2xl"
            />
            <div className="text-center mt-4">
              <h3 className="font-heading text-white text-lg md:text-xl">
                {lang === 'bn' ? lightboxItem.name : lightboxItem.nameEn}
              </h3>
              {lightboxItem.subCategory && (
                <p className="text-sm font-accent text-white/60 mt-1">
                  {lang === 'bn' ? lightboxItem.subCategory : lightboxItem.subCategoryEn}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;
