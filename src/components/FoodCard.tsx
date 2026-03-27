import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { MapPin } from 'lucide-react';
import type { FoodItem } from '@/data/content';

// Image imports — rice types
import miniketRice from '@/assets/miniket-rice.jpg';
import nazirshailRice from '@/assets/nazirshail-rice.jpg';
import kalijiraRice from '@/assets/kalijira-rice.jpg';
import chiniguraRice from '@/assets/chinigura-rice.jpg';
import kataribhogRice from '@/assets/kataribhog-rice.jpg';
import lalChal from '@/assets/lal-chal.jpg';
import siddhaChal from '@/assets/siddha-chal.jpg';
import motaChal from '@/assets/mota-chal.jpg';

// Image imports — rice dishes
import whiteRice from '@/assets/white-rice.jpg';
import polao from '@/assets/polao.jpg';
import khichuri from '@/assets/khichuri.jpg';
import biryani from '@/assets/biryani.jpg';
import lalBhaat from '@/assets/lal-bhaat.jpg';
import basmatiBhaat from '@/assets/basmati-bhaat.jpg';

// Image imports — fish
import ilish from '@/assets/ilish.jpg';
import rui from '@/assets/rui.jpg';
import katla from '@/assets/katla.jpg';
import pabda from '@/assets/pabda.jpg';
import boal from '@/assets/boal.jpg';
import chingri from '@/assets/chingri.jpg';
import shing from '@/assets/shing.jpg';
import magur from '@/assets/magur.jpg';
import pangash from '@/assets/pangash.jpg';
import koi from '@/assets/koi.jpg';
import shol from '@/assets/shol.jpg';
import ayre from '@/assets/ayre.jpg';
import tilapia from '@/assets/tilapia.jpg';
import rupchanda from '@/assets/rupchanda.jpg';
import puti from '@/assets/puti.jpg';

const imageMap: Record<string, string> = {
  'miniket-rice': miniketRice, 'nazirshail-rice': nazirshailRice,
  'kalijira-rice': kalijiraRice, 'chinigura-rice': chiniguraRice,
  'kataribhog-rice': kataribhogRice, 'lal-chal': lalChal,
  'siddha-chal': siddhaChal, 'mota-chal': motaChal,
  'white-rice': whiteRice, polao, khichuri, biryani,
  'lal-bhaat': lalBhaat, 'basmati-bhaat': basmatiBhaat,
  ilish, rui, katla, pabda, boal, chingri, shing, magur,
  pangash, koi, shol, ayre, tilapia, rupchanda, puti,
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
  const region = lang === 'bn' ? item.region : item.regionEn;

  return (
    <div
      className="glass-card cursor-pointer group"
      style={{ animationDelay: `${index * 0.06}s` }}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={imageMap[item.image] || whiteRice}
          alt={name}
          loading="lazy"
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

        <button className="mt-3 text-xs sm:text-sm font-accent font-semibold gold-accent hover:underline transition-all inline-flex items-center gap-1">
          {expanded ? t('সংক্ষেপ করুন', 'Show Less') : t('বিস্তারিত দেখুন →', 'Read More →')}
        </button>
      </div>
    </div>
  );
};

export default FoodCard;
