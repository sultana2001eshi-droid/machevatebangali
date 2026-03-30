import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useItems, dbItemToFoodItem } from '@/hooks/useItems';
import { ArrowLeft, X } from 'lucide-react';
import Navbar from '@/components/Navbar';

const CATEGORIES = [
  { key: 'all', bn: 'সব', en: 'All' },
  { key: 'rice-type', bn: 'চাল', en: 'Rice' },
  { key: 'rice-dish', bn: 'ভাত', en: 'Dishes' },
  { key: 'fish', bn: 'মাছ', en: 'Fish' },
];

const GalleryPage = () => {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const { data: dbItems, isLoading } = useItems();
  const [filter, setFilter] = useState('all');
  const [lightbox, setLightbox] = useState<any>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const items = useMemo(() => {
    if (!dbItems) return [];
    let all = dbItems.filter(i => i.image_url).map(dbItemToFoodItem);
    if (filter !== 'all') all = all.filter(i => i.category === filter);
    return all;
  }, [dbItems, filter]);

  const openLightbox = (item: any, index: number) => {
    setLightbox(item);
    setLightboxIndex(index);
  };

  const navLightbox = (dir: number) => {
    const next = (lightboxIndex + dir + items.length) % items.length;
    setLightbox(items[next]);
    setLightboxIndex(next);
  };

  return (
    <div className="min-h-screen bg-background noise-bg">
      <Navbar onSearch={() => {}} />

      <section className="pt-28 pb-8 md:pt-32 md:pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-sm font-accent text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('হোমে ফিরুন', 'Back to Home')}
          </button>

          <div className="text-center mb-10">
            <p className="font-accent text-[10px] tracking-[0.3em] uppercase gold-accent mb-2">
              {t('সম্পূর্ণ সংগ্রহ', 'Full Collection')}
            </p>
            <h1 className="section-heading text-3xl md:text-5xl">
              {t('ছবির গ্যালারি', 'Image Gallery')}
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              {t(`মোট ${items.length}টি ছবি`, `${items.length} photos`)}
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex justify-center gap-2 mb-10 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => setFilter(cat.key)}
                className={`px-5 py-2 rounded-full text-sm font-accent transition-all duration-300 border
                  ${filter === cat.key
                    ? 'bg-primary text-primary-foreground border-primary shadow-md'
                    : 'bg-card border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
                  }`}
              >
                {t(cat.bn, cat.en)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {items.map((item, i) => (
                <div
                  key={item.id}
                  className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${Math.min(i * 50, 400)}ms`, animationFillMode: 'both' }}
                  onClick={() => openLightbox(item, i)}
                >
                  <img
                    src={item.image}
                    alt={lang === 'bn' ? item.name : item.nameEn}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                    <p className="font-heading text-white text-sm drop-shadow-md">
                      {lang === 'bn' ? item.name : item.nameEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-4xl mb-3">📷</p>
              <p className="text-muted-foreground font-heading">{t('কোনো ছবি নেই', 'No photos found')}</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center animate-fade-in" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center z-10" onClick={() => setLightbox(null)}>
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Nav arrows */}
          <button className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xl z-10" onClick={e => { e.stopPropagation(); navLightbox(-1); }}>‹</button>
          <button className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xl z-10" onClick={e => { e.stopPropagation(); navLightbox(1); }}>›</button>

          <div className="max-w-3xl max-h-[85vh] w-full mx-4 animate-scale-in" onClick={e => e.stopPropagation()}>
            <img src={lightbox.image} alt={lang === 'bn' ? lightbox.name : lightbox.nameEn} className="w-full h-auto max-h-[75vh] object-contain rounded-xl" />
            <div className="text-center mt-4">
              <h3 className="font-heading text-white text-lg">{lang === 'bn' ? lightbox.name : lightbox.nameEn}</h3>
              <p className="text-xs text-white/50 font-accent mt-1">{lightboxIndex + 1} / {items.length}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
