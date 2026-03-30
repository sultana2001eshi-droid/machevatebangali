import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import FoodCard from '@/components/FoodCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { useItems, dbItemToFoodItem } from '@/hooks/useItems';
import { ArrowLeft } from 'lucide-react';

const categoryMeta: Record<string, { emoji: string; bn: string; en: string; descBn: string; descEn: string }> = {
  'rice-type': { emoji: '🌾', bn: 'বাংলাদেশের চাল', en: 'Rice Types of Bangladesh', descBn: 'বাংলাদেশের সকল প্রকার চালের বিস্তারিত তথ্য', descEn: 'Detailed information about all rice varieties of Bangladesh' },
  'rice-dish': { emoji: '🍚', bn: 'ভাতের পদ', en: 'Rice Dishes', descBn: 'ঐতিহ্যবাহী বাঙালি ভাতের পদসমূহ', descEn: 'Traditional Bengali rice dishes' },
  'fish': { emoji: '🐟', bn: 'বাংলাদেশের মাছ', en: 'Fish of Bangladesh', descBn: 'বাংলাদেশের সকল প্রকার মাছের বিস্তারিত তথ্য', descEn: 'Detailed information about all fish varieties of Bangladesh' },
};

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { data: dbItems, isLoading } = useItems();
  const [searchQuery, setSearchQuery] = useState('');

  const items = useMemo(() => {
    if (!dbItems) return [];
    let all = dbItems.map(dbItemToFoodItem).filter(i => i.category === category);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      all = all.filter(i =>
        i.name.toLowerCase().includes(q) ||
        i.nameEn.toLowerCase().includes(q)
      );
    }
    return all;
  }, [dbItems, category, searchQuery]);

  const meta = categoryMeta[category || ''] || { emoji: '🍽️', bn: category || '', en: category || '', descBn: '', descEn: '' };

  return (
    <div className="min-h-screen bg-background noise-bg">
      <Navbar onSearch={setSearchQuery} />

      {/* Hero */}
      <section className="pt-28 pb-12 md:pt-32 md:pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-sm font-accent text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('হোমে ফিরুন', 'Back to Home')}
          </button>
          <div className="text-center">
            <span className="text-5xl md:text-6xl mb-4 block">{meta.emoji}</span>
            <h1 className="section-heading text-3xl md:text-5xl">{t(meta.bn, meta.en)}</h1>
            <p className="section-subheading mt-3">{t(meta.descBn, meta.descEn)}</p>
            <p className="text-sm text-muted-foreground font-accent mt-2">
              {t(`মোট ${items.length}টি আইটেম`, `${items.length} items total`)}
            </p>
          </div>
        </div>
      </section>

      {/* Items */}
      <section className="pb-20 md:pb-24">
        <div className="container mx-auto px-4 md:px-6">
          {isLoading ? (
            <div className="text-center py-16">
              <div className="animate-pulse font-heading text-lg text-muted-foreground">
                {t('লোড হচ্ছে...', 'Loading...')}
              </div>
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {items.map((item, i) => (
                <FoodCard key={item.id} item={item} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <p className="text-5xl mb-4">😔</p>
              <p className="text-xl font-heading text-muted-foreground">
                {t('কোনো ফলাফল পাওয়া যায়নি', 'No results found')}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;
