import { useLanguage } from '@/contexts/LanguageContext';
import { categories } from '@/data/content';

interface CategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
}

const CategoryFilter = ({ activeCategory, onCategoryChange }: CategoryFilterProps) => {
  const { lang } = useLanguage();
  const cats = lang === 'bn' ? categories.bn : categories.en;

  return (
    <div className="flex flex-wrap gap-2 justify-center mb-10">
      {cats.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onCategoryChange(cat.id)}
          className={`px-4 py-2 rounded-full text-sm font-accent font-medium transition-all duration-200 ${
            activeCategory === cat.id
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
