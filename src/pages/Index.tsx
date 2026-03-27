import { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import CategoryFilter from '@/components/CategoryFilter';
import FoodCard from '@/components/FoodCard';
import ImageGallery from '@/components/ImageGallery';
import GamesSection from '@/components/GamesSection';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { riceTypes, riceDishes, fishItems } from '@/data/content';

const Index = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const allItems = useMemo(() => [...riceTypes, ...riceDishes, ...fishItems], []);

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearch={setSearchQuery} />
      <HeroSection />

      <section id="explore" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="section-heading">{t('🍽️ ক্যাটাগরি অনুযায়ী অন্বেষণ', '🍽️ Explore by Category')}</h2>
            <p className="section-subheading">{t('আপনার পছন্দের বিভাগ নির্বাচন করুন', 'Select your preferred category')}</p>
          </div>

          <CategoryFilter activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

          {/* Rice Types */}
          {riceTypeItems.length > 0 && (
            <div className="mb-16">
              <h3 className="font-heading text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <span className="text-3xl">🌾</span> {t('বাংলাদেশের চাল', 'Rice Types of Bangladesh')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {riceTypeItems.map((item, i) => (
                  <FoodCard key={item.id} item={item} index={i} />
                ))}
              </div>
            </div>
          )}

          {/* Cooked Rice */}
          {riceDishItems.length > 0 && (
            <div className="mb-16">
              <h3 className="font-heading text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <span className="text-3xl">🍚</span> {t('ভাতের পদ', 'Rice Dishes')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {riceDishItems.map((item, i) => (
                  <FoodCard key={item.id} item={item} index={i} />
                ))}
              </div>
            </div>
          )}

          {/* Fish */}
          {fishList.length > 0 && (
            <div>
              <h3 className="font-heading text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <span className="text-3xl">🐟</span> {t('বাংলাদেশের মাছ', 'Fish of Bangladesh')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {fishList.map((item, i) => (
                  <FoodCard key={item.id} item={item} index={i} />
                ))}
              </div>
            </div>
          )}

          {filteredItems.length === 0 && (
            <div className="text-center py-20">
              <p className="text-2xl font-heading text-muted-foreground">
                {t('কোনো ফলাফল পাওয়া যায়নি', 'No results found')} 😔
              </p>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-cream">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="section-heading">{t('আমাদের সম্পর্কে', 'About Us')}</h2>
          <p className="font-body text-muted-foreground leading-relaxed text-lg mb-6">
            {t(
              '"মাছে ভাতে বাঙ্গালী" — এই প্রবাদটি বাঙালি জীবনের চিরন্তন সত্য। বাংলাদেশের নদী-নালা, খাল-বিল থেকে আসা তাজা মাছ আর উর্বর জমিতে ফলানো ধানের চাল — এই দুইয়ের সমন্বয়ে তৈরি হয় বাঙালির অনন্য খাদ্য সংস্কৃতি। এই ওয়েবসাইটে আমরা বাংলাদেশের সকল প্রকার চাল, ভাতের পদ ও মাছের বিস্তারিত তথ্য, উচ্চমানের ছবি এবং ঐতিহ্যবাহী রেসিপি তুলে ধরেছি।',
              '"Mache Bhate Bangali" — this proverb is the eternal truth of Bengali life. This website presents detailed information, high-quality images and traditional recipes of all rice, rice dishes and fish varieties of Bangladesh.'
            )}
          </p>
          <div className="p-4 rounded-xl bg-secondary/50 backdrop-blur-sm border border-border/30">
            <p className="font-body text-sm text-muted-foreground italic">
              {t(
                'এই ওয়েবসাইটটি তৈরি করেছেন নাসরুল্লাহ, যিনি বিএম কলেজ, বরিশাল থেকে ইংরেজি অনার্সে অধ্যয়নরত। বাংলাদেশের খাদ্য ঐতিহ্যকে ডিজিটালভাবে তুলে ধরার লক্ষ্যেই এই উদ্যোগ।',
                'This website was created by Nasrullah, who is studying English Honours at BM College, Barishal. This initiative aims to digitally preserve the food heritage of Bangladesh.'
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
