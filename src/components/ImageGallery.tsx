import { useLanguage } from '@/contexts/LanguageContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useItems, dbItemToFoodItem } from '@/hooks/useItems';
import { useMemo } from 'react';

const ImageGallery = () => {
  const { lang, t } = useLanguage();
  const { ref, isVisible } = useScrollReveal<HTMLElement>(0.1);
  const { data: dbItems } = useItems();

  const galleryItems = useMemo(() => {
    if (!dbItems) return [];
    return dbItems
      .filter(item => item.image_url)
      .map(dbItemToFoodItem)
      .slice(0, 12);
  }, [dbItems]);

  if (galleryItems.length === 0) return null;

  return (
    <section id="gallery" className="py-20 md:py-24 bg-secondary/30" ref={ref}>
      <div className="container mx-auto px-4 md:px-6">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="font-accent text-xs tracking-[0.2em] uppercase gold-accent mb-3">
            {t('গ্যালারি', 'Gallery')}
          </p>
          <h2 className="section-heading text-3xl md:text-5xl">{t('🖼️ ছবির গ্যালারি', '🖼️ Image Gallery')}</h2>
          <p className="section-subheading mt-3">{t('বাংলার খাবারের সৌন্দর্য', 'The beauty of Bengali cuisine')}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {galleryItems.map((item, i) => (
            <div
              key={item.id}
              className={`group relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${i * 0.05}s` }}
            >
              <img
                src={item.image}
                alt={lang === 'bn' ? item.name : item.nameEn}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="font-heading text-lg font-bold" style={{ color: 'hsl(40, 33%, 96%)' }}>
                  {lang === 'bn' ? item.name : item.nameEn}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImageGallery;
