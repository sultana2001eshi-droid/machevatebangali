import { useParams, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { ArrowLeft, MapPin, Utensils, Heart, Leaf, DollarSign } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { riceTypes, riceDishes, fishItems, type FoodItem } from '@/data/content';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Import all images
import miniketRice from '@/assets/miniket-rice.jpg';
import nazirshailRice from '@/assets/nazirshail-rice.jpg';
import kalijiraRice from '@/assets/kalijira-rice.jpg';
import chiniguraRice from '@/assets/chinigura-rice.jpg';
import kataribhogRice from '@/assets/kataribhog-rice.jpg';
import lalChal from '@/assets/lal-chal.jpg';
import siddhaChal from '@/assets/siddha-chal.jpg';
import motaChal from '@/assets/mota-chal.jpg';
import atopChal from '@/assets/atop-chal.jpg';
import basmatIChal from '@/assets/basmati-chal.jpg';
import whiteRice from '@/assets/white-rice.jpg';
import polao from '@/assets/polao.jpg';
import khichuri from '@/assets/khichuri.jpg';
import biryani from '@/assets/biryani.jpg';
import lalBhaat from '@/assets/lal-bhaat.jpg';
import basmatiBhaat from '@/assets/basmati-bhaat.jpg';
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
import tengra from '@/assets/tengra.jpg';

const imageMap: Record<string, string> = {
  'miniket-rice': miniketRice, 'nazirshail-rice': nazirshailRice,
  'kalijira-rice': kalijiraRice, 'chinigura-rice': chiniguraRice,
  'kataribhog-rice': kataribhogRice, 'lal-chal': lalChal,
  'siddha-chal': siddhaChal, 'mota-chal': motaChal,
  'atop-chal': atopChal, 'basmati-chal': basmatIChal,
  'white-rice': whiteRice, polao, khichuri, biryani,
  'lal-bhaat': lalBhaat, 'basmati-bhaat': basmatiBhaat,
  ilish, rui, katla, pabda, boal, chingri, shing, magur,
  pangash, koi, shol, ayre, tilapia, rupchanda, puti, tengra,
};

const categoryEmoji: Record<string, string> = {
  'rice-type': '🌾',
  'rice-dish': '🍚',
  'fish': '🐟',
};

const ItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { lang, t } = useLanguage();

  const allItems = useMemo(() => [...riceTypes, ...riceDishes, ...fishItems], []);
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

  // Find related items (same category, different id)
  const related = allItems.filter(i => i.category === item.category && i.id !== item.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearch={() => {}} />

      {/* Hero Image */}
      <div className="relative pt-16">
        <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <img
            src={imageMap[item.image] || whiteRice}
            alt={name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to top, hsl(var(--background)) 0%, hsl(var(--background) / 0.4) 40%, transparent 70%)'
          }} />

          {/* Back button */}
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

          {/* Category badge */}
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
        {/* Description */}
        <div className="mb-10">
          <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed">
            {desc}
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-10">
          {/* Origin */}
          {origin && (
            <InfoCard
              icon="📜"
              title={t('নামের উৎপত্তি', 'Name Origin')}
              content={origin}
            />
          )}

          {/* Taste */}
          {taste && (
            <InfoCard
              icon="👅"
              title={t('স্বাদ', 'Taste')}
              content={taste}
            />
          )}

          {/* Nutrition */}
          {nutrition && (
            <InfoCard
              icon="🥗"
              title={t('পুষ্টিগুণ', 'Nutrition')}
              content={nutrition}
            />
          )}

          {/* Price */}
          {price && (
            <InfoCard
              icon="💰"
              title={t('বাজার মূল্য', 'Market Price')}
              content={price}
            />
          )}
        </div>

        {/* Cultural Importance */}
        {cultural && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-gold" />
              <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground">
                {t('সাংস্কৃতিক গুরুত্ব', 'Cultural Importance')}
              </h2>
            </div>
            <div className="relative pl-6 border-l-2 border-gold/30">
              <p className="font-body text-base text-muted-foreground leading-relaxed italic">
                {cultural}
              </p>
            </div>
          </div>
        )}

        {/* Cooking Method */}
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
                      style={{
                        background: 'hsl(var(--gold) / 0.15)',
                        color: 'hsl(var(--gold))',
                      }}
                    >
                      {i + 1}
                    </span>
                    <p className="font-body text-sm md:text-base text-muted-foreground leading-relaxed pt-1">{step}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Related Items */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground mb-6">
              {t('আরও দেখুন', 'Related Items')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {related.map((rel) => (
                <button
                  key={rel.id}
                  onClick={() => { navigate(`/item/${rel.id}`); window.scrollTo({ top: 0 }); }}
                  className="glass-card group text-left overflow-hidden transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={imageMap[rel.image] || whiteRice}
                      alt={lang === 'bn' ? rel.name : rel.nameEn}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
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
              ))}
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
