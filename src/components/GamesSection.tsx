import { useLanguage } from '@/contexts/LanguageContext';
import RiceRunnerGame from './games/RiceRunnerGame';
import DiningTableGame from './games/DiningTableGame';
import FishingGame from './games/FishingGame';

const GamesSection = () => {
  const { t } = useLanguage();

  return (
    <section id="games" className="py-16 bg-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="section-heading">
            🎮 {t('খেলতে খেলতে জানুন', 'Learn While Playing')}
          </h2>
          <p className="section-subheading">
            {t('মজার ইন্টারঅ্যাক্টিভ গেমের মাধ্যমে বাংলাদেশের চাল ও মাছ সম্পর্কে জানুন', 'Discover rice & fish of Bangladesh through fun interactive games')}
          </p>
        </div>

        <div className="space-y-8 max-w-4xl mx-auto">
          <RiceRunnerGame />
          <DiningTableGame />
          <FishingGame />
        </div>
      </div>
    </section>
  );
};

export default GamesSection;
