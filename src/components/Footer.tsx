import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="py-8 border-t border-border">
      <div className="container mx-auto px-4 text-center">
        <p className="font-heading text-lg font-semibold gold-accent mb-2">
          মাছে ভাতে বাঙ্গালী
        </p>
        <p className="text-sm text-muted-foreground font-body mb-4">
          {t('বাংলাদেশের মাছ ও ভাতের সম্পূর্ণ গাইড', 'Complete guide to Bangladeshi fish & rice culture')}
        </p>
        <a
          href="https://mdnasrullah.pro.bd"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-accent text-muted-foreground hover:text-foreground transition-colors"
        >
          App made by <span className="font-semibold gold-accent">Md Nasrullah</span>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
