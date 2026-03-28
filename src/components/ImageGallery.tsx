import { useLanguage } from '@/contexts/LanguageContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import ilish from '@/assets/ilish.jpg';
import polao from '@/assets/polao.jpg';
import chingri from '@/assets/chingri.jpg';
import khichuri from '@/assets/khichuri.jpg';
import rui from '@/assets/rui.jpg';
import biryani from '@/assets/biryani.jpg';
import katla from '@/assets/katla.jpg';
import whiteRice from '@/assets/white-rice.jpg';
import kalijiraRice from '@/assets/kalijira-rice.jpg';
import lalChal from '@/assets/lal-chal.jpg';
import koi from '@/assets/koi.jpg';
import rupchanda from '@/assets/rupchanda.jpg';

const galleryImages = [
  { src: ilish, label: 'ইলিশ', labelEn: 'Hilsa' },
  { src: polao, label: 'পোলাও', labelEn: 'Polao' },
  { src: chingri, label: 'চিংড়ি', labelEn: 'Prawn' },
  { src: kalijiraRice, label: 'কালিজিরা চাল', labelEn: 'Kalijira Rice' },
  { src: rui, label: 'রুই', labelEn: 'Rohu' },
  { src: biryani, label: 'বিরিয়ানি', labelEn: 'Biryani' },
  { src: katla, label: 'কাতলা', labelEn: 'Catla' },
  { src: lalChal, label: 'লাল চাল', labelEn: 'Red Rice' },
  { src: khichuri, label: 'খিচুড়ি', labelEn: 'Khichuri' },
  { src: koi, label: 'কই', labelEn: 'Koi' },
  { src: rupchanda, label: 'রূপচান্দা', labelEn: 'Pomfret' },
  { src: whiteRice, label: 'সাদা ভাত', labelEn: 'White Rice' },
];

const ImageGallery = () => {
  const { lang, t } = useLanguage();
  const { ref, isVisible } = useScrollReveal<HTMLElement>(0.1);

  return (
    <section id="gallery" className="py-20 md:py-24 bg-secondary/30" ref={ref}>
      <div className="container mx-auto px-4 md:px-6">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="font-accent text-xs tracking-[0.2em] uppercase gold-accent mb-3">
            {t('গ্যালারি', 'Gallery')}
          </p>
          <h2 className="section-heading text-3xl md:text-5xl">{t('🖼️ ছবির গ্যালারি', '🖼️ Image Gallery')}</h2>
          <p className="section-subheading mt-3">{t('বাংলার খাবারের সৌন্দর্য', 'The beauty of Bengali cuisine')}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {galleryImages.map((img, i) => (
            <div
              key={i}
              className={`group relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${i * 0.05}s` }}
            >
              <img
                src={img.src}
                alt={lang === 'bn' ? img.label : img.labelEn}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="font-heading text-lg font-bold" style={{ color: 'hsl(40, 33%, 96%)' }}>
                  {lang === 'bn' ? img.label : img.labelEn}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImageGallery;
