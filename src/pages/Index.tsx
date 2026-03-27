import { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import CategoryFilter from '@/components/CategoryFilter';
import FoodCard from '@/components/FoodCard';
import ImageGallery from '@/components/ImageGallery';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { riceDishes, fishItems } from '@/data/content';

const Index = () => {
  const { t, lang } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const allItems = useMemo(() => [...riceDishes, ...fishItems], []);

  const filteredItems = useMemo(() => {
    let items = allItems;

    // Category filter
    if (activeCategory === 'rice') items = items.filter(i => i.category === 'rice');
    else if (activeCategory === 'fish') items = items.filter(i => i.category === 'fish');
    else if (activeCategory === 'river') items = items.filter(i => i.subCategoryEn === 'River Fish');
    else if (activeCategory === 'sea') items = items.filter(i => i.subCategoryEn === 'Sea Fish');
    else if (activeCategory === 'small') items = items.filter(i => i.subCategoryEn === 'Small Fish');

    // Search filter
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

  const riceItems = filteredItems.filter(i => i.category === 'rice');
  const fishList = filteredItems.filter(i => i.category === 'fish');

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearch={setSearchQuery} />

      <HeroSection />

      {/* Explore Section */}
      <section id="explore" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="section-heading">{t('🍚 ক্যাটাগরি অনুযায়ী অন্বেষণ', '🍚 Explore by Category')}</h2>
            <p className="section-subheading">{t('আপনার পছন্দের বিভাগ নির্বাচন করুন', 'Select your preferred category')}</p>
          </div>

          <CategoryFilter activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

          {/* Rice Section */}
          {riceItems.length > 0 && (
            <div className="mb-16">
              <h3 className="font-heading text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <span className="text-3xl">🍚</span> {t('ভাতের পদ', 'Rice Dishes')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {riceItems.map((item, i) => (
                  <FoodCard key={item.id} item={item} index={i} />
                ))}
              </div>
            </div>
          )}

          {/* Fish Section */}
          {fishList.length > 0 && (
            <div>
              <h3 className="font-heading text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <span className="text-3xl">🐟</span> {t('মাছের পরিচিতি', 'Popular Fish')}
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
          <p className="font-body text-muted-foreground leading-relaxed text-lg">
            {t(
              '"মাছে ভাতে বাঙ্গালী" — এই প্রবাদটি বাঙালি জীবনের চিরন্তন সত্য। বাংলাদেশের নদী-নালা, খাল-বিল থেকে আসা তাজা মাছ আর উর্বর জমিতে ফলানো ধানের চাল — এই দুইয়ের সমন্বয়ে তৈরি হয় বাঙালির অনন্য খাদ্য সংস্কৃতি। এই ওয়েবসাইটে আমরা বাংলাদেশের সকল প্রকার মাছ ও ভাতের বিস্তারিত তথ্য, উচ্চমানের ছবি এবং ঐতিহ্যবাহী রেসিপি তুলে ধরেছি।',
              '"Mache Bhate Bangali" — this proverb is the eternal truth of Bengali life. Fresh fish from rivers and canals, and rice from fertile lands — together they create the unique food culture of Bengal. This website presents detailed information, high-quality images and traditional recipes of all fish and rice varieties of Bangladesh.'
            )}
          </p>
        </div>
      </section>

      <ImageGallery />

      <Footer />
    </div>
  );
};

export default Index;
