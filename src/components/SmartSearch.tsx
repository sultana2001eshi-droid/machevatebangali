import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Search, X, Clock, TrendingUp, Mic } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import type { FoodItem } from '@/data/content';

interface SmartSearchProps {
  allItems: FoodItem[];
  onSearch: (query: string) => void;
}

const RECENT_KEY = 'mvb_recent_searches';
const MAX_RECENT = 5;
const MAX_RESULTS = 8;

const categoryLabels: Record<string, { bn: string; en: string }> = {
  'rice-type': { bn: 'চাল', en: 'Rice' },
  'rice-dish': { bn: 'ভাতের পদ', en: 'Rice Dish' },
  'fish': { bn: 'মাছ', en: 'Fish' },
};

const SmartSearch = ({ allItems, onSearch }: SmartSearchProps) => {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Recent searches from localStorage
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
    } catch { return []; }
  });

  // Save recent search
  const saveRecent = useCallback((term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    const updated = [trimmed, ...recentSearches.filter(r => r !== trimmed)].slice(0, MAX_RECENT);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  }, [recentSearches]);

  // Normalize Bengali text for fuzzy matching
  const normalize = (s: string) => s.toLowerCase().replace(/[\s\-_]+/g, '');

  // Search results
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = normalize(query);
    
    return allItems
      .map(item => {
        const nameBn = normalize(item.name);
        const nameEn = normalize(item.nameEn);
        const descBn = normalize(item.description);
        const subBn = normalize(item.subCategory || '');
        const subEn = normalize(item.subCategoryEn || '');

        let score = 0;
        if (nameBn.startsWith(q) || nameEn.startsWith(q)) score = 100;
        else if (nameBn.includes(q) || nameEn.includes(q)) score = 80;
        else if (subBn.includes(q) || subEn.includes(q)) score = 60;
        else if (descBn.includes(q)) score = 40;
        else return null;

        return { item, score };
      })
      .filter(Boolean)
      .sort((a, b) => b!.score - a!.score)
      .slice(0, MAX_RESULTS)
      .map(r => r!.item);
  }, [query, allItems]);

  // Popular items (first 4 unique categories)
  const popularItems = useMemo(() => {
    const seen = new Set<string>();
    const popular: FoodItem[] = [];
    for (const item of allItems) {
      if (!seen.has(item.category) && item.image) {
        popular.push(item);
        seen.add(item.category);
      }
      if (popular.length >= 4) break;
    }
    return popular;
  }, [allItems]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const list = query.trim() ? results : popularItems;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx(i => Math.min(i + 1, list.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx(i => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIdx >= 0 && list[selectedIdx]) {
        goToItem(list[selectedIdx]);
      } else if (query.trim()) {
        saveRecent(query);
        onSearch(query);
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const goToItem = (item: FoodItem) => {
    saveRecent(lang === 'bn' ? item.name : item.nameEn);
    setIsOpen(false);
    setQuery('');
    navigate(`/item/${item.id}`);
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_KEY);
  };

  const showDropdown = isOpen && (query.trim() || recentSearches.length > 0 || popularItems.length > 0);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setSelectedIdx(-1); onSearch(e.target.value); }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={t('মাছ, চাল বা পদ খুঁজুন...', 'Search fish, rice or dishes...')}
          className="w-full pl-10 pr-16 py-3 rounded-2xl text-sm font-body
            bg-secondary/80 backdrop-blur-sm text-foreground 
            placeholder:text-muted-foreground
            border border-border/50 
            focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/40
            transition-all duration-300"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {query && (
            <button
              onClick={() => { setQuery(''); onSearch(''); inputRef.current?.focus(); }}
              className="p-1.5 rounded-full hover:bg-muted transition-colors"
            >
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          )}
          <button className="p-1.5 rounded-full hover:bg-muted transition-colors opacity-40">
            <Mic className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Dropdown Panel */}
      {showDropdown && (
        <div
          className="absolute top-full left-0 right-0 mt-2 rounded-2xl overflow-hidden z-50
            border border-border/60 shadow-2xl animate-fade-in"
          style={{
            background: 'hsl(var(--card) / 0.95)',
            backdropFilter: 'blur(24px)',
          }}
        >
          {/* Search Results */}
          {query.trim() && results.length > 0 && (
            <div className="p-2">
              {results.map((item, i) => (
                <button
                  key={item.id}
                  onClick={() => goToItem(item)}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all duration-200
                    ${selectedIdx === i ? 'bg-gold/10 ring-1 ring-gold/20' : 'hover:bg-secondary/60'}`}
                  onMouseEnter={() => setSelectedIdx(i)}
                >
                  {/* Thumbnail */}
                  <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-secondary">
                    {item.image && item.image.startsWith('http') ? (
                      <img src={item.image} alt="" className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm">🍽️</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-heading text-sm font-semibold text-foreground truncate">
                      {lang === 'bn' ? item.name : item.nameEn}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate font-body">
                      {lang === 'bn' ? item.description : item.descriptionEn}
                    </p>
                  </div>
                  {/* Category Badge */}
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-accent font-medium border flex-shrink-0"
                    style={{
                      background: 'hsl(var(--gold) / 0.08)',
                      borderColor: 'hsl(var(--gold) / 0.2)',
                      color: 'hsl(var(--gold))',
                    }}
                  >
                    {categoryLabels[item.category]?.[lang] || item.category}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* No Results */}
          {query.trim() && results.length === 0 && (
            <div className="p-6 text-center">
              <p className="text-muted-foreground text-sm font-body">
                {t('কোনো ফলাফল পাওয়া যায়নি', 'No results found')}
              </p>
              <p className="text-[11px] text-muted-foreground/70 mt-1 font-accent">
                {t('অন্য কিছু খুঁজে দেখুন', 'Try a different search term')}
              </p>
            </div>
          )}

          {/* Recent Searches */}
          {!query.trim() && recentSearches.length > 0 && (
            <div className="p-3 border-b border-border/30">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-[10px] font-accent uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  {t('সাম্প্রতিক', 'Recent')}
                </span>
                <button onClick={clearRecent} className="text-[10px] font-accent text-muted-foreground hover:text-foreground transition-colors">
                  {t('মুছুন', 'Clear')}
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {recentSearches.map((term, i) => (
                  <button
                    key={i}
                    onClick={() => { setQuery(term); onSearch(term); }}
                    className="px-3 py-1 rounded-full text-xs font-body bg-secondary/60 text-foreground hover:bg-secondary transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Items */}
          {!query.trim() && popularItems.length > 0 && (
            <div className="p-3">
              <span className="text-[10px] font-accent uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 px-1 mb-2">
                <TrendingUp className="w-3 h-3" />
                {t('জনপ্রিয়', 'Popular')}
              </span>
              {popularItems.map((item, i) => (
                <button
                  key={item.id}
                  onClick={() => goToItem(item)}
                  className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-secondary/60 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-secondary">
                    {item.image && item.image.startsWith('http') ? (
                      <img src={item.image} alt="" className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs">🍽️</div>
                    )}
                  </div>
                  <span className="font-heading text-sm text-foreground truncate">
                    {lang === 'bn' ? item.name : item.nameEn}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SmartSearch;
