import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { MapPin } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import RealImage from '@/components/RealImage';
import type { FoodItem } from '@/data/content';

interface FoodCardProps {
  item: FoodItem;
  index: number;
}

const FoodCard = ({ item, index }: FoodCardProps) => {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>(0.1);

  const name = lang === 'bn' ? item.name : item.nameEn;
  const desc = lang === 'bn' ? item.description : item.descriptionEn;
  const sub = lang === 'bn' ? item.subCategory : item.subCategoryEn;
  const nutrition = lang === 'bn' ? item.nutrition : item.nutritionEn;
  const cooking = lang === 'bn' ? item.cookingMethod : item.cookingMethodEn;
  const region = lang === 'bn' ? item.region : item.regionEn;

  return (
    <div
      ref={ref}
      className={`glass-card cursor-pointer group transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${index * 0.06}s` }}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <RealImage
          nameEn={item.nameEn}
          category={item.category}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {/* Category badge */}
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-accent font-medium backdrop-blur-xl border shadow-sm"
          style={{
            background: 'hsl(var(--card) / 0.75)',
            borderColor: 'hsl(var(--border) / 0.5)',
            color: 'hsl(var(--foreground))',
          }}
        >
          {sub}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 md:p-5">
        <h3 className="font-heading text-base md:text-lg font-bold text-foreground mb-1.5 group-hover:text-primary transition-colors duration-300 leading-tight">
          {name}
        </h3>

        {region && (
          <div className="flex items-center gap-1 mb-2 text-[10px] sm:text-xs text-muted-foreground">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="font-body truncate">{region}</span>
          </div>
        )}

        <p className={`font-body text-xs sm:text-sm text-muted-foreground leading-relaxed ${expanded ? '' : 'line-clamp-2 sm:line-clamp-3'}`}>
          {desc}
        </p>

        {expanded && (
          <div className="mt-4 space-y-3 animate-fade-in">
            {nutrition && (
              <div className="p-3 rounded-xl border border-border/40" style={{ background: 'hsl(var(--secondary) / 0.5)' }}>
                <p className="text-[10px] font-accent font-semibold gold-accent mb-1 uppercase tracking-wider">
                  {t('পুষ্টিগুণ', 'Nutrition')}
                </p>
                <p className="text-xs sm:text-sm font-body text-secondary-foreground">{nutrition}</p>
              </div>
            )}
            {cooking && (
              <div className="p-3 rounded-xl border border-border/40" style={{ background: 'hsl(var(--secondary) / 0.5)' }}>
                <p className="text-[10px] font-accent font-semibold gold-accent mb-1 uppercase tracking-wider">
                  {t('রান্নার পদ্ধতি', 'Cooking Method')}
                </p>
                <p className="text-xs sm:text-sm font-body text-secondary-foreground">{cooking}</p>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-3">
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/item/${item.id}`); }}
            className="text-xs sm:text-sm font-accent font-semibold gold-accent hover:underline transition-all inline-flex items-center gap-1"
          >
            {t('বিস্তারিত দেখুন →', 'Read More →')}
          </button>
          {expanded && (
            <button
              onClick={(e) => { e.stopPropagation(); setExpanded(false); }}
              className="text-xs font-accent text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('সংক্ষেপ', 'Less')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
