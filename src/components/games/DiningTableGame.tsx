import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useItems, dbItemToFoodItem } from '@/hooks/useItems';
import type { FoodItem } from '@/data/content';
import { X } from 'lucide-react';

const steamAnimation = `
@keyframes steam {
  0% { opacity: 0; transform: translateY(0) scaleX(1); }
  50% { opacity: 0.6; transform: translateY(-12px) scaleX(1.2); }
  100% { opacity: 0; transform: translateY(-28px) scaleX(0.8); }
}
`;

const DiningTableGame = () => {
  const { t } = useLanguage();
  const { data: dbItems } = useItems();
  const [selectedDish, setSelectedDish] = useState<FoodItem | null>(null);

  const riceDishes = (dbItems || []).map(dbItemToFoodItem).filter(i => i.category === 'rice-dish');

  if (riceDishes.length === 0) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-b from-accent/5 to-earth/5 p-6">
      <style>{steamAnimation}</style>

      <h3 className="font-heading text-xl font-bold text-foreground mb-2 flex items-center gap-2">
        <span className="text-2xl">🍽️</span> {t('ভাত বেছে নিন', 'Pick Your Rice Dish')}
      </h3>
      <p className="text-sm text-muted-foreground mb-6 font-body">
        {t('পছন্দের পদে ট্যাপ করুন!', 'Tap on your favorite dish!')}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {riceDishes.map((dish) => (
          <button
            key={dish.id}
            onClick={() => setSelectedDish(dish)}
            className={`group relative glass-card p-4 flex flex-col items-center gap-2 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-gold/15 focus:outline-none ${
              selectedDish?.id === dish.id ? '-translate-y-2 shadow-xl shadow-gold/20 ring-2 ring-gold/40' : ''
            }`}
          >
            <div className="relative">
              <span className="text-4xl block">🍚</span>
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex gap-0.5">
                {[0, 1, 2].map(i => (
                  <span
                    key={i}
                    className="block w-1 h-3 rounded-full bg-muted-foreground/20"
                    style={{ animation: `steam 2s ease-in-out infinite`, animationDelay: `${i * 0.4}s` }}
                  />
                ))}
              </div>
            </div>
            <span className="font-heading text-xs sm:text-sm font-semibold text-foreground text-center leading-tight">
              {t(dish.name, dish.nameEn)}
            </span>
            <span className="text-[10px] text-muted-foreground font-body">
              {t(dish.subCategory, dish.subCategoryEn)}
            </span>
          </button>
        ))}
      </div>

      {selectedDish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setSelectedDish(null)}>
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
          <div className="glass-card relative z-10 max-w-sm w-full p-5 border border-gold/30 shadow-2xl animate-scale-in" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedDish(null)} className="absolute top-3 right-3 p-1 rounded-lg hover:bg-secondary transition-colors">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">🍚</span>
              <div>
                <h4 className="font-heading text-lg font-bold text-foreground">{t(selectedDish.name, selectedDish.nameEn)}</h4>
                <span className="text-xs text-gold font-accent">{t(selectedDish.subCategory, selectedDish.subCategoryEn)}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground font-body leading-relaxed mb-4 line-clamp-3">
              {t(selectedDish.description, selectedDish.descriptionEn)}
            </p>
            <a
              href="#explore"
              onClick={() => setSelectedDish(null)}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              {t('রান্না ও বিস্তারিত →', 'Cooking & Details →')}
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiningTableGame;
