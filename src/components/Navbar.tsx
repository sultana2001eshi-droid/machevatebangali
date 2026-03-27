import { useState } from 'react';
import { Menu, X, Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

interface NavbarProps {
  onSearch: (query: string) => void;
}

const Navbar = ({ onSearch }: NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { lang, setLang, t } = useLanguage();
  const { isDark, toggleDark } = useTheme();

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  return (
    <>
      <nav className="glass-nav fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(true)}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
            aria-label="Menu"
          >
            <Menu className="w-6 h-6 text-foreground" />
          </button>

          {/* Site Name */}
          <h1 className="font-heading text-lg md:text-xl font-bold text-foreground text-center flex-1">
            <span className="gold-accent">মাছে ভাতে</span>{' '}
            <span>বাঙ্গালী</span>
          </h1>

          {/* Search toggle */}
          <button
            onClick={() => setSearchOpen(s => !s)}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="border-t border-border px-4 py-3 animate-fade-in">
            <input
              type="text"
              placeholder={t('মাছ বা ভাত খুঁজুন...', 'Search fish or rice...')}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-secondary text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary font-body"
              autoFocus
            />
          </div>
        )}
      </nav>

      {/* Side Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60]" onClick={() => setMenuOpen(false)}>
          <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" />
          <div
            className="absolute left-0 top-0 h-full w-72 bg-card shadow-2xl p-6 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-heading text-xl font-bold gold-accent">মেনু</h2>
              <button onClick={() => setMenuOpen(false)} className="p-1 hover:bg-secondary rounded-lg transition-colors">
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>

            <div className="space-y-4 font-body">
              <a href="#about" onClick={() => setMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-secondary transition-colors text-foreground">
                {t('আমাদের সম্পর্কে', 'About')}
              </a>
              <a href="#gallery" onClick={() => setMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-secondary transition-colors text-foreground">
                {t('গ্যালারি', 'Gallery')}
              </a>

              {/* Divider */}
              <div className="border-t border-border my-4" />
              <p className="text-sm text-muted-foreground font-accent uppercase tracking-wider">{t('সেটিংস', 'Settings')}</p>

              {/* Dark Mode */}
              <div className="flex items-center justify-between py-2 px-3">
                <span className="text-foreground">{t('ডার্ক মোড', 'Dark Mode')}</span>
                <button
                  onClick={toggleDark}
                  className={`w-12 h-6 rounded-full transition-colors relative ${isDark ? 'bg-primary' : 'bg-border'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-card shadow transition-transform ${isDark ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>

              {/* Language */}
              <div className="flex items-center justify-between py-2 px-3">
                <span className="text-foreground">{t('ভাষা', 'Language')}</span>
                <button
                  onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
                  className="px-3 py-1 rounded-lg bg-secondary text-sm font-medium text-secondary-foreground hover:bg-accent transition-colors"
                >
                  {lang === 'bn' ? 'English' : 'বাংলা'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
