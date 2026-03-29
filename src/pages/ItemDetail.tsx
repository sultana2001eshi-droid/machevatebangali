import { useParams, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { ArrowLeft, MapPin, Utensils, Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { riceTypes, riceDishes, fishItems, type FoodItem } from '@/data/content';
import { useItems, dbItemToFoodItem } from '@/hooks/useItems';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RealImage from '@/components/RealImage';

const categoryEmoji: Record<string, string> = {
  'rice-type': '🌾',
  'rice-dish': '🍚',
  'fish': '🐟',
};

const ItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const { data: dbItems } = useItems();

  const allItems = useMemo(() => {
    const staticItems: FoodItem[] = [...riceTypes, ...riceDishes, ...fishItems];
    if (!dbItems || dbItems.length === 0) return staticItems;
    const dynamicItems: FoodItem[] = dbItems.map(dbItemToFoodItem);
    return [...dynamicItems, ...staticItems];
  }, [dbItems]);

  const item = allItems.find(i => i.id === id);

  if (!item) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">😔</p>
          <p className="font-heading text-xl text-muted-foreground mb-4">{t('আইটেম পাওয়া যায়নি', 'Item not found')}</p>
          <button onClick={() => navigate('/')} className="px-6 py-2 rounded-full bg-primary text-primary-foreground font-body">
            {t('হোমে ফিরুন', 'Go Home')}
          </button>
        </div>
      </div>
    );
  }

  // Check if this item has a direct image_url (from Supabase)
  const hasDirectImage = item.image.startsWith('http');

  const name = lang === 'bn' ? item.name : item.nameEn;
  const desc = lang === 'bn' ? (item.detailedDescription || item.description) : (item.detailedDescriptionEn || item.descriptionEn);
  const sub = lang === 'bn' ? item.subCategory : item.subCategoryEn;
  const nutrition = lang === 'bn' ? item.nutrition : item.nutritionEn;
  const cooking = lang === 'bn' ? item.cookingMethod : item.cookingMethodEn;
  const region = lang === 'bn' ? item.region : item.regionEn;
  const cultural = lang === 'bn' ? item.culturalImportance : item.culturalImportanceEn;
  const steps = lang === 'bn' ? item.cookingSteps : item.cookingStepsEn;
  const taste = lang === 'bn' ? item.taste : item.tasteEn;
  const price = lang === 'bn' ? item.price : item.priceEn;
  const origin = lang === 'bn' ? item.origin : item.originEn;

  const related = allItems.filter(i => i.category === item.category && i.id !== item.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearch={() => {}} />

      {/* Hero Image */}
      <div className="relative pt-16">
        <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          {hasDirectImage ? (
            <img src={item.image} alt={name} className="w-full h-full object-cover" />
          ) : (
            <RealImage
              nameEn={item.nameEn}
              category={item.category}
              alt={name}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to top, hsl(var(--background)) 0%, hsl(var(--background) / 0.4) 40%, transparent 70%)'
          }} />

          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 z-10 flex items-center gap-2 px-4 py-2 rounded-full font-body text-sm font-medium backdrop-blur-xl border transition-all hover:scale-105"
            style={{
              background: 'hsl(var(--card) / 0.8)',
              borderColor: 'hsl(var(--border) / 0.5)',
              color: 'hsl(var(--foreground))',
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            {t('ফিরে যান', 'Go Back')}
          </button>

          <div className="absolute bottom-8 left-0 right-0 px-6 md:px-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-accent font-medium backdrop-blur-xl border mb-3"
              style={{
                background: 'hsl(var(--card) / 0.75)',
                borderColor: 'hsl(var(--gold) / 0.3)',
              }}
            >
              <span>{categoryEmoji[item.category]}</span> {sub}
            </span>
            <h1 className="font-heading text-3xl md:text-5xl font-bold text-foreground leading-tight">
              {name}
            </h1>
            {region && (
              <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground font-body">
                <MapPin className="w-4 h-4" />
                <span>{region}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 max-w-4xl py-10 md:py-16">
        <div className="mb-10">
          <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed">{desc}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-10">
          {origin && <InfoCard icon="📜" title={t('নামের উৎপত্তি', 'Name Origin')} content={origin} />}
          {taste && <InfoCard icon="👅" title={t('স্বাদ', 'Taste')} content={taste} />}
          {nutrition && <InfoCard icon="🥗" title={t('পুষ্টিগুণ', 'Nutrition')} content={nutrition} />}
          {price && <InfoCard icon="💰" title={t('বাজার মূল্য', 'Market Price')} content={price} />}
        </div>

        {cultural && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-gold" />
              <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground">
                {t('সাংস্কৃতিক গুরুত্ব', 'Cultural Importance')}
              </h2>
            </div>
            <div className="relative pl-6 border-l-2 border-gold/30">
              <p className="font-body text-base text-muted-foreground leading-relaxed italic">{cultural}</p>
            </div>
          </div>
        )}

        {(cooking || (steps && steps.length > 0)) && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Utensils className="w-5 h-5 text-gold" />
              <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground">
                {t('রান্নার পদ্ধতি', 'Cooking Method')}
              </h2>
            </div>
            {cooking && !steps && (
              <p className="font-body text-base text-muted-foreground leading-relaxed mb-4">{cooking}</p>
            )}
            {steps && steps.length > 0 && (
              <div className="space-y-3">
                {steps.map((step, i) => (
                  <div key={i} className="flex gap-4 items-start glass-card p-4 border-gold/10">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-heading font-bold text-sm"
                      style={{ background: 'hsl(var(--gold) / 0.15)', color: 'hsl(var(--gold))' }}
                    >{i + 1}</span>
                    <p className="font-body text-sm md:text-base text-muted-foreground leading-relaxed pt-1">{step}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground mb-6">
              {t('আরও দেখুন', 'Related Items')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {related.map((rel) => {
                const relHasDirectImage = rel.image.startsWith('http');
                return (
                  <button
                    key={rel.id}
                    onClick={() => { navigate(`/item/${rel.id}`); window.scrollTo({ top: 0 }); }}
                    className="glass-card group text-left overflow-hidden transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      {relHasDirectImage ? (
                        <img src={rel.image} alt={lang === 'bn' ? rel.name : rel.nameEn} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                      ) : (
                        <RealImage
                          nameEn={rel.nameEn}
                          category={rel.category}
                          alt={lang === 'bn' ? rel.name : rel.nameEn}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      )}
                    </div>
                    <div className="p-3">
                      <p className="font-heading text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                        {lang === 'bn' ? rel.name : rel.nameEn}
                      </p>
                      <p className="font-body text-xs text-muted-foreground truncate">
                        {lang === 'bn' ? rel.subCategory : rel.subCategoryEn}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

const InfoCard = ({ icon, title, content }: { icon: string; title: string; content: string }) => (
  <div className="glass-card p-4 md:p-5 border-gold/10">
    <div className="flex items-center gap-2 mb-2">
      <span className="text-lg">{icon}</span>
      <h3 className="font-accent text-xs tracking-wider uppercase font-semibold gold-accent">{title}</h3>
    </div>
    <p className="font-body text-sm text-muted-foreground leading-relaxed">{content}</p>
  </div>
);

export default ItemDetail;
