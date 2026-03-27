import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { FoodItem } from '@/data/content';

// Image imports
import whiteRice from '@/assets/white-rice.jpg';
import polao from '@/assets/polao.jpg';
import khichuri from '@/assets/khichuri.jpg';
import biryani from '@/assets/biryani.jpg';
import ilish from '@/assets/ilish.jpg';
import rui from '@/assets/rui.jpg';
import katla from '@/assets/katla.jpg';
import pabda from '@/assets/pabda.jpg';
import boal from '@/assets/boal.jpg';
import chingri from '@/assets/chingri.jpg';

const imageMap: Record<string, string> = {
  'white-rice': whiteRice,
  polao, khichuri, biryani, ilish, rui, katla, pabda, boal, chingri,
};

interface FoodCardProps {
  item: FoodItem;
  index: number;
}

const FoodCard = ({ item, index }: FoodCardProps) => {
  const { lang, t } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  const name = lang === 'bn' ? item.name : item.nameEn;
  const desc = lang === 'bn' ? item.description : item.descriptionEn;
  const sub = lang === 'bn' ? item.subCategory : item.subCategoryEn;
  const nutrition = lang === 'bn' ? item.nutrition : item.nutritionEn;
  const cooking = lang === 'bn' ? item.cookingMethod : item.cookingMethodEn;

  return (
    <div
      className="food-card cursor-pointer"
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={imageMap[item.image]}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-accent font-medium bg-card/90 text-foreground backdrop-blur-sm border border-border">
          {sub}
        </span>
      </div>

      <div className="p-5">
        <h3 className="font-heading text-xl font-bold text-foreground mb-2">{name}</h3>
        <p className={`font-body text-sm text-muted-foreground leading-relaxed ${expanded ? '' : 'line-clamp-3'}`}>
          {desc}
        </p>

        {expanded && (
          <div className="mt-4 space-y-3 animate-fade-in">
            {nutrition && (
              <div className="p-3 rounded-lg bg-secondary">
                <p className="text-xs font-accent font-semibold text-accent-foreground mb-1 gold-accent">
                  {t('পুষ্টিগুণ', 'Nutrition')}
                </p>
                <p className="text-sm font-body text-secondary-foreground">{nutrition}</p>
              </div>
            )}
            {cooking && (
              <div className="p-3 rounded-lg bg-secondary">
                <p className="text-xs font-accent font-semibold text-accent-foreground mb-1 gold-accent">
                  {t('রান্নার পদ্ধতি', 'Cooking Method')}
                </p>
                <p className="text-sm font-body text-secondary-foreground">{cooking}</p>
              </div>
            )}
          </div>
        )}

        <button className="mt-3 text-sm font-accent font-medium gold-accent hover:underline">
          {expanded ? t('সংক্ষেপ করুন', 'Show Less') : t('বিস্তারিত দেখুন', 'Read More')}
        </button>
      </div>
    </div>
  );
};

export default FoodCard;
