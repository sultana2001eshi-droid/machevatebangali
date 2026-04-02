import { useState, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useItems, dbItemToFoodItem } from '@/hooks/useItems';
import { useNavigate } from 'react-router-dom';
import { MapPin, ChevronRight, X } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import type { FoodItem } from '@/data/content';

interface District {
  id: string;
  nameBn: string;
  nameEn: string;
  x: number; // percentage position on map
  y: number;
  iconicDishes: string[];
  descBn: string;
  descEn: string;
}

const districts: District[] = [
  { id: 'barishal', nameBn: 'বরিশাল', nameEn: 'Barishal', x: 48, y: 72, iconicDishes: ['ইলিশ', 'নারকেল', 'Hilsa', 'Coconut'], descBn: 'ইলিশের রাজধানী — নদীমাতৃক বরিশালের ইলিশ ও নারকেলের খাবার বিশ্বখ্যাত', descEn: 'Capital of Hilsa — Barishal is world-renowned for its river Hilsa and coconut cuisine' },
  { id: 'khulna', nameBn: 'খুলনা', nameEn: 'Khulna', x: 35, y: 68, iconicDishes: ['চিংড়ি', 'গলদা', 'Shrimp', 'Prawn'], descBn: 'সুন্দরবনের কোলে — খুলনার চিংড়ি ও গলদা মাছ দেশ-বিদেশে সমাদৃত', descEn: 'In the lap of Sundarbans — Khulna\'s shrimp and prawns are celebrated globally' },
  { id: 'sylhet', nameBn: 'সিলেট', nameEn: 'Sylhet', x: 82, y: 22, iconicDishes: ['সাতকরা', 'শুটকি', 'Satkora', 'Dried Fish'], descBn: 'চা বাগানের শহর — সিলেটের সাতকরা দিয়ে রান্না ও শুটকি অনন্য', descEn: 'City of tea gardens — Sylhet\'s Satkora curry and dried fish are unique' },
  { id: 'rajshahi', nameBn: 'রাজশাহী', nameEn: 'Rajshahi', x: 28, y: 28, iconicDishes: ['আম', 'কালাই রুটি', 'Mango', 'Kalai Ruti'], descBn: 'আমের রাজধানী — রাজশাহীর আম ও কালাই রুটি ঐতিহ্যবাহী', descEn: 'Capital of mangoes — Rajshahi\'s mangoes and Kalai Ruti are legendary' },
  { id: 'chattogram', nameBn: 'চট্টগ্রাম', nameEn: 'Chattogram', x: 78, y: 58, iconicDishes: ['মেজবানি', 'শুটকি', 'Mezban', 'Shutki'], descBn: 'বন্দরনগরী — চট্টগ্রামের মেজবানি গোশত ও সামুদ্রিক মাছ অসাধারণ', descEn: 'Port city — Chattogram\'s Mezban feast and seafood are extraordinary' },
  { id: 'dhaka', nameBn: 'ঢাকা', nameEn: 'Dhaka', x: 55, y: 42, iconicDishes: ['বিরিয়ানি', 'কাচ্চি', 'Biryani', 'Kacchi'], descBn: 'পুরান ঢাকার ঐতিহ্য — কাচ্চি বিরিয়ানি ও বাকরখানি ঢাকার গর্ব', descEn: 'Old Dhaka heritage — Kacchi Biryani and Bakarkhani are Dhaka\'s pride' },
  { id: 'rangpur', nameBn: 'রংপুর', nameEn: 'Rangpur', x: 35, y: 12, iconicDishes: ['ভর্তা', 'সিঁদল', 'Bhorta', 'Shidal'], descBn: 'উত্তরবঙ্গের স্বাদ — রংপুরের ভর্তা ও সিঁদল সংস্কৃতি অনন্য', descEn: 'Taste of North Bengal — Rangpur\'s Bhorta and Shidal culture is unique' },
  { id: 'mymensingh', nameBn: 'ময়মনসিংহ', nameEn: 'Mymensingh', x: 60, y: 28, iconicDishes: ['মিঠা পানির মাছ', 'পিঠা', 'Freshwater Fish', 'Pitha'], descBn: 'হাওর অঞ্চল — ময়মনসিংহের মিঠা পানির মাছ ও পিঠার ঐতিহ্য', descEn: 'Haor region — Mymensingh\'s freshwater fish and Pitha tradition' },
];

