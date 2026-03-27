export interface FoodItem {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  image: string;
  category: 'rice' | 'fish';
  subCategory: string;
  subCategoryEn: string;
  nutrition?: string;
  nutritionEn?: string;
  cookingMethod?: string;
  cookingMethodEn?: string;
}

export const riceDishes: FoodItem[] = [
  {
    id: 'sada-bhat',
    name: 'সাদা ভাত',
    nameEn: 'White Rice',
    description: 'বাঙালির প্রধান খাদ্য। গরম ভাতের সাথে ঘি, ডাল আর মাছের ঝোল — এটাই বাঙালির চিরন্তন আহার। সাদা ভাত রান্না করা সহজ হলেও এর স্বাদ ও গন্ধ অনন্য। চিকন চালের ভাত থেকে মোটা চালের ভাত — প্রতিটির আলাদা বৈশিষ্ট্য রয়েছে।',
    descriptionEn: 'The staple food of Bengal. Hot rice with ghee, dal and fish curry — this is the eternal Bengali meal.',
    image: 'white-rice',
    category: 'rice',
    subCategory: 'প্রধান ভাত',
    subCategoryEn: 'Main Rice',
    nutrition: 'প্রতি ১০০ গ্রামে: ক্যালোরি ১৩০, কার্বোহাইড্রেট ২৮ গ্রাম, প্রোটিন ২.৭ গ্রাম',
    nutritionEn: 'Per 100g: Calories 130, Carbs 28g, Protein 2.7g',
    cookingMethod: 'চাল ধুয়ে ১:২ অনুপাতে পানি দিয়ে জ্বাল দিন। ফুটে উঠলে আঁচ কমিয়ে ঢেকে রান্না করুন ১৫-২০ মিনিট।',
    cookingMethodEn: 'Wash rice and cook with 1:2 water ratio. Boil then simmer covered for 15-20 minutes.',
  },
  {
    id: 'polao',
    name: 'পোলাও',
    nameEn: 'Polao',
    description: 'সুগন্ধি চালে ঘি, দারুচিনি, এলাচ, লবঙ্গ দিয়ে রান্না করা বিশেষ ভাত। বিয়ে, ঈদ, পূজা — সব উৎসবেই পোলাও অপরিহার্য। বাসমতি বা চিনিগুড়া চালে তৈরি পোলাও অতুলনীয়।',
    descriptionEn: 'Aromatic rice cooked with ghee, cinnamon, cardamom and cloves. Essential at every Bengali celebration.',
    image: 'polao',
    category: 'rice',
    subCategory: 'উৎসবের ভাত',
    subCategoryEn: 'Festive Rice',
    nutrition: 'প্রতি ১০০ গ্রামে: ক্যালোরি ১৮৫, চর্বি ৬ গ্রাম, কার্বোহাইড্রেট ২৮ গ্রাম',
    nutritionEn: 'Per 100g: Calories 185, Fat 6g, Carbs 28g',
  },
  {
    id: 'khichuri',
    name: 'খিচুড়ি',
    nameEn: 'Khichuri',
    description: 'বর্ষার দিনে গরম খিচুড়ি আর ইলিশ ভাজা — বাঙালির স্বর্গীয় খাবার। চাল, ডাল, সবজি আর মশলা দিয়ে এক পাত্রে রান্না। সরষের তেল আর কাঁচা লঙ্কা দিয়ে পরিবেশন।',
    descriptionEn: 'Rainy day comfort food — rice, lentils and vegetables cooked together. Served with mustard oil and green chillies.',
    image: 'khichuri',
    category: 'rice',
    subCategory: 'ঐতিহ্যবাহী ভাত',
    subCategoryEn: 'Traditional Rice',
    nutrition: 'প্রতি ১০০ গ্রামে: ক্যালোরি ১৫০, প্রোটিন ৫ গ্রাম, ফাইবার ২ গ্রাম',
    nutritionEn: 'Per 100g: Calories 150, Protein 5g, Fiber 2g',
  },
  {
    id: 'biryani',
    name: 'বিরিয়ানি',
    nameEn: 'Biryani',
    description: 'মোগলাই ঐতিহ্যের সুগন্ধি ভাত। বাসমতি চাল, মাংস, জাফরান, কেওড়া জল দিয়ে ধীরে ধীরে দম দিয়ে রান্না। ঢাকাই বিরিয়ানির খ্যাতি বিশ্বজুড়ে।',
    descriptionEn: 'Mughlai heritage aromatic rice. Basmati rice slow-cooked with meat, saffron and kewra water.',
    image: 'biryani',
    category: 'rice',
    subCategory: 'উৎসবের ভাত',
    subCategoryEn: 'Festive Rice',
  },
];

