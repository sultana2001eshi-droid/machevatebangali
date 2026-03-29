import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { ExternalLink } from 'lucide-react';
import profileImg from '@/assets/md-nasrullah-profile.jpg';

const About = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearch={() => {}} />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-8 text-center">
            {t('আমাদের সম্পর্কে', 'About Us')}
          </h1>

          <div className="space-y-8">
            <div className="glass-card p-8">
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4 gold-accent">
                {t('আমাদের উদ্দেশ্য', 'Our Purpose')}
              </h2>
              <p className="font-body text-muted-foreground leading-relaxed text-lg">
                {t(
                  '"মাছে ভাতে বাঙ্গালী" — এই চিরন্তন প্রবাদের মধ্যে লুকিয়ে আছে বাঙালি জাতির হাজার বছরের খাদ্য সংস্কৃতি। বাংলাদেশের নদী-নালা, খাল-বিল, হাওর-বাঁওড় থেকে আসা তাজা মাছ আর উর্বর পলিমাটিতে ফলানো সোনালি ধানের চাল — এই দুইয়ের অনন্য সমন্বয়ই বাঙালির পরিচয়। এই ওয়েবসাইটটি বাংলাদেশের সমস্ত প্রকার চাল, ভাতের পদ এবং মাছের এক সম্পূর্ণ ডিজিটাল সংগ্রহশালা।',
                  '"Mache Bhate Bangali" — hidden within this eternal proverb lies thousands of years of Bengali food culture. Fresh fish from rivers, canals, haors and baors, and golden rice from fertile alluvial soil — this unique combination defines Bengali identity. This website is a complete digital archive of all rice types, rice dishes and fish of Bangladesh.'
                )}
              </p>
            </div>

            {/* Developer Card with Profile Image */}
            <div className="glass-card p-8 border-gold/20">
              <h2 className="font-heading text-2xl font-bold text-foreground mb-6 gold-accent">
                {t('নির্মাতা সম্পর্কে', 'About the Creator')}
              </h2>
              <div className="flex flex-col items-center text-center mb-6">
                <img
                  src={profileImg}
                  alt="Md Nasrullah"
                  className="w-28 h-28 rounded-full object-cover border-2 mb-4"
                  style={{
                    borderColor: 'hsl(43, 72%, 55% / 0.5)',
                    boxShadow: '0 8px 32px hsl(43, 72%, 55% / 0.15)',
                  }}
                  loading="lazy"
                />
                <h3 className="font-heading text-xl font-bold text-foreground">Md Nasrullah</h3>
                <p className="font-body text-sm text-muted-foreground mt-1">
                  English Honours, BM College, Barishal
                </p>
                <a
                  href="https://mdnasrullah.pro.bd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-2 font-accent text-xs tracking-wider transition-colors duration-300 hover:opacity-80"
                  style={{ color: 'hsl(43, 72%, 60%)' }}
                >
                  mdnasrullah.pro.bd <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="font-body text-muted-foreground leading-relaxed text-base">
                {t(
                  'এই ওয়েবসাইটটি তৈরি করেছেন মোঃ নাসরুল্লাহ, যিনি বিএম কলেজ, বরিশাল থেকে ইংরেজি অনার্সে অধ্যয়নরত। বাংলাদেশের সমৃদ্ধ খাদ্য ঐতিহ্যকে ডিজিটাল প্ল্যাটফর্মে সংরক্ষণ করার মহৎ লক্ষ্যেই এই উদ্যোগ। প্রতিটি তথ্য যত্নসহকারে সংগ্রহ ও উপস্থাপন করা হয়েছে যাতে বর্তমান ও ভবিষ্যৎ প্রজন্ম বাংলাদেশের খাদ্য সংস্কৃতি সম্পর্কে জানতে পারে।',
                  'This website was created by Md Nasrullah, who is studying English Honours at BM College, Barishal. This initiative was born from a noble goal of preserving Bangladesh\'s rich food heritage on a digital platform. Every piece of information has been carefully collected and presented so that current and future generations can learn about Bangladesh\'s food culture.'
                )}
              </p>
            </div>

            <div className="glass-card p-8">
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4 gold-accent">
                {t('আমরা কী প্রদান করি', 'What We Offer')}
              </h2>
              <ul className="space-y-3 font-body text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">🌾</span>
                  <span>{t('বাংলাদেশের সকল প্রকার চালের বিস্তারিত তথ্য ও ছবি', 'Detailed information and images of all rice types in Bangladesh')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">🍚</span>
                  <span>{t('ঐতিহ্যবাহী ভাতের পদের রেসিপি ও পুষ্টিগুণ', 'Traditional rice dish recipes and nutritional values')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">🐟</span>
                  <span>{t('নদী, সমুদ্র, পুকুর ও চাষের সকল মাছের তথ্য', 'Information about all fish from rivers, seas, ponds and farms')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">📸</span>
                  <span>{t('উচ্চমানের বাস্তবসম্মত ছবি', 'High-quality realistic images')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
