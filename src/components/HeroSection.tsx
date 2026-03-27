import { useLanguage } from '@/contexts/LanguageContext';
import heroBg from '@/assets/hero-bg.jpg';

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <img
        src={heroBg}
        alt="Traditional Bengali meal"
        className="absolute inset-0 w-full h-full object-cover"
        width={1920}
        height={1080}
      />
      {/* Overlay */}
      <div className="absolute inset-0 gradient-hero" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto animate-fade-up">
        <p className="font-accent text-sm md:text-base tracking-[0.3em] uppercase mb-4" style={{ color: 'hsl(43, 72%, 65%)' }}>
          {t('বাংলাদেশের ঐতিহ্যবাহী খাদ্য সংস্কৃতি', 'Traditional Food Culture of Bangladesh')}
        </p>
        <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold mb-6" style={{ color: 'hsl(40, 33%, 96%)' }}>
          {t('মাছে ভাতে বাঙ্গালী', 'Fish & Rice — The Bengali Way')}
        </h1>
        <p className="font-body text-lg md:text-xl max-w-2xl mx-auto mb-8" style={{ color: 'hsl(40, 25%, 80%)' }}>
          {t(
            'বাংলাদেশের সকল প্রকার মাছ ও ভাতের বিস্তারিত তথ্য, ছবি ও রেসিপি — এক জায়গায়',
            'Comprehensive guide to all fish and rice varieties of Bangladesh — in one place'
          )}
        </p>
        <a
          href="#explore"
          className="inline-block px-8 py-3 rounded-full font-body font-semibold transition-all duration-300 hover:scale-105"
          style={{
            background: 'hsl(43, 72%, 55%)',
            color: 'hsl(30, 10%, 10%)',
          }}
        >
          {t('অন্বেষণ করুন', 'Explore Now')}
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
