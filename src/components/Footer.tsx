import { useLanguage } from '@/contexts/LanguageContext';
import { Heart, ExternalLink } from 'lucide-react';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="relative overflow-hidden">
      {/* Glass gradient background */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-background to-background" />
      <div className="absolute inset-0 backdrop-blur-sm" />
      
      <div className="relative border-t border-border/50 py-10">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <p className="font-heading text-2xl font-bold gold-accent">
              মাছে ভাতে বাঙ্গালী
            </p>
            <p className="text-sm text-muted-foreground font-body max-w-md mx-auto">
              {t(
                'বাংলাদেশের চাল, ভাত ও মাছের সম্পূর্ণ ডিজিটাল সংগ্রহশালা',
                'Complete digital archive of Bangladeshi rice, rice dishes & fish culture'
              )}
            </p>

            <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground font-body">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-destructive fill-destructive animate-pulse" />
              <span>by</span>
              <a
                href="https://mdnasrullah.pro.bd"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold gold-accent hover:underline inline-flex items-center gap-1 transition-colors"
              >
                Md Nasrullah
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="pt-4 border-t border-border/30">
              <p className="text-xs text-muted-foreground/60 font-body">
                © {new Date().getFullYear()} মাছে ভাতে বাঙ্গালী.পাতা.বিডি — {t('সর্বস্বত্ব সংরক্ষিত', 'All rights reserved')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
