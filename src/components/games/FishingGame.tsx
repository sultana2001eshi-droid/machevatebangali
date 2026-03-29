import { useState, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useItems, dbItemToFoodItem } from '@/hooks/useItems';
import type { FoodItem } from '@/data/content';
import { X } from 'lucide-react';

const FishingGame = () => {
  const { t } = useLanguage();
  const { data: dbItems } = useItems();
  const [hookDropped, setHookDropped] = useState(false);
  const [caughtFish, setCaughtFish] = useState<FoodItem | null>(null);
  const [catchCount, setCatchCount] = useState(0);
  const [ripple, setRipple] = useState(false);

  const fishItems = (dbItems || []).map(dbItemToFoodItem).filter(i => i.category === 'fish');

  const handleCast = useCallback(() => {
    if (hookDropped || caughtFish || fishItems.length === 0) return;
    setHookDropped(true);
    setRipple(true);

    setTimeout(() => {
      const randomFish = fishItems[Math.floor(Math.random() * fishItems.length)];
      setCaughtFish(randomFish);
      setCatchCount(c => c + 1);
      setHookDropped(false);
      setTimeout(() => setRipple(false), 600);
    }, 1500);
  }, [hookDropped, caughtFish, fishItems]);

  if (fishItems.length === 0) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/50 min-h-[360px]">
      <div className="absolute inset-0 h-1/2" style={{ background: 'linear-gradient(to bottom, hsl(var(--primary) / 0.08), transparent)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-[55%]" style={{ background: 'linear-gradient(to bottom, hsl(var(--primary) / 0.15), hsl(var(--primary) / 0.3))' }}>
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-primary/20 to-transparent" 
             style={{ animation: 'waveMove 3s ease-in-out infinite' }} />
      </div>

      {ripple && (
        <div className="absolute left-1/2 top-[45%] -translate-x-1/2 z-10">
          <div className="w-16 h-4 rounded-full border-2 border-primary/30 animate-ping" />
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 h-[55%] overflow-hidden">
        {fishItems.slice(0, 6).map((fish, i) => (
          <div
            key={fish.id}
            className="absolute text-2xl"
            style={{
              animation: `swimFish ${6 + i * 1.2}s linear infinite`,
              animationDelay: `${i * -1.8}s`,
              top: `${15 + (i % 3) * 30}%`,
              transform: 'scaleX(-1)',
            }}
          >
            🐟
          </div>
        ))}
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 top-4 z-10 flex flex-col items-center">
        <div className="w-0.5 bg-muted-foreground/40" style={{
          height: hookDropped ? '160px' : '60px',
          transition: 'height 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        }} />
        <span className="text-xl" style={{
          transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: hookDropped ? 'rotate(15deg)' : 'rotate(0)',
        }}>🪝</span>
      </div>

      <div className="relative z-10 p-6">
        <h3 className="font-heading text-xl font-bold text-foreground mb-2 flex items-center gap-2">
          <span className="text-2xl">🎣</span> {t('মাছ ধরুন', 'Catch a Fish')}
        </h3>
        <p className="text-sm text-muted-foreground mb-2 font-body">
          {t('পানিতে ট্যাপ করে মাছ ধরুন!', 'Tap the water to catch fish!')}
        </p>
        {catchCount > 0 && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
            🏆 {t(`${catchCount}টি মাছ ধরা হয়েছে`, `${catchCount} fish caught`)}
          </span>
        )}
      </div>

      {!caughtFish && (
        <button
          onClick={handleCast}
          disabled={hookDropped}
          className="absolute bottom-0 left-0 right-0 h-[55%] z-10 cursor-pointer focus:outline-none"
          aria-label={t('মাছ ধরুন', 'Cast hook')}
        />
      )}

      {caughtFish && (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm" onClick={() => setCaughtFish(null)} />
          <div className="glass-card relative z-10 max-w-sm w-full p-5 border border-gold/30 shadow-2xl animate-scale-in">
            <button onClick={() => setCaughtFish(null)} className="absolute top-3 right-3 p-1 rounded-lg hover:bg-secondary transition-colors">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
            <div className="text-center mb-3">
              <span className="text-4xl block mb-1">🐟</span>
              <p className="text-xs text-gold font-accent">{t('মাছ ধরা পড়েছে!', 'Fish Caught!')}</p>
            </div>
            <h4 className="font-heading text-lg font-bold text-foreground text-center mb-1">{t(caughtFish.name, caughtFish.nameEn)}</h4>
            <p className="text-xs text-muted-foreground text-center mb-3 font-accent">
              {t(caughtFish.subCategory, caughtFish.subCategoryEn)}
            </p>
            <p className="text-sm text-muted-foreground font-body leading-relaxed mb-4 line-clamp-3 text-center">
              {t(caughtFish.description, caughtFish.descriptionEn)}
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setCaughtFish(null)}
                className="px-3 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors"
              >
                {t('আবার ধরুন 🎣', 'Try Again 🎣')}
              </button>
              <a
                href="#explore"
                onClick={() => setCaughtFish(null)}
                className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                {t('বিস্তারিত →', 'Details →')}
              </a>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes swimFish {
          0% { left: -40px; }
          100% { left: calc(100% + 40px); }
        }
        @keyframes waveMove {
          0%, 100% { transform: translateX(-10px); }
          50% { transform: translateX(10px); }
        }
      `}</style>
    </div>
  );
};

export default FishingGame;
