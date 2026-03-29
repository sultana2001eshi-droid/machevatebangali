export interface FoodItem {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  image: string;
  category: 'rice-type' | 'rice-dish' | 'fish';
  subCategory: string;
  subCategoryEn: string;
  nutrition?: string;
  nutritionEn?: string;
  cookingMethod?: string;
  cookingMethodEn?: string;
  origin?: string;
  originEn?: string;
  region?: string;
  regionEn?: string;
  culturalImportance?: string;
  culturalImportanceEn?: string;
  detailedDescription?: string;
  detailedDescriptionEn?: string;
  cookingSteps?: string[];
  cookingStepsEn?: string[];
  taste?: string;
  tasteEn?: string;
  price?: string;
  priceEn?: string;
}

export const categories = {
  bn: [
    { id: 'all', label: '🍽️ সবকিছু', icon: '🍽️' },
    { id: 'rice-type', label: '🌾 চাল', icon: '🌾' },
    { id: 'rice-dish', label: '🍚 ভাতের পদ', icon: '🍚' },
    { id: 'fish', label: '🐟 মাছ', icon: '🐟' },
    { id: 'river', label: '🏞️ নদীর মাছ', icon: '🏞️' },
    { id: 'sea', label: '🌊 সামুদ্রিক মাছ', icon: '🌊' },
    { id: 'small', label: '🐠 ছোট মাছ', icon: '🐠' },
    { id: 'pond', label: '🏕️ পুকুরের মাছ', icon: '🏕️' },
    { id: 'farmed', label: '🏭 চাষের মাছ', icon: '🏭' },
  ],
  en: [
    { id: 'all', label: '🍽️ All', icon: '🍽️' },
    { id: 'rice-type', label: '🌾 Rice Types', icon: '🌾' },
    { id: 'rice-dish', label: '🍚 Rice Dishes', icon: '🍚' },
    { id: 'fish', label: '🐟 Fish', icon: '🐟' },
    { id: 'river', label: '🏞️ River Fish', icon: '🏞️' },
    { id: 'sea', label: '🌊 Sea Fish', icon: '🌊' },
    { id: 'small', label: '🐠 Small Fish', icon: '🐠' },
    { id: 'pond', label: '🏕️ Pond Fish', icon: '🏕️' },
    { id: 'farmed', label: '🏭 Farmed Fish', icon: '🏭' },
  ],
};