export const fishItems: FoodItem[] = [
  {
    id: 'ilish',
    name: 'ইলিশ',
    nameEn: 'Hilsa',
    description: 'বাংলাদেশের জাতীয় মাছ। পদ্মা নদীর ইলিশের স্বাদ অতুলনীয়। সরষে ইলিশ, ভাপা ইলিশ, ইলিশ পাতুরি — প্রতিটি রেসিপি বাঙালির গর্ব। চাঁদপুরের ইলিশ সবচেয়ে বিখ্যাত।',
    descriptionEn: 'National fish of Bangladesh. Padma river Hilsa is unmatched in taste. Every recipe is a Bengali pride.',
    image: 'ilish',
    category: 'fish',
    subCategory: 'নদীর মাছ',
    subCategoryEn: 'River Fish',
    nutrition: 'প্রতি ১০০ গ্রামে: ক্যালোরি ২৭৩, প্রোটিন ২২ গ্রাম, ওমেগা-৩ ফ্যাটি এসিড সমৃদ্ধ',
    nutritionEn: 'Per 100g: Calories 273, Protein 22g, Rich in Omega-3 fatty acids',
    cookingMethod: 'সরষে বাটা, হলুদ, লঙ্কা বাটা, সরষের তেল দিয়ে মাখিয়ে কলাপাতায় মুড়ে ভাপে রান্না করুন।',
    cookingMethodEn: 'Marinate with mustard paste, turmeric, chilli paste, mustard oil. Wrap in banana leaf and steam.',
  },
  {
    id: 'rui',
    name: 'রুই',
    nameEn: 'Rohu',
    description: 'বাংলাদেশের সবচেয়ে জনপ্রিয় মিঠা পানির মাছ। রুই মাছের কালিয়া, দোপেঁয়াজা, ঝোল — সবই অসাধারণ। বড় আকারের রুই মাছ উৎসবে বিশেষ সমাদৃত।',
    descriptionEn: 'The most popular freshwater fish in Bangladesh. Rohu curry, dopeyaja, jhol — all extraordinary.',
    image: 'rui',
    category: 'fish',
    subCategory: 'নদীর মাছ',
    subCategoryEn: 'River Fish',
    nutrition: 'প্রতি ১০০ গ্রামে: ক্যালোরি ৯৭, প্রোটিন ১৭ গ্রাম, চর্বি ১.৪ গ্রাম',
    nutritionEn: 'Per 100g: Calories 97, Protein 17g, Fat 1.4g',
  },
  {
    id: 'katla',
    name: 'কাতলা',
    nameEn: 'Catla',
    description: 'বড় আকারের মিঠা পানির মাছ। কাতলা মাছের মাথার ঝোল বাঙালির বিশেষ পছন্দ। পুষ্টিগুণে সমৃদ্ধ এই মাছ সারা বছরই পাওয়া যায়।',
    descriptionEn: 'Large freshwater fish. Catla fish head curry is a Bengali favorite. Nutritionally rich and available year-round.',
    image: 'katla',
    category: 'fish',
    subCategory: 'নদীর মাছ',
    subCategoryEn: 'River Fish',
    nutrition: 'প্রতি ১০০ গ্রামে: ক্যালোরি ১১০, প্রোটিন ১৮ গ্রাম, ক্যালসিয়াম সমৃদ্ধ',
    nutritionEn: 'Per 100g: Calories 110, Protein 18g, Rich in Calcium',
  },
  {
    id: 'pabda',
    name: 'পাবদা',
    nameEn: 'Pabda',
    description: 'ছোট আকারের সুস্বাদু মাছ। পাবদা মাছের ঝোল, ভুনা বা ভাজি — সবই মুখরোচক। কম কাঁটা থাকায় শিশুদের জন্য আদর্শ মাছ।',
    descriptionEn: 'Small delicious catfish. Pabda curry, bhuna or fry — all delightful. Ideal for children due to fewer bones.',
    image: 'pabda',
    category: 'fish',
    subCategory: 'ছোট মাছ',
    subCategoryEn: 'Small Fish',
    nutrition: 'প্রতি ১০০ গ্রামে: ক্যালোরি ৯৬, প্রোটিন ১৫ গ্রাম, আয়রন সমৃদ্ধ',
    nutritionEn: 'Per 100g: Calories 96, Protein 15g, Rich in Iron',
  },
  {
    id: 'boal',
    name: 'বোয়াল',
    nameEn: 'Boal',
    description: 'বড় আকারের শিকারি মাছ। বোয়াল মাছের ভুনা বা কালিয়া অত্যন্ত সুস্বাদু। হাওর ও বিলে প্রচুর পাওয়া যায়। মাংসল ও কম কাঁটাযুক্ত।',
    descriptionEn: 'Large predatory fish. Boal bhuna or kalia is extremely delicious. Found in haors and beels.',
    image: 'boal',
    category: 'fish',
    subCategory: 'নদীর মাছ',
    subCategoryEn: 'River Fish',
  },
  {
    id: 'chingri',
    name: 'চিংড়ি',
    nameEn: 'Prawn',
    description: 'গলদা ও বাগদা চিংড়ি বাংলাদেশের রপ্তানি পণ্য। চিংড়ি মালাইকারি, ভুনা চিংড়ি, চিংড়ি বিরিয়ানি — প্রতিটি রেসিপি অসামান্য। খুলনা-সাতক্ষীরার চিংড়ি বিশ্বখ্যাত।',
    descriptionEn: 'Golda and Bagda prawns are Bangladesh\'s export pride. Prawn malai curry, bhuna, biryani — each recipe is exceptional.',
    image: 'chingri',
    category: 'fish',
    subCategory: 'সামুদ্রিক মাছ',
    subCategoryEn: 'Sea Fish',
    nutrition: 'প্রতি ১০০ গ্রামে: ক্যালোরি ৮৫, প্রোটিন ২০ গ্রাম, সেলেনিয়াম সমৃদ্ধ',
    nutritionEn: 'Per 100g: Calories 85, Protein 20g, Rich in Selenium',
  },
];

export const categories = {
  bn: [
    { id: 'all', label: 'সবকিছু' },
    { id: 'rice', label: 'চালের ভাত' },
    { id: 'fish', label: 'মাছ' },
    { id: 'river', label: 'নদীর মাছ' },
    { id: 'sea', label: 'সামুদ্রিক মাছ' },
    { id: 'small', label: 'ছোট মাছ' },
  ],
  en: [
    { id: 'all', label: 'All' },
    { id: 'rice', label: 'Rice Dishes' },
    { id: 'fish', label: 'Fish' },
    { id: 'river', label: 'River Fish' },
    { id: 'sea', label: 'Sea Fish' },
    { id: 'small', label: 'Small Fish' },
  ],
};
