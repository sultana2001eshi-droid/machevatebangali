import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, LogOut, Image as ImageIcon, ArrowLeft, X, Save, LayoutGrid, List, Search } from 'lucide-react';
import { toast } from 'sonner';
import type { DbItem } from '@/hooks/useItems';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const CATEGORIES = [
  { value: 'rice-type', label: '🌾 চাল', labelEn: 'Rice Type' },
  { value: 'rice-dish', label: '🍚 ভাতের পদ', labelEn: 'Rice Dish' },
  { value: 'fish', label: '🐟 মাছ', labelEn: 'Fish' },
];

const SUBCATEGORIES: Record<string, { value: string; label: string; labelEn: string }[]> = {
  'rice-type': [
    { value: 'চিকন চাল', label: 'চিকন চাল', labelEn: 'Fine Rice' },
    { value: 'সুগন্ধি চাল', label: 'সুগন্ধি চাল', labelEn: 'Aromatic Rice' },
    { value: 'ঐতিহ্যবাহী চাল', label: 'ঐতিহ্যবাহী চাল', labelEn: 'Traditional Rice' },
  ],
  'fish': [
    { value: 'নদীর মাছ', label: 'নদীর মাছ', labelEn: 'River Fish' },
    { value: 'সামুদ্রিক মাছ', label: 'সামুদ্রিক মাছ', labelEn: 'Sea Fish' },
    { value: 'ছোট মাছ', label: 'ছোট মাছ', labelEn: 'Small Fish' },
    { value: 'পুকুরের মাছ', label: 'পুকুরের মাছ', labelEn: 'Pond Fish' },
    { value: 'চাষের মাছ', label: 'চাষের মাছ', labelEn: 'Farmed Fish' },
  ],
  'rice-dish': [
    { value: 'প্রধান ভাত', label: 'প্রধান ভাত', labelEn: 'Main Rice' },
    { value: 'উৎসবের ভাত', label: 'উৎসবের ভাত', labelEn: 'Festival Rice' },
    { value: 'ঐতিহ্যবাহী ভাত', label: 'ঐতিহ্যবাহী ভাত', labelEn: 'Traditional Rice' },
    { value: 'স্বাস্থ্যকর ভাত', label: 'স্বাস্থ্যকর ভাত', labelEn: 'Healthy Rice' },
  ],
};

const emptyForm = {
  name: '', name_en: '', description: '', description_en: '',
  detailed_description: '', detailed_description_en: '',
  category: 'fish', subcategory: '', subcategory_en: '',
  location: '', location_en: '', nutrition: '', nutrition_en: '',
  cooking_method: '', cooking_method_en: '',
  origin: '', origin_en: '',
  cultural_importance: '', cultural_importance_en: '',
  taste: '', taste_en: '', price: '', price_en: '',
  image_url: '',
};

