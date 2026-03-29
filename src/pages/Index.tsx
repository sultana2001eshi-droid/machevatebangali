import { useState, useMemo } from 'react';
import profileImg from '@/assets/md-nasrullah-profile.jpg';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import CategoryFilter from '@/components/CategoryFilter';
import FoodCard from '@/components/FoodCard';
import ImageGallery from '@/components/ImageGallery';
import GamesSection from '@/components/GamesSection';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { riceTypes, riceDishes, fishItems, type FoodItem } from '@/data/content';
import { useItems, dbItemToFoodItem } from '@/hooks/useItems';

const Index = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const { data: dbItems } = useItems();

  // Merge: Supabase items first, then static fallback items (that don't have a DB version)
  const allItems = useMemo(() => {
    const staticItems: FoodItem[] = [...riceTypes, ...riceDishes, ...fishItems];
    if (!dbItems || dbItems.length === 0) return staticItems;

    const dynamicItems: FoodItem[] = dbItems.map(dbItemToFoodItem);
    // Static items serve as fallback when DB is empty
    return [...dynamicItems, ...staticItems];
  }, [dbItems]);

  const filteredItems = useMemo(() => {
    let items = allItems;
    if (activeCategory === 'rice-type') items = items.filter(i => i.category === 'rice-type');
    else if (activeCategory === 'rice-dish') items = items.filter(i => i.category === 'rice-dish');
    else if (activeCategory === 'fish') items = items.filter(i => i.category === 'fish');
    else if (activeCategory === 'river') items = items.filter(i => i.subCategoryEn === 'River Fish');
    else if (activeCategory === 'sea') items = items.filter(i => i.subCategoryEn === 'Sea Fish');
    else if (activeCategory === 'small') items = items.filter(i => i.subCategoryEn === 'Small Fish');
    else if (activeCategory === 'pond') items = items.filter(i => i.subCategoryEn === 'Pond Fish');
    else if (activeCategory === 'farmed') items = items.filter(i => i.subCategoryEn === 'Farmed Fish');

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(i =>
        i.name.toLowerCase().includes(q) ||
        i.nameEn.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.descriptionEn.toLowerCase().includes(q)
      );
    }
    return items;
  }, [allItems, activeCategory, searchQuery]);

  const riceTypeItems = filteredItems.filter(i => i.category === 'rice-type');
  const riceDishItems = filteredItems.filter(i => i.category === 'rice-dish');
  const fishList = filteredItems.filter(i => i.category === 'fish');

  const SectionTitle = ({ emoji, children }: { emoji: string; children: React.ReactNode }) => (
    <div className="flex items-center gap-3 mb-8">
      <span className="text-3xl">{emoji}</span>
      <div>
        <h3 className="font-heading text-2xl md:text-3xl font-bold text-foreground">{children}</h3>
        <div className="h-0.5 w-16 mt-1 rounded-full bg-gradient-to-r from-gold to-transparent" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearch={setSearchQuery} />
      <HeroSection />

      {/* Explore Section */}
      <section id="explore" className="py-20 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <p className="font-accent text-xs tracking-[0.2em] uppercase gold-accent mb-3">
              {t('সংগ্রহশালা', 'Collection')}
            </p>
            <h2 className="section-heading text-3xl md:text-5xl">{t('ক্যাটাগরি অনুযায়ী অন্বেষণ', 'Explore by Category')}</h2>
            <p className="section-subheading mt-3">{t('আপনার পছন্দের বিভাগ নির্বাচন করুন', 'Select your preferred category')}</p>
          </div>

          <CategoryFilter activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

          {riceTypeItems.length > 0 && (
            <div className="mb-20">
              <SectionTitle emoji="🌾">{t('বাংলাদেশের চাল', 'Rice Types of Bangladesh')}</SectionTitle>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {riceTypeItems.map((item, i) => <FoodCard key={item.id} item={item} index={i} />)}
              </div>
            </div>
          )}

          {riceDishItems.length > 0 && (
            <div className="mb-20">
              <SectionTitle emoji="🍚">{t('ভাতের পদ', 'Rice Dishes')}</SectionTitle>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {riceDishItems.map((item, i) => <FoodCard key={item.id} item={item} index={i} />)}
              </div>
            </div>
          )}

          {fishList.length > 0 && (
            <div>
              <SectionTitle emoji="🐟">{t('বাংলাদেশের মাছ', 'Fish of Bangladesh')}</SectionTitle>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {fishList.map((item, i) => <FoodCard key={item.id} item={item} index={i} />)}
              </div>
            </div>
          )}

          {filteredItems.length === 0 && (
            <div className="text-center py-24">
              <p className="text-5xl mb-4">😔</p>
              <p className="text-xl font-heading text-muted-foreground">
                {t('কোনো ফলাফল পাওয়া যায়নি', 'No results found')}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 md:py-24 bg-cream">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="text-center mb-12">
            <p className="font-accent text-xs tracking-[0.2em] uppercase gold-accent mb-3">
              {t('পরিচিতি', 'Introduction')}
            </p>
            <h2 className="section-heading text-3xl md:text-5xl">{t('আমাদের গল্প', 'Our Story')}</h2>
          </div>

          <div className="relative pl-6 md:pl-8 mb-12">
            <div className="absolute left-0 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b from-gold via-primary to-gold/30" />
            <blockquote>
              <p className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4 leading-snug">
                {t('"মাছে ভাতে বাঙ্গালী"', '"Mache Bhate Bangali"')}
              </p>
              <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed">
                {t(
                  'এই প্রবাদটি বাঙালি জীবনের চিরন্তন সত্য। বাংলাদেশের নদী-নালা, খাল-বিল থেকে আসা তাজা মাছ আর উর্বর জমিতে ফলানো ধানের চাল — এই দুইয়ের সমন্বয়ে তৈরি হয় বাঙালির অনন্য খাদ্য সংস্কৃতি। এই ওয়েবসাইটে আমরা বাংলাদেশের সকল প্রকার চাল, ভাতের পদ ও মাছের বিস্তারিত তথ্য, উচ্চমানের ছবি এবং ঐতিহ্যবাহী রেসিপি তুলে ধরেছি।',
                  'This proverb is the eternal truth of Bengali life. Fresh fish from rivers and canals, combined with rice from fertile lands — together they form the unique food culture of Bengal. This website presents detailed information, high-quality images and traditional recipes of all rice, rice dishes and fish varieties of Bangladesh.'
                )}
              </p>
            </blockquote>
          </div>

          <div className="glass-card p-6 md:p-8 max-w-lg mx-auto text-center border-gold/20">
            <img
              src={profileImg}
              alt="Md Nasrullah"
              className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-2"
              style={{
                borderColor: 'hsl(43, 72%, 55% / 0.5)',
                boxShadow: '0 8px 32px hsl(43, 72%, 55% / 0.15)',
              }}
              loading="lazy"
            />
            <h4 className="font-heading text-xl font-bold text-foreground mb-1">Md Nasrullah</h4>
            <p className="font-accent text-xs tracking-wider uppercase text-muted-foreground mb-3">
              English Honours • BM College, Barishal
            </p>
            <div className="h-px w-12 mx-auto bg-gradient-to-r from-transparent via-gold/40 to-transparent mb-3" />
            <p className="font-body text-sm text-muted-foreground italic leading-relaxed">
              {t(
                '"বাংলার খাবারের ঐতিহ্য ডিজিটালভাবে তুলে ধরাই আমার লক্ষ্য"',
                '"My mission is to digitally preserve the food heritage of Bengal"'
              )}
            </p>
          </div>
        </div>
      </section>

      <GamesSection />
      <ImageGallery />
      <Footer />
    </div>
  );
};

export default Index;