const DistrictFoodMap = () => {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const { data: dbItems } = useItems();
  const [activeDistrict, setActiveDistrict] = useState<District | null>(null);
  const { ref, isVisible } = useScrollReveal<HTMLElement>(0.1);

  const allItems = useMemo(() => {
    if (!dbItems) return [];
    return dbItems.map(dbItemToFoodItem);
  }, [dbItems]);

  // Match items from DB by checking if the item's region/name matches district keywords
  const getDistrictItems = (district: District): FoodItem[] => {
    const keywords = [
      district.nameBn.toLowerCase(),
      district.nameEn.toLowerCase(),
      ...district.iconicDishes.map(d => d.toLowerCase()),
    ];
    return allItems.filter(item => {
      const searchFields = [
        item.name, item.nameEn, item.region || '', item.regionEn || '',
        item.description, item.descriptionEn,
      ].map(s => s.toLowerCase());
      return keywords.some(k => searchFields.some(f => f.includes(k)));
    }).slice(0, 4);
  };

  return (
    <section ref={ref} className="py-20 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section header — matches existing site style */}
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="font-accent text-xs tracking-[0.2em] uppercase gold-accent mb-3">
            {t('জেলাভিত্তিক আবিষ্কার', 'District Discovery')}
          </p>
          <h2 className="section-heading text-3xl md:text-5xl">
            {t('বাংলাদেশের স্বাদের মানচিত্র', 'Flavour Map of Bangladesh')}
          </h2>
          <p className="section-subheading mt-3">
            {t('প্রতিটি জেলার অনন্য খাদ্য ঐতিহ্য অন্বেষণ করুন', 'Explore the unique food heritage of every district')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Map — desktop/tablet */}
          <div className={`hidden md:block relative transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border"
              style={{
                background: 'linear-gradient(135deg, hsl(var(--card) / 0.8), hsl(var(--secondary) / 0.5))',
                borderColor: 'hsl(var(--border) / 0.5)',
              }}
            >
              {/* Bangladesh outline shape using CSS */}
              <div className="absolute inset-8 rounded-3xl"
                style={{
                  background: 'linear-gradient(180deg, hsl(var(--primary) / 0.08) 0%, hsl(var(--gold) / 0.05) 100%)',
                  border: '1px solid hsl(var(--gold) / 0.15)',
                }}
              />

              {/* District markers */}
              {districts.map((district) => {
                const isActive = activeDistrict?.id === district.id;
                return (
                  <button
                    key={district.id}
                    onClick={() => setActiveDistrict(isActive ? null : district)}
                    className="absolute z-10 group"
                    style={{ left: `${district.x}%`, top: `${district.y}%`, transform: 'translate(-50%, -50%)' }}
                  >
                    {/* Pulse ring */}
                    <span className={`absolute inset-0 rounded-full transition-all duration-500 ${isActive ? 'animate-ping' : ''}`}
                      style={{
                        background: 'hsl(var(--gold) / 0.2)',
                        width: '32px', height: '32px',
                        margin: '-4px',
                      }}
                    />
                    {/* Marker dot */}
                    <span className={`relative flex items-center justify-center w-6 h-6 rounded-full transition-all duration-300 ${isActive ? 'scale-125' : 'group-hover:scale-110'}`}
                      style={{
                        background: isActive
                          ? 'linear-gradient(135deg, hsl(var(--gold)), hsl(var(--accent)))'
                          : 'hsl(var(--gold) / 0.7)',
                        boxShadow: isActive
                          ? '0 0 20px hsl(var(--gold) / 0.5)'
                          : '0 2px 8px hsl(var(--foreground) / 0.15)',
                      }}
                    >
                      <MapPin className="w-3 h-3" style={{ color: 'hsl(var(--gold-foreground))' }} />
                    </span>
                    {/* Label */}
                    <span className={`absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap font-accent text-[10px] font-semibold transition-all duration-300 ${isActive ? 'gold-accent' : 'text-muted-foreground group-hover:text-foreground'}`}>
                      {lang === 'bn' ? district.nameBn : district.nameEn}
                    </span>
                  </button>
                );
              })}

              {/* Active district info card overlay */}
              {activeDistrict && (
                <div className="absolute bottom-4 left-4 right-4 z-20 animate-fade-up">
                  <DistrictCard
                    district={activeDistrict}
                    items={getDistrictItems(activeDistrict)}
                    lang={lang}
                    t={t}
                    navigate={navigate}
                    onClose={() => setActiveDistrict(null)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* District list — mobile-first stacked cards (visible on all, primary on mobile) */}
          <div className={`space-y-3 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {districts.map((district, i) => (
              <DistrictListItem
                key={district.id}
                district={district}
                items={getDistrictItems(district)}
                isActive={activeDistrict?.id === district.id}
                onToggle={() => setActiveDistrict(activeDistrict?.id === district.id ? null : district)}
                lang={lang}
                t={t}
                navigate={navigate}
                index={i}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

interface DistrictCardProps {
  district: District;
  items: FoodItem[];
  lang: string;
  t: (bn: string, en: string) => string;
  navigate: (path: string) => void;
  onClose: () => void;
}

const DistrictCard = ({ district, items, lang, t, navigate, onClose }: DistrictCardProps) => (
  <div className="glass-card p-4 border-gold/20" style={{ background: 'hsl(var(--card) / 0.92)', backdropFilter: 'blur(24px)' }}>
    <div className="flex items-start justify-between mb-2">
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 gold-accent flex-shrink-0" />
        <h4 className="font-heading text-lg font-bold text-foreground">
          {lang === 'bn' ? district.nameBn : district.nameEn}
        </h4>
      </div>
      <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1">
        <X className="w-4 h-4" />
      </button>
    </div>
    <p className="font-body text-xs text-muted-foreground leading-relaxed mb-3">
      {lang === 'bn' ? district.descBn : district.descEn}
    </p>
    <div className="flex flex-wrap gap-1.5 mb-3">
      {district.iconicDishes.filter((_, i) => lang === 'bn' ? i < district.iconicDishes.length / 2 : i >= district.iconicDishes.length / 2).map(dish => (
        <span key={dish} className="px-2.5 py-1 rounded-full text-[10px] font-accent font-medium border"
          style={{
            background: 'hsl(var(--gold) / 0.08)',
            borderColor: 'hsl(var(--gold) / 0.2)',
            color: 'hsl(var(--gold))',
          }}
        >
          {dish}
        </span>
      ))}
    </div>
    {items.length > 0 && (
      <div className="flex gap-2 overflow-x-auto pb-1">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => navigate(`/item/${item.id}`)}
            className="flex-shrink-0 w-16 group"
          >
            <div className="w-16 h-12 rounded-lg overflow-hidden bg-secondary mb-1">
              {item.image?.startsWith('http') ? (
                <img src={item.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" loading="lazy" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-lg">🍽️</div>
              )}
            </div>
            <p className="font-accent text-[9px] text-muted-foreground truncate group-hover:text-foreground transition-colors">
              {lang === 'bn' ? item.name : item.nameEn}
            </p>
          </button>
        ))}
      </div>
    )}
  </div>
);

interface DistrictListItemProps {
  district: District;
  items: FoodItem[];
  isActive: boolean;
  onToggle: () => void;
  lang: string;
  t: (bn: string, en: string) => string;
  navigate: (path: string) => void;
  index: number;
}

const DistrictListItem = ({ district, items, isActive, onToggle, lang, t, navigate, index }: DistrictListItemProps) => {
  const dishes = district.iconicDishes.filter((_, i) =>
    lang === 'bn' ? i < district.iconicDishes.length / 2 : i >= district.iconicDishes.length / 2
  );

  return (
    <div className="glass-card overflow-hidden transition-all duration-500" style={{ transitionDelay: `${index * 0.04}s` }}>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-4 text-left transition-colors"
      >
        <span className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: isActive
              ? 'linear-gradient(135deg, hsl(var(--gold) / 0.2), hsl(var(--gold) / 0.08))'
              : 'hsl(var(--secondary) / 0.6)',
            border: `1px solid ${isActive ? 'hsl(var(--gold) / 0.3)' : 'hsl(var(--border) / 0.3)'}`,
          }}
        >
          <MapPin className={`w-4 h-4 transition-colors duration-300 ${isActive ? 'gold-accent' : 'text-muted-foreground'}`} />
        </span>
        <div className="flex-1 min-w-0">
          <h4 className="font-heading text-sm font-bold text-foreground">
            {lang === 'bn' ? district.nameBn : district.nameEn}
          </h4>
          <p className="font-body text-[11px] text-muted-foreground truncate">
            {dishes.join(' • ')}
          </p>
        </div>
        <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform duration-300 flex-shrink-0 ${isActive ? 'rotate-90' : ''}`} />
      </button>

      {/* Expanded content */}
      <div className={`overflow-hidden transition-all duration-500 ${isActive ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 pb-4 pt-0">
          <div className="h-px w-full mb-3" style={{ background: 'linear-gradient(to right, transparent, hsl(var(--gold) / 0.2), transparent)' }} />
          <p className="font-body text-xs text-muted-foreground leading-relaxed mb-3">
            {lang === 'bn' ? district.descBn : district.descEn}
          </p>

          {/* Dish chips */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {dishes.map(dish => (
              <span key={dish} className="px-2.5 py-1 rounded-full text-[10px] font-accent font-medium border"
                style={{
                  background: 'hsl(var(--gold) / 0.08)',
                  borderColor: 'hsl(var(--gold) / 0.2)',
                  color: 'hsl(var(--gold))',
                }}
              >
                {dish}
              </span>
            ))}
          </div>

          {/* Related items from DB */}
          {items.length > 0 && (
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {items.map(item => (
                <button
                  key={item.id}
                  onClick={() => navigate(`/item/${item.id}`)}
                  className="flex-shrink-0 w-20 group text-left"
                >
                  <div className="w-20 h-14 rounded-xl overflow-hidden bg-secondary mb-1.5 border"
                    style={{ borderColor: 'hsl(var(--border) / 0.3)' }}
                  >
                    {item.image?.startsWith('http') ? (
                      <img src={item.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl bg-gradient-to-br from-secondary to-muted">🍽️</div>
                    )}
                  </div>
                  <p className="font-accent text-[10px] text-muted-foreground truncate group-hover:text-foreground transition-colors">
                    {lang === 'bn' ? item.name : item.nameEn}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DistrictFoodMap;
