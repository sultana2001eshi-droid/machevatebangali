import { useLanguage } from '@/contexts/LanguageContext';
import { Heart, ExternalLink, ArrowUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="relative overflow-hidden">
      {/* Solid dark background — no white bleed */}
      <div className="absolute inset-0 bg-[hsl(150,40%,5%)]" />
      {/* Gradient blend from page into footer */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, hsl(var(--background)) 0%, hsl(150 40% 6%) 8%, hsl(150 40% 5%) 100%)'
      }} />
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'1\' cy=\'1\' r=\'1\' fill=\'white\'/%3E%3C/svg%3E")',
        backgroundSize: '40px 40px',
      }} />
      {/* Gold top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

      <div className="relative pt-16 pb-8">
        <div className="container mx-auto px-6">
          {/* Main grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 mb-12">
            {/* Brand */}
            <div>
              <h3 className="font-heading text-2xl font-bold mb-3" style={{ color: 'hsl(43, 72%, 65%)' }}>
                মাছে ভাতে বাঙ্গালী
              </h3>
              <p className="font-body text-sm leading-relaxed" style={{ color: 'hsl(40, 20%, 55%)' }}>
                {t(
                  'বাংলাদেশের চাল, ভাত ও মাছের সম্পূর্ণ ডিজিটাল সংগ্রহশালা — বাংলার স্বাদ, সংস্কৃতি ও ঐতিহ্য এক জায়গায়।',
                  'Complete digital archive of Bangladeshi rice, rice dishes & fish culture.'
                )}
              </p>
            </div>

            {/* Quick links */}
            <div>
              <h4 className="font-accent text-xs tracking-[0.2em] uppercase mb-4" style={{ color: 'hsl(43, 72%, 60%)' }}>
                {t('দ্রুত লিংক', 'Quick Links')}
              </h4>
              <div className="space-y-3">
                {[
                  { label: t('হোম', 'Home'), path: '/' },
                  { label: t('আমাদের সম্পর্কে', 'About'), path: '/about' },
                  { label: t('শর্তাবলী', 'Terms'), path: '/terms' },
                ].map(link => (
                  <button
                    key={link.path}
                    onClick={() => navigate(link.path)}
                    className="block font-body text-sm transition-all duration-300 hover:translate-x-1.5 hover:text-gold"
                    style={{ color: 'hsl(40, 20%, 58%)' }}
                  >
                    → {link.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Creator */}
            <div>
              <h4 className="font-accent text-xs tracking-[0.2em] uppercase mb-4" style={{ color: 'hsl(43, 72%, 60%)' }}>
                {t('নির্মাতা', 'Creator')}
              </h4>
              <div className="space-y-1.5">
                <a
                  href="https://mdnasrullah.pro.bd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-heading text-base font-semibold inline-flex items-center gap-1.5 transition-colors duration-300 hover:opacity-80"
                  style={{ color: 'hsl(43, 72%, 65%)' }}
                >
                  Md Nasrullah <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <p className="font-body text-xs" style={{ color: 'hsl(40, 20%, 55%)' }}>Department of English</p>
                <p className="font-body text-xs" style={{ color: 'hsl(40, 20%, 50%)' }}>BM College, Barishal</p>
                <p className="font-body text-xs mt-2 italic" style={{ color: 'hsl(40, 20%, 45%)' }}>
                  {t('"বাংলার খাদ্য ঐতিহ্যকে ডিজিটালভাবে তুলে ধরাই আমার লক্ষ্য"', '"My goal is to digitally preserve Bengal\'s food heritage"')}
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent mb-6" />

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 font-body text-xs" style={{ color: 'hsl(40, 20%, 45%)' }}>
              <span>Made with</span>
              <Heart className="w-3 h-3 fill-destructive text-destructive" />
              <span>in Bangladesh</span>
            </div>
            <p className="font-body text-xs text-center" style={{ color: 'hsl(40, 20%, 40%)' }}>
              © {new Date().getFullYear()} মাছে ভাতে বাঙ্গালী — {t('সর্বস্বত্ব সংরক্ষিত', 'All rights reserved')}
            </p>
            <button
              onClick={scrollToTop}
              className="w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 hover:scale-110 hover:border-gold/50 hover:text-gold"
              style={{ borderColor: 'hsl(40, 20%, 25%)', color: 'hsl(40, 20%, 55%)' }}
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
