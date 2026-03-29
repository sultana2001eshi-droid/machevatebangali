import { useLanguage } from '@/contexts/LanguageContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useItems, dbItemToFoodItem } from '@/hooks/useItems';
import { useMemo, useState } from 'react';

const ImageGallery = () => {
  const { lang, t } = useLanguage();
  const { ref, isVisible } = useScrollReveal<HTMLElement>(0.1);
  const { data: dbItems } = useItems();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Collect all items with images + shuffle
  const galleryItems = useMemo(() => {
    if (!dbItems) return [];
    const items = dbItems
      .filter(item => item.image_url)
      .map(dbItemToFoodItem);
    // Seeded shuffle for consistent render
    return items.sort(() => 0.5 - Math.random()).slice(0, 16);
  }, [dbItems]);

  if (galleryItems.length === 0) return null;

  // Masonry-style row spans
  const getSpanClass = (i: number) => {
    const pattern = [
      'col-span-1 row-span-1',
      'col-span-1 row-span-2',
      'col-span-1 row-span-1',
      'col-span-1 row-span-1',
      'col-span-1 row-span-2',
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[160px] md:auto-rows-[200px] gap-3 md:gap-4">
          {galleryItems.map((item, i) => (
            <div
              key={item.id}
              className={`${getSpanClass(i)} group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
              style={{ transitionDelay: `${i * 0.05}s` }}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <img
                src={item.image}
                alt={lang === 'bn' ? item.name : item.nameEn}
                loading="lazy"
                className={`w-full h-full object-cover transition-transform duration-700 ${hoveredId === item.id ? 'scale-110' : 'scale-100'}`}
              />
              {/* Hover overlay */}
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
              {/* Subtle border glow on hover */}
              <div className={`absolute inset-0 rounded-2xl border-2 transition-all duration-500 pointer-events-none ${hoveredId === item.id ? 'border-gold/40 shadow-lg' : 'border-transparent'}`}
                style={hoveredId === item.id ? { boxShadow: '0 0 20px hsl(43, 72%, 55% / 0.15)' } : {}}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImageGallery;
