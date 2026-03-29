import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DbItem {
  id: string;
  name: string;
  name_en: string | null;
  description: string;
  description_en: string | null;
  detailed_description: string | null;
  detailed_description_en: string | null;
  category: string;
  subcategory: string | null;
  subcategory_en: string | null;
  location: string | null;
  location_en: string | null;
  nutrition: string | null;
  nutrition_en: string | null;
  cooking_method: string | null;
  cooking_method_en: string | null;
  origin: string | null;
  origin_en: string | null;
  cultural_importance: string | null;
  cultural_importance_en: string | null;
  taste: string | null;
  taste_en: string | null;
  price: string | null;
  price_en: string | null;
  cooking_steps: string[] | null;
  cooking_steps_en: string[] | null;
  image_url: string | null;
  created_at: string;
}

async function fetchItems(): Promise<DbItem[]> {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as DbItem[];
}

export function useItems() {
  return useQuery({
    queryKey: ['items'],
    queryFn: fetchItems,
  });
}

// Convert DbItem to the FoodItem format used by existing components
export function dbItemToFoodItem(item: DbItem) {
  return {
    id: item.id,
    name: item.name,
    nameEn: item.name_en || item.name,
    description: item.description,
    descriptionEn: item.description_en || item.description,
    detailedDescription: item.detailed_description || undefined,
    detailedDescriptionEn: item.detailed_description_en || undefined,
    image: item.image_url || '',
    category: item.category as 'rice-type' | 'rice-dish' | 'fish',
    subCategory: item.subcategory || '',
    subCategoryEn: item.subcategory_en || '',
    nutrition: item.nutrition || undefined,
    nutritionEn: item.nutrition_en || undefined,
    cookingMethod: item.cooking_method || undefined,
    cookingMethodEn: item.cooking_method_en || undefined,
    origin: item.origin || undefined,
    originEn: item.origin_en || undefined,
    region: item.location || undefined,
    regionEn: item.location_en || undefined,
    culturalImportance: item.cultural_importance || undefined,
    culturalImportanceEn: item.cultural_importance_en || undefined,
    taste: item.taste || undefined,
    tasteEn: item.taste_en || undefined,
    price: item.price || undefined,
    priceEn: item.price_en || undefined,
    cookingSteps: item.cooking_steps || undefined,
    cookingStepsEn: item.cooking_steps_en || undefined,
  };
}
