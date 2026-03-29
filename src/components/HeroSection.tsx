import { useLanguage } from '@/contexts/LanguageContext';
import heroBg from '@/assets/hero-bg.jpg';

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <img
        src={heroBg}
        alt="Traditional Bengali meal"
        className="absolute inset-0 w-full h-full object-cover scale-105"
        style={{ filter: 'blur(1px)' }}
        width={1920}
        height={1080}
      />
      {/* Multi-layer overlay — strong dark for readability */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.8) 75%, hsl(var(--background) / 0.98) 100%)'
      }} />
      {/* Decorative gold line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/10 backdrop-blur-md mb-8 animate-fade-up">
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          <span className="font-accent text-xs tracking-[0.2em] uppercase" style={{ color: 'hsl(43, 72%, 70%)' }}>
            {t('বাংলাদেশের ঐতিহ্যবাহী খাদ্য সংস্কৃতি', 'Traditional Food Culture of Bangladesh')}
          </span>
        </div>

        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight animate-fade-up" style={{ color: 'hsl(40, 33%, 96%)', animationDelay: '0.1s' }}>
          {t('মাছে ভাতে বাঙ্গালী', 'Fish & Rice — The Bengali Way')}
        </h1>

        <p className="font-heading text-lg sm:text-xl md:text-2xl mb-3 animate-fade-up" style={{ color: 'hsl(43, 72%, 70%)', animationDelay: '0.2s' }}>
          {t('বাংলার স্বাদ, সংস্কৃতি ও ঐতিহ্য', 'Taste, Culture & Heritage of Bengal')}
        </p>

        <p className="font-body text-base md:text-lg max-w-2xl mx-auto mb-10 animate-fade-up" style={{ color: 'hsl(40, 20%, 75%)', animationDelay: '0.3s' }}>
          {t(
            'বাংলাদেশের সকল প্রকার মাছ, চাল ও ভাতের পদের বিস্তারিত তথ্য, উচ্চমানের ছবি এবং ঐতিহ্যবাহী রেসিপি — এক জায়গায়',
            'Comprehensive guide to all fish and rice varieties of Bangladesh — in one place'
          )}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <a
            href="#explore"
            className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-body font-semibold text-base transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, hsl(43, 72%, 55%), hsl(43, 72%, 45%))',
              color: 'hsl(30, 10%, 10%)',
              boxShadow: '0 8px 32px hsl(43, 72%, 55% / 0.3)',
            }}
          >
            {t('অন্বেষণ শুরু করুন', 'Start Exploring')}
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
          <a
            href="#games"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-body font-medium text-sm border transition-all duration-300 hover:scale-105 backdrop-blur-md"
            style={{
              borderColor: 'hsl(40, 25%, 80% / 0.3)',
              color: 'hsl(40, 25%, 85%)',
            }}
          >
            🎮 {t('খেলতে খেলতে জানুন', 'Learn While Playing')}
          </a>
        </div>

        {/* Stats */}
        <div className="mt-14 grid grid-cols-3 gap-4 max-w-md mx-auto animate-fade-up" style={{ animationDelay: '0.5s' }}>
          {[
            { num: '১০+', label: t('প্রকার চাল', 'Rice Types') },
            { num: '১৬+', label: t('প্রকার মাছ', 'Fish Types') },
            { num: '৬+', label: t('ভাতের পদ', 'Rice Dishes') },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="font-heading text-2xl sm:text-3xl font-bold" style={{ color: 'hsl(43, 72%, 65%)' }}>{stat.num}</p>
              <p className="font-body text-xs" style={{ color: 'hsl(40, 20%, 65%)' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
