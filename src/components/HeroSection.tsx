import { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useItems, dbItemToFoodItem } from '@/hooks/useItems';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';
import heroBg from '@/assets/hero-bg.jpg';

interface HeroImage {
  id: string;
  image_url: string;
  display_order: number;
}

const StatCard = ({ target, labelBn, labelEn }: { target: number; labelBn: string; labelEn: string }) => {
  const { t } = useLanguage();
  const { count, ref } = useAnimatedCounter(target);

  // Convert to Bengali numerals
  const toBengali = (n: number) =>
    String(n).replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[parseInt(d)]);

  return (
    <div ref={ref} className="text-center relative group">
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{ background: 'radial-gradient(circle, hsl(var(--gold) / 0.06) 0%, transparent 70%)' }}
      />
      <p className="font-heading text-3xl sm:text-4xl font-bold tabular-nums tracking-tight"
        style={{
          color: 'hsl(43, 72%, 65%)',
          textShadow: '0 2px 12px rgba(212, 175, 55, 0.2)',
        }}
      >
        {toBengali(count)}+
      </p>
      <p className="font-accent text-[10px] sm:text-xs mt-1 tracking-wide"
        style={{ color: 'hsl(40, 20%, 65%)' }}
      >
        {t(labelBn, labelEn)}
      </p>
    </div>
  );
};

const HeroSection = () => {
  const { t } = useLanguage();
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { data: dbItems } = useItems();

  // Compute live counts from CMS
  const counts = useMemo(() => {
    if (!dbItems) return { rice: 0, fish: 0, dish: 0 };
    const items = dbItems.map(dbItemToFoodItem);
    return {
      rice: items.filter(i => i.category === 'rice-type').length,
      fish: items.filter(i => i.category === 'fish').length,
      dish: items.filter(i => i.category === 'rice-dish').length,
    };
  }, [dbItems]);

  // Fetch hero images from DB
  useEffect(() => {
    const fetchHeroImages = async () => {
      const { data } = await supabase
        .from('hero_images')
        .select('*')
        .order('display_order', { ascending: true });
      if (data && data.length > 0) {
        setHeroImages(data);
      }
    };
    fetchHeroImages();
  }, []);

  // Images to display: DB images or fallback to static hero
  const slides = useMemo(() => {
    if (heroImages.length > 0) return heroImages.map(h => h.image_url);
    return [heroBg];
  }, [heroImages]);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="relative min-h-[90vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background slides with Ken Burns */}
      {slides.map((src, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === currentIndex ? 1 : 0 }}
        >
          <img
            src={src}
            alt={`Hero slide ${i + 1}`}
            className={`absolute inset-0 w-full h-full object-cover ${i === currentIndex ? 'animate-ken-burns' : ''}`}
            width={1920}
            height={1080}
          />
        </div>
      ))}

      {/* Multi-layer dark gradient overlay */}
      <div className="absolute inset-0" style={{
        background: `
          linear-gradient(180deg, 
            rgba(0,0,0,0.55) 0%, 
            rgba(0,0,0,0.65) 40%, 
            rgba(0,0,0,0.75) 70%, 
            hsl(var(--background) / 0.98) 100%
          )
        `
      }} />

      {/* Subtle vignette */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.3) 100%)'
      }} />

      {/* Decorative gold line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      {/* Slide indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => { setCurrentIndex(i); }}
              className={`h-1.5 rounded-full transition-all duration-500 ${i === currentIndex ? 'w-8 bg-gold' : 'w-1.5 bg-white/30'}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/10 backdrop-blur-md mb-8 animate-fade-up">
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          <span className="font-accent text-xs tracking-[0.2em] uppercase" style={{ color: 'hsl(43, 72%, 70%)' }}>
            {t('বাংলাদেশের ঐতিহ্যবাহী খাদ্য সংস্কৃতি', 'Traditional Food Culture of Bangladesh')}
          </span>
        </div>

        <h1
          className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight animate-fade-up"
          style={{
            color: 'hsl(40, 33%, 96%)',
            animationDelay: '0.1s',
            textShadow: '0 4px 24px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.3)',
          }}
        >
          {t('মাছে ভাতে বাঙ্গালী', 'Fish & Rice — The Bengali Way')}
        </h1>

        <p
          className="font-heading text-lg sm:text-xl md:text-2xl mb-3 animate-fade-up"
          style={{
            color: 'hsl(43, 72%, 70%)',
            animationDelay: '0.2s',
            textShadow: '0 2px 12px rgba(0,0,0,0.4)',
          }}
        >
          {t('বাংলার স্বাদ, সংস্কৃতি ও ঐতিহ্য', 'Taste, Culture & Heritage of Bengal')}
        </p>

        <p
          className="font-body text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-10 animate-fade-up"
          style={{
            color: 'hsl(40, 20%, 75%)',
            animationDelay: '0.3s',
            textShadow: '0 1px 8px rgba(0,0,0,0.3)',
          }}
        >
          {t(
            'বাংলাদেশের সকল প্রকার মাছ, চাল ও ভাতের পদের বিস্তারিত তথ্য, উচ্চমানের ছবি এবং ঐতিহ্যবাহী রেসিপি — এক জায়গায়',
            'Comprehensive guide to all fish and rice varieties of Bangladesh — in one place'
          )}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <a
            href="#explore"
            className="hero-btn-primary group inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-body font-semibold text-base transition-all duration-300"
          >
            {t('অন্বেষণ শুরু করুন', 'Start Exploring')}
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
          <a
            href="#games"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-body font-medium text-sm border transition-all duration-300 hover:scale-105 hover:bg-white/5 backdrop-blur-md"
            style={{ borderColor: 'hsl(40, 25%, 80% / 0.3)', color: 'hsl(40, 25%, 85%)' }}
          >
            🎮 {t('খেলতে খেলতে জানুন', 'Learn While Playing')}
          </a>
        </div>

        {/* Dynamic Stats */}
        <div className="mt-14 grid grid-cols-3 gap-4 max-w-md mx-auto animate-fade-up" style={{ animationDelay: '0.5s' }}>
          <StatCard target={counts.rice} labelBn="প্রকার চাল" labelEn="Rice Types" />
          <StatCard target={counts.fish} labelBn="প্রকার মাছ" labelEn="Fish Types" />
          <StatCard target={counts.dish} labelBn="ভাতের পদ" labelEn="Rice Dishes" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
