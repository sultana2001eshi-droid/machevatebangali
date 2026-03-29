import { useState, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useItems, dbItemToFoodItem } from '@/hooks/useItems';
import type { FoodItem } from '@/data/content';
import { X } from 'lucide-react';

const RiceRunnerGame = () => {
  const { t } = useLanguage();
  const { data: dbItems } = useItems();
  const [selectedRice, setSelectedRice] = useState<FoodItem | null>(null);
  const [paused, setPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const riceTypes = (dbItems || []).map(dbItemToFoodItem).filter(i => i.category === 'rice-type');

  const handleSelect = (rice: FoodItem) => {
    setSelectedRice(rice);
    setPaused(true);
  };

  const handleClose = () => {
    setSelectedRice(null);
    setPaused(false);
  };

  if (riceTypes.length === 0) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-b from-primary/5 to-accent/5 p-6 min-h-[320px]">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--gold)/0.3),transparent_70%)]" />
      </div>

      <h3 className="font-heading text-xl font-bold text-foreground mb-2 flex items-center gap-2 relative z-10">
        <span className="text-2xl">🌾</span> {t('চাল ধরুন', 'Catch the Rice')}
      </h3>
      <p className="text-sm text-muted-foreground mb-4 relative z-10 font-body">
        {t('ভেসে যাওয়া চালে ট্যাপ করুন এবং জানুন!', 'Tap on floating rice to learn more!')}
      </p>

      <div ref={containerRef} className="relative h-[220px] overflow-hidden">
        {riceTypes.map((rice, i) => (
          <button
            key={rice.id}
            onClick={() => handleSelect(rice)}
            className="absolute group cursor-pointer focus:outline-none"
            style={{
              animation: paused ? 'none' : `floatRice ${8 + i * 1.5}s linear infinite`,
              animationDelay: `${i * -2.5}s`,
              top: `${15 + (i % 4) * 45}px`,
            }}
          >
            <div className="glass-card px-4 py-2.5 flex items-center gap-2 hover:scale-110 transition-transform duration-300 hover:shadow-lg hover:shadow-gold/20 whitespace-nowrap">
              <span className="text-xl">🍚</span>
              <span className="font-heading text-sm font-semibold text-foreground">
                {t(rice.name, rice.nameEn)}
              </span>
            </div>
          </button>
        ))}
      </div>

      {selectedRice && (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={handleClose} />
          <div className="glass-card relative z-10 max-w-sm w-full p-5 border border-gold/30 shadow-xl animate-scale-in">
            <button onClick={handleClose} className="absolute top-3 right-3 p-1 rounded-lg hover:bg-secondary transition-colors">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">🌾</span>
              <div>
                <h4 className="font-heading text-lg font-bold text-foreground">{t(selectedRice.name, selectedRice.nameEn)}</h4>
                {selectedRice.region && (
                  <span className="text-xs text-muted-foreground font-body">{t(selectedRice.region, selectedRice.regionEn || '')}</span>
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground font-body leading-relaxed mb-4 line-clamp-3">
              {t(selectedRice.description, selectedRice.descriptionEn)}
            </p>
            <a
              href="#explore"
              onClick={handleClose}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              {t('বিস্তারিত দেখুন →', 'View Details →')}
            </a>
          </div>
        </div>
      )}

      <style>{`
        @keyframes floatRice {
          0% { transform: translateX(calc(100vw + 50px)); }
          100% { transform: translateX(-300px); }
        }
      `}</style>
    </div>
  );
};

export default RiceRunnerGame;
