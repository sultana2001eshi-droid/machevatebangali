import { useLanguage } from '@/contexts/LanguageContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import RiceRunnerGame from './games/RiceRunnerGame';
import DiningTableGame from './games/DiningTableGame';
import FishingGame from './games/FishingGame';

const GamesSection = () => {
  const { t } = useLanguage();
  const { ref, isVisible } = useScrollReveal<HTMLElement>(0.1);

  return (
    <section id="games" className="py-20 md:py-24 bg-cream" ref={ref}>
      <div className="container mx-auto px-4 md:px-6">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="font-accent text-xs tracking-[0.2em] uppercase gold-accent mb-3">
            {t('ইন্টারঅ্যাক্টিভ', 'Interactive')}
          </p>
          <h2 className="section-heading text-3xl md:text-5xl">
            🎮 {t('খেলতে খেলতে জানুন', 'Learn While Playing')}
          </h2>
          <p className="section-subheading mt-3">
            {t('মজার ইন্টারঅ্যাক্টিভ গেমের মাধ্যমে বাংলাদেশের চাল ও মাছ সম্পর্কে জানুন', 'Discover rice & fish of Bangladesh through fun interactive games')}
          </p>
        </div>

        <div className={`space-y-8 max-w-4xl mx-auto transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <RiceRunnerGame />
          <DiningTableGame />
          <FishingGame />
        </div>
      </div>
    </section>
  );
};

export default GamesSection;
