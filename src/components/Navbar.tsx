import { useState } from 'react';
import { Menu, X, Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  onSearch: (query: string) => void;
}

const Navbar = ({ onSearch }: NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { lang, setLang, t } = useLanguage();
  const { isDark, toggleDark } = useTheme();
  const navigate = useNavigate();

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const handleNav = (path: string) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <>
      <nav className="glass-nav fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <button
            onClick={() => setMenuOpen(true)}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
            aria-label="Menu"
          >
            <Menu className="w-6 h-6 text-foreground" />
          </button>

          <h1
            className="font-heading text-lg md:text-xl font-bold text-foreground text-center flex-1 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <span className="gold-accent">মাছে ভাতে</span>{' '}
            <span>বাঙ্গালী</span>
          </h1>

          <button
            onClick={() => setSearchOpen(s => !s)}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {searchOpen && (
          <div className="border-t border-border/50 px-4 py-3 animate-fade-in">
            <input
              type="text"
              placeholder={t('মাছ বা ভাত খুঁজুন...', 'Search fish or rice...')}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-secondary text-foreground placeholder:text-muted-foreground border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary font-body"
              autoFocus
            />
          </div>
        )}
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-[60]" onClick={() => setMenuOpen(false)}>
          <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" />
          <div
            className="absolute left-0 top-0 h-full w-72 bg-card/95 backdrop-blur-xl shadow-2xl p-6 animate-fade-in border-r border-border/30"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-heading text-xl font-bold gold-accent">মেনু</h2>
              <button onClick={() => setMenuOpen(false)} className="p-1 hover:bg-secondary rounded-lg transition-colors">
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>

            <div className="space-y-2 font-body">
              <button onClick={() => handleNav('/')} className="block w-full text-left py-2.5 px-3 rounded-lg hover:bg-secondary transition-colors text-foreground">
                {t('🏠 হোম', '🏠 Home')}
              </button>
              <button onClick={() => handleNav('/about')} className="block w-full text-left py-2.5 px-3 rounded-lg hover:bg-secondary transition-colors text-foreground">
                {t('📖 আমাদের সম্পর্কে', '📖 About')}
              </button>
              <button onClick={() => handleNav('/terms')} className="block w-full text-left py-2.5 px-3 rounded-lg hover:bg-secondary transition-colors text-foreground">
                {t('📜 শর্তাবলী', '📜 Terms & Conditions')}
              </button>

              <div className="border-t border-border/50 my-4" />
              <p className="text-sm text-muted-foreground font-accent uppercase tracking-wider px-3">{t('⚙️ সেটিংস', '⚙️ Settings')}</p>

              <div className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-secondary/50 transition-colors">
                <span className="text-foreground">{t('🌙 ডার্ক মোড', '🌙 Dark Mode')}</span>
                <button
                  onClick={toggleDark}
                  className={`w-12 h-6 rounded-full transition-colors relative ${isDark ? 'bg-primary' : 'bg-border'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-card shadow transition-transform ${isDark ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-secondary/50 transition-colors">
                <span className="text-foreground">{t('🌐 ভাষা', '🌐 Language')}</span>
                <button
                  onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
                  className="px-3 py-1 rounded-lg bg-secondary text-sm font-medium text-secondary-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
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
