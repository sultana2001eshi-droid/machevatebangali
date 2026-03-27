import { useLanguage } from '@/contexts/LanguageContext';
import whiteRice from '@/assets/white-rice.jpg';
import polao from '@/assets/polao.jpg';
import khichuri from '@/assets/khichuri.jpg';
import biryani from '@/assets/biryani.jpg';
import ilish from '@/assets/ilish.jpg';
import rui from '@/assets/rui.jpg';
import katla from '@/assets/katla.jpg';
import chingri from '@/assets/chingri.jpg';

const galleryImages = [
  { src: ilish, label: 'ইলিশ', labelEn: 'Hilsa' },
  { src: polao, label: 'পোলাও', labelEn: 'Polao' },
  { src: chingri, label: 'চিংড়ি', labelEn: 'Prawn' },
  { src: khichuri, label: 'খিচুড়ি', labelEn: 'Khichuri' },
  { src: rui, label: 'রুই', labelEn: 'Rohu' },
  { src: biryani, label: 'বিরিয়ানি', labelEn: 'Biryani' },
  { src: katla, label: 'কাতলা', labelEn: 'Catla' },
  { src: whiteRice, label: 'সাদা ভাত', labelEn: 'White Rice' },
];

const ImageGallery = () => {
  const { lang, t } = useLanguage();

  return (
    <section id="gallery" className="py-16 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="section-heading">{t('🖼️ ছবির গ্যালারি', '🖼️ Image Gallery')}</h2>
          <p className="section-subheading">{t('বাংলার খাবারের সৌন্দর্য', 'The beauty of Bengali cuisine')}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {galleryImages.map((img, i) => (
            <div
              key={i}
              className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer"
            >
              <img
                src={img.src}
                alt={lang === 'bn' ? img.label : img.labelEn}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
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