const AdminPanel = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, loading: authLoading, isAdmin, signOut } = useAdmin();
  const queryClient = useQueryClient();

  const [items, setItems] = useState<DbItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate('/admin-login');
    if (!authLoading && user && !isAdmin) {
      signOut();
      navigate('/admin-login');
    }
  }, [authLoading, user, isAdmin]);

  useEffect(() => {
    if (isAdmin) loadItems();
  }, [isAdmin]);

  // Auto-set subcategory_en when subcategory changes
  useEffect(() => {
    const subs = SUBCATEGORIES[form.category];
    if (subs && form.subcategory) {
      const match = subs.find(s => s.value === form.subcategory);
      if (match) {
        setForm(prev => ({ ...prev, subcategory_en: match.labelEn }));
      }
    }
  }, [form.subcategory, form.category]);

  const loadItems = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: false });
    setItems((data || []) as DbItem[]);
    setLoading(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage
      .from('images')
      .upload(fileName, file, { cacheControl: '3600', upsert: false });
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let imageUrl = form.image_url;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const payload = {
        name: form.name,
        name_en: form.name_en || null,
        description: form.description,
        description_en: form.description_en || null,
        detailed_description: form.detailed_description || null,
        detailed_description_en: form.detailed_description_en || null,
        category: form.category,
        subcategory: form.subcategory || null,
        subcategory_en: form.subcategory_en || null,
        location: form.location || null,
        location_en: form.location_en || null,
        nutrition: form.nutrition || null,
        nutrition_en: form.nutrition_en || null,
        cooking_method: form.cooking_method || null,
        cooking_method_en: form.cooking_method_en || null,
        origin: form.origin || null,
        origin_en: form.origin_en || null,
        cultural_importance: form.cultural_importance || null,
        cultural_importance_en: form.cultural_importance_en || null,
        taste: form.taste || null,
        taste_en: form.taste_en || null,
        price: form.price || null,
        price_en: form.price_en || null,
        image_url: imageUrl || null,
      };

      if (editingId) {
        const { error } = await supabase.from('items').update(payload).eq('id', editingId);
        if (error) throw error;
        toast.success(t('আইটেম আপডেট হয়েছে!', 'Item updated successfully!'));
      } else {
        const { error } = await supabase.from('items').insert(payload);
        if (error) throw error;
        toast.success(t('নতুন আইটেম যোগ হয়েছে!', 'New item added successfully!'));
      }

      queryClient.invalidateQueries({ queryKey: ['items'] });
      resetForm();
      loadItems();
    } catch (err: any) {
      toast.error(err.message || t('সেভ করতে সমস্যা হয়েছে', 'Error saving item'));
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview('');
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (item: DbItem) => {
    setForm({
      name: item.name, name_en: item.name_en || '',
      description: item.description, description_en: item.description_en || '',
      detailed_description: item.detailed_description || '',
      detailed_description_en: item.detailed_description_en || '',
      category: item.category, subcategory: item.subcategory || '',
      subcategory_en: item.subcategory_en || '',
      location: item.location || '', location_en: item.location_en || '',
      nutrition: item.nutrition || '', nutrition_en: item.nutrition_en || '',
      cooking_method: item.cooking_method || '', cooking_method_en: item.cooking_method_en || '',
      origin: item.origin || '', origin_en: item.origin_en || '',
      cultural_importance: item.cultural_importance || '',
      cultural_importance_en: item.cultural_importance_en || '',
      taste: item.taste || '', taste_en: item.taste_en || '',
      price: item.price || '', price_en: item.price_en || '',
      image_url: item.image_url || '',
    });
    setImagePreview(item.image_url || '');
    setEditingId(item.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const { error } = await supabase.from('items').delete().eq('id', deleteTarget.id);
      if (error) throw error;
      toast.success(t(`"${deleteTarget.name}" মুছে ফেলা হয়েছে`, `"${deleteTarget.name}" deleted successfully`));
      queryClient.invalidateQueries({ queryKey: ['items'] });
      loadItems();
    } catch (err: any) {
      toast.error(err.message || t('মুছতে সমস্যা হয়েছে', 'Error deleting item'));
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleSubcategoryChange = (value: string) => {
    const subs = SUBCATEGORIES[form.category];
    const match = subs?.find(s => s.value === value);
    setForm(prev => ({
      ...prev,
      subcategory: value,
      subcategory_en: match?.labelEn || prev.subcategory_en,
    }));
  };

  const handleCategoryChange = (value: string) => {
    setForm(prev => ({ ...prev, category: value, subcategory: '', subcategory_en: '' }));
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse font-heading text-xl text-muted-foreground">
          {t('লোড হচ্ছে...', 'Loading...')}
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  const filteredItems = items
    .filter(i => filterCategory === 'all' || i.category === filterCategory)
    .filter(i => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return i.name.toLowerCase().includes(q) || (i.name_en || '').toLowerCase().includes(q);
    });

  const currentSubcategories = SUBCATEGORIES[form.category] || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="glass-nav sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-body text-sm">
            <ArrowLeft className="w-4 h-4" /> {t('হোম', 'Home')}
          </button>
          <h1 className="font-heading text-lg font-bold gold-accent">
            {t('কন্টেন্ট ম্যানেজার', 'Content Manager')}
          </h1>
          <button onClick={signOut} className="flex items-center gap-1.5 text-destructive hover:text-destructive/80 transition-colors font-body text-sm">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {CATEGORIES.map(c => {
            const count = items.filter(i => i.category === c.value).length;
            return (
              <div key={c.value} className="glass-card p-3 text-center">
                <p className="text-2xl font-heading font-bold text-foreground">{count}</p>
                <p className="text-[10px] font-accent uppercase tracking-wider text-muted-foreground">{c.label}</p>
              </div>
            );
          })}
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {!showForm && (
            <button
              onClick={() => { resetForm(); setShowForm(true); }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-body font-semibold text-sm transition-all hover:scale-[1.02] bg-primary text-primary-foreground shadow-md"
            >
              <Plus className="w-4 h-4" /> {t('নতুন যোগ', 'Add New')}
            </button>
          )}
          <div className="flex-1 min-w-[180px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t('আইটেম খুঁজুন...', 'Search items...')}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-secondary text-foreground border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary font-body text-sm"
            />
          </div>
          <div className="flex rounded-xl overflow-hidden border border-border/50">
            <button onClick={() => setViewMode('grid')} className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:bg-accent'}`}>
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:bg-accent'}`}>
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="glass-card p-5 md:p-8 mb-6 border-gold/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-xl font-bold text-foreground">
                {editingId ? t('আইটেম সম্পাদনা', 'Edit Item') : t('নতুন আইটেম', 'New Item')}
              </h2>
              <button onClick={resetForm} className="p-2 rounded-lg hover:bg-secondary transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Image Upload */}
              <div>
                <label className="font-accent text-xs tracking-wider uppercase text-muted-foreground mb-2 block">
                  {t('ছবি', 'Image')}
                </label>
                <div className="flex items-start gap-4">
                  <label className="cursor-pointer flex-shrink-0">
                    <div className="w-32 h-24 rounded-xl bg-secondary border-2 border-dashed border-border flex items-center justify-center overflow-hidden hover:border-primary transition-colors">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-muted-foreground/40" />
                      )}
                    </div>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                  <p className="text-xs text-muted-foreground font-body mt-2">
                    {t('ক্লিক করে ছবি আপলোড করুন। 4:3 অনুপাতের ছবি সেরা।', 'Click to upload. 4:3 ratio images work best.')}
                  </p>
                </div>
              </div>

              {/* Category & Subcategory */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-accent text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">
                    {t('ক্যাটাগরি *', 'Category *')}
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-secondary text-foreground border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary font-body text-sm"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.value} value={c.value}>{c.label} ({c.labelEn})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-accent text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">
                    {t('সাবক্যাটাগরি', 'Subcategory')}
                  </label>
                  <select
                    value={form.subcategory}
                    onChange={(e) => handleSubcategoryChange(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-secondary text-foreground border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary font-body text-sm"
                  >
                    <option value="">{t('-- নির্বাচন করুন --', '-- Select --')}</option>
                    {currentSubcategories.map(s => (
                      <option key={s.value} value={s.value}>{s.label} ({s.labelEn})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Names */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label={t('নাম (বাংলা) *', 'Name (Bangla) *')} value={form.name} onChange={v => setForm({ ...form, name: v })} required />
                <FormField label={t('নাম (English)', 'Name (English)')} value={form.name_en} onChange={v => setForm({ ...form, name_en: v })} />
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label={t('অঞ্চল (বাংলা)', 'Location (Bangla)')} value={form.location} onChange={v => setForm({ ...form, location: v })} />
                <FormField label={t('অঞ্চল (English)', 'Location (English)')} value={form.location_en} onChange={v => setForm({ ...form, location_en: v })} />
              </div>

              {/* Description */}
              <FormTextarea label={t('বিবরণ (বাংলা) *', 'Description (Bangla) *')} value={form.description} onChange={v => setForm({ ...form, description: v })} required />
              <FormTextarea label={t('বিবরণ (English)', 'Description (English)')} value={form.description_en} onChange={v => setForm({ ...form, description_en: v })} />
              <FormTextarea label={t('বিস্তারিত বিবরণ (বাংলা)', 'Detailed Desc (Bangla)')} value={form.detailed_description} onChange={v => setForm({ ...form, detailed_description: v })} />
              <FormTextarea label={t('বিস্তারিত বিবরণ (English)', 'Detailed Desc (English)')} value={form.detailed_description_en} onChange={v => setForm({ ...form, detailed_description_en: v })} />

              {/* Extras */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label={t('পুষ্টিগুণ (বাংলা)', 'Nutrition (BN)')} value={form.nutrition} onChange={v => setForm({ ...form, nutrition: v })} />
                <FormField label={t('পুষ্টিগুণ (EN)', 'Nutrition (EN)')} value={form.nutrition_en} onChange={v => setForm({ ...form, nutrition_en: v })} />
                <FormField label={t('স্বাদ (বাংলা)', 'Taste (BN)')} value={form.taste} onChange={v => setForm({ ...form, taste: v })} />
                <FormField label={t('স্বাদ (EN)', 'Taste (EN)')} value={form.taste_en} onChange={v => setForm({ ...form, taste_en: v })} />
                <FormField label={t('দাম (বাংলা)', 'Price (BN)')} value={form.price} onChange={v => setForm({ ...form, price: v })} />
                <FormField label={t('দাম (EN)', 'Price (EN)')} value={form.price_en} onChange={v => setForm({ ...form, price_en: v })} />
                <FormField label={t('উৎপত্তি (বাংলা)', 'Origin (BN)')} value={form.origin} onChange={v => setForm({ ...form, origin: v })} />
                <FormField label={t('উৎপত্তি (EN)', 'Origin (EN)')} value={form.origin_en} onChange={v => setForm({ ...form, origin_en: v })} />
              </div>

              <FormTextarea label={t('রান্নার পদ্ধতি (বাংলা)', 'Cooking Method (BN)')} value={form.cooking_method} onChange={v => setForm({ ...form, cooking_method: v })} />
              <FormTextarea label={t('রান্নার পদ্ধতি (EN)', 'Cooking Method (EN)')} value={form.cooking_method_en} onChange={v => setForm({ ...form, cooking_method_en: v })} />
              <FormTextarea label={t('সাংস্কৃতিক গুরুত্ব (বাংলা)', 'Cultural Importance (BN)')} value={form.cultural_importance} onChange={v => setForm({ ...form, cultural_importance: v })} />
              <FormTextarea label={t('সাংস্কৃতিক গুরুত্ব (EN)', 'Cultural Importance (EN)')} value={form.cultural_importance_en} onChange={v => setForm({ ...form, cultural_importance_en: v })} />

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 rounded-xl font-body font-semibold text-sm transition-all hover:scale-[1.01] disabled:opacity-50 flex items-center justify-center gap-2 bg-primary text-primary-foreground shadow-lg"
              >
                <Save className="w-4 h-4" />
                {saving ? t('সেভ হচ্ছে...', 'Saving...') : (editingId ? t('আপডেট করুন', 'Update') : t('সেভ করুন', 'Save'))}
              </button>
            </form>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-5">
          <FilterTab active={filterCategory === 'all'} onClick={() => setFilterCategory('all')}>
            {t('সবকিছু', 'All')} ({items.length})
          </FilterTab>
          {CATEGORIES.map(c => {
            const count = items.filter(i => i.category === c.value).length;
            return (
              <FilterTab key={c.value} active={filterCategory === c.value} onClick={() => setFilterCategory(c.value)}>
                {c.label} ({count})
              </FilterTab>
            );
          })}
        </div>

        {/* Items — Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <div key={item.id} className="glass-card overflow-hidden group">
                <div className="aspect-[4/3] bg-secondary overflow-hidden relative">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-10 h-10 text-muted-foreground/30" />
                    </div>
                  )}
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-accent uppercase tracking-wider bg-background/80 backdrop-blur-sm text-foreground border border-border/30">
                    {CATEGORIES.find(c => c.value === item.category)?.label || item.category}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-heading text-base font-bold text-foreground truncate">{item.name}</h3>
                  {item.subcategory && (
                    <p className="text-[10px] font-accent uppercase tracking-wider text-muted-foreground mt-0.5">{item.subcategory}</p>
                  )}
                  <p className="font-body text-xs text-muted-foreground line-clamp-2 mt-1">{item.description}</p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-secondary text-foreground text-xs font-body hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <Edit2 className="w-3 h-3" /> {t('সম্পাদনা', 'Edit')}
                    </button>
                    <button
                      onClick={() => setDeleteTarget({ id: item.id, name: item.name })}
                      className="flex items-center justify-center gap-1 py-2 px-3 rounded-lg bg-destructive/10 text-destructive text-xs font-body hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Items — List View */}
        {viewMode === 'list' && (
          <div className="space-y-2">
            {filteredItems.map((item) => (
              <div key={item.id} className="glass-card flex items-center gap-4 p-3 group">
                <div className="w-16 h-12 rounded-lg bg-secondary overflow-hidden flex-shrink-0">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading text-sm font-bold text-foreground truncate">{item.name}</h3>
                  <p className="text-[10px] font-accent uppercase tracking-wider text-muted-foreground">
                    {CATEGORIES.find(c => c.value === item.category)?.label} {item.subcategory && `• ${item.subcategory}`}
                  </p>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 rounded-lg bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget({ id: item.id, name: item.name })}
                    className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">📭</p>
            <p className="font-heading text-lg text-muted-foreground">
              {t('কোনো আইটেম নেই', 'No items found')}
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('আইটেম মুছে ফেলবেন?', 'Delete this item?')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t(
                `"${deleteTarget?.name}" মুছে ফেলা হলে আর ফেরত আনা যাবে না।`,
                `"${deleteTarget?.name}" will be permanently deleted.`
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('বাতিল', 'Cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {t('মুছে ফেলুন', 'Delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// Reusable components
const FilterTab = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-xs font-accent font-medium transition-all border ${active ? 'bg-primary text-primary-foreground border-primary' : 'bg-card/80 text-foreground border-border/50 hover:bg-secondary'}`}
  >
    {children}
  </button>
);

const FormField = ({ label, value, onChange, required }: {
  label: string; value: string; onChange: (v: string) => void; required?: boolean;
}) => (
  <div>
    <label className="font-accent text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className="w-full px-4 py-2.5 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary font-body text-sm"
    />
  </div>
);

const FormTextarea = ({ label, value, onChange, required }: {
  label: string; value: string; onChange: (v: string) => void; required?: boolean;
}) => (
  <div>
    <label className="font-accent text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      rows={3}
      className="w-full px-4 py-2.5 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary font-body text-sm resize-y"
    />
  </div>
);

export default AdminPanel;
