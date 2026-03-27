import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

const Terms = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearch={() => {}} />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-8 text-center">
            {t('শর্তাবলী', 'Terms & Conditions')}
          </h1>

          <div className="space-y-6">
            <div className="glass-card p-8">
              <h2 className="font-heading text-xl font-bold text-foreground mb-3 gold-accent">
                {t('১. বিষয়বস্তু ব্যবহার নীতি', '1. Content Usage Policy')}
              </h2>
              <p className="font-body text-muted-foreground leading-relaxed">
                {t(
                  'এই ওয়েবসাইটের সকল বিষয়বস্তু শুধুমাত্র শিক্ষামূলক ও তথ্যমূলক উদ্দেশ্যে প্রকাশিত। ব্যক্তিগত ব্যবহারের জন্য তথ্য সংগ্রহ করা যাবে, তবে বাণিজ্যিক উদ্দেশ্যে পুনঃপ্রকাশ বা বিতরণ সম্পূর্ণ নিষিদ্ধ।',
                  'All content on this website is published solely for educational and informational purposes. Information may be collected for personal use, but republication or distribution for commercial purposes is strictly prohibited.'
                )}
              </p>
            </div>

            <div className="glass-card p-8">
              <h2 className="font-heading text-xl font-bold text-foreground mb-3 gold-accent">
                {t('২. ছবি ব্যবহার দাবিত্যাগ', '2. Image Usage Disclaimer')}
              </h2>
              <p className="font-body text-muted-foreground leading-relaxed">
                {t(
                  'এই ওয়েবসাইটে ব্যবহৃত কিছু ছবি এআই প্রযুক্তির মাধ্যমে তৈরি এবং কিছু ছবি বিভিন্ন উৎস থেকে সংগৃহীত। ছবিগুলো শুধুমাত্র প্রদর্শনের উদ্দেশ্যে ব্যবহৃত। কোনো ছবির কপিরাইট লঙ্ঘন হলে অনুগ্রহ করে আমাদের সাথে যোগাযোগ করুন।',
                  'Some images on this website are generated using AI technology and some are collected from various sources. Images are used for display purposes only. If any image copyright is violated, please contact us.'
                )}
              </p>
            </div>

            <div className="glass-card p-8">
              <h2 className="font-heading text-xl font-bold text-foreground mb-3 gold-accent">
                {t('৩. শিক্ষামূলক উদ্দেশ্য', '3. Educational Purpose')}
              </h2>
              <p className="font-body text-muted-foreground leading-relaxed">
                {t(
                  'এই ওয়েবসাইটটি সম্পূর্ণরূপে শিক্ষামূলক উদ্দেশ্যে তৈরি। বাংলাদেশের খাদ্য সংস্কৃতি, ঐতিহ্য ও জ্ঞান সংরক্ষণ ও প্রচারই এর মূল লক্ষ্য।',
                  'This website is created entirely for educational purposes. Its main goal is to preserve and promote Bangladesh\'s food culture, heritage and knowledge.'
                )}
              </p>
            </div>

            <div className="glass-card p-8">
              <h2 className="font-heading text-xl font-bold text-foreground mb-3 gold-accent">
                {t('৪. দায়মুক্তি ধারা', '4. No Liability Clause')}
              </h2>
              <p className="font-body text-muted-foreground leading-relaxed">
                {t(
                  'এই ওয়েবসাইটে প্রদত্ত তথ্য যথাসম্ভব সঠিক রাখার চেষ্টা করা হয়েছে। তবে কোনো তথ্যের ভুল বা অসম্পূর্ণতার জন্য ওয়েবসাইট কর্তৃপক্ষ দায়ী থাকবে না। পুষ্টি ও স্বাস্থ্য সম্পর্কিত তথ্যের জন্য বিশেষজ্ঞের পরামর্শ নিন।',
                  'Every effort has been made to keep the information on this website as accurate as possible. However, the website authority shall not be liable for any errors or incompleteness. Consult a specialist for nutrition and health information.'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Terms;
