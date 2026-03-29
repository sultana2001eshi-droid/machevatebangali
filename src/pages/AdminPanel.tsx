import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, LogOut, Image as ImageIcon, ArrowLeft, X, Save, LayoutGrid, List, Search, AlertTriangle, Loader2, ChevronDown, ChevronUp, Upload } from 'lucide-react';
import { toast } from 'sonner';
import type { DbItem } from '@/hooks/useItems';
import BulkUpload from '@/components/admin/BulkUpload';
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

// ─── Constants ──────────────────────────────────────────────
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

type FormData = {
  name: string; name_en: string;
  description: string; description_en: string;
  detailed_description: string; detailed_description_en: string;
  category: string; subcategory: string; subcategory_en: string;
  location: string; location_en: string;
  nutrition: string; nutrition_en: string;
  cooking_method: string; cooking_method_en: string;
  origin: string; origin_en: string;
  cultural_importance: string; cultural_importance_en: string;
  taste: string; taste_en: string;
  price: string; price_en: string;
  image_url: string;
};

const emptyForm: FormData = {
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

// Fields that support auto-translation (bangla key → english key)
const TRANSLATABLE_FIELDS: [keyof FormData, keyof FormData][] = [
  ['name', 'name_en'],
  ['description', 'description_en'],
  ['detailed_description', 'detailed_description_en'],
  ['location', 'location_en'],
  ['nutrition', 'nutrition_en'],
  ['cooking_method', 'cooking_method_en'],
  ['origin', 'origin_en'],
  ['cultural_importance', 'cultural_importance_en'],
  ['taste', 'taste_en'],
  ['price', 'price_en'],
];

// ─── Translation helper ─────────────────────────────────────
async function translateText(text: string): Promise<string> {
  if (!text.trim()) return '';
  try {
    const { data, error } = await supabase.functions.invoke('translate', {
      body: { text, source: 'bn', target: 'en' },
    });
    if (error) throw error;
    return data?.translated || '';
  } catch {
    return '';
  }
}

// ─── Main Component ─────────────────────────────────────────
const AdminPanel = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, loading: authLoading, isAdmin, signOut } = useAdmin();
  const queryClient = useQueryClient();

  const [items, setItems] = useState<DbItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string; imageUrl?: string } | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState('');
  const [showEnglish, setShowEnglish] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [heroImages, setHeroImages] = useState<{ id: string; image_url: string; display_order: number }[]>([]);
  const [showHeroManager, setShowHeroManager] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);

  // Debounce ref for auto-translate
  const translateTimer = useRef<ReturnType<typeof setTimeout>>();

  // ─── Auth guard ───────────────────────────────────────────
  useEffect(() => {
    if (!authLoading && !user) navigate('/admin-login');
    if (!authLoading && user && !isAdmin) { signOut(); navigate('/admin-login'); }
  }, [authLoading, user, isAdmin]);

  useEffect(() => { if (isAdmin) { loadItems(); loadHeroImages(); } }, [isAdmin]);

  const loadHeroImages = async () => {
    const { data } = await supabase.from('hero_images').select('*').order('display_order', { ascending: true });
    setHeroImages((data || []) as any[]);
  };

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const ext = file.name.split('.').pop();
      const fileName = `hero-${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from('images').upload(fileName, file, { cacheControl: '3600' });
      if (uploadErr) throw uploadErr;
      const url = supabase.storage.from('images').getPublicUrl(fileName).data.publicUrl;
      const maxOrder = heroImages.reduce((m, h) => Math.max(m, h.display_order), 0);
      const { error } = await supabase.from('hero_images').insert({ image_url: url, display_order: maxOrder + 1 });
      if (error) throw error;
      toast.success(t('হিরো ইমেজ যোগ হয়েছে', 'Hero image added'));
      loadHeroImages();
    } catch (err: any) { toast.error(err.message); }
  };

  const deleteHeroImage = async (id: string, url: string) => {
    try {
      const parts = url.split('/images/');
      if (parts.length >= 2) await supabase.storage.from('images').remove([parts[1]]);
      await supabase.from('hero_images').delete().eq('id', id);
      toast.success(t('হিরো ইমেজ মুছে ফেলা হয়েছে', 'Hero image deleted'));
      loadHeroImages();
    } catch (err: any) { toast.error(err.message); }
  };

  // ─── Subcategory_en sync ──────────────────────────────────
  useEffect(() => {
    const subs = SUBCATEGORIES[form.category];
    if (subs && form.subcategory) {
      const match = subs.find(s => s.value === form.subcategory);
      if (match) setForm(prev => ({ ...prev, subcategory_en: match.labelEn }));
    }
  }, [form.subcategory, form.category]);

  // ─── Duplicate check ─────────────────────────────────────
  useEffect(() => {
    if (!form.name.trim()) { setDuplicateWarning(''); return; }
    const existing = items.find(i =>
      i.name.toLowerCase() === form.name.toLowerCase().trim() && i.id !== editingId
    );
    setDuplicateWarning(existing ? t(`"${existing.name}" নামে ইতিমধ্যে আইটেম আছে`, `"${existing.name}" already exists`) : '');
  }, [form.name, items, editingId]);

  // ─── Auto-translate on Bangla field change ────────────────
  const autoTranslate = useCallback(async () => {
    setTranslating(true);
    try {
      const promises = TRANSLATABLE_FIELDS.map(async ([bnKey, enKey]) => {
        const bnValue = form[bnKey];
        if (!bnValue.trim()) return { key: enKey, value: '' };
        const translated = await translateText(bnValue);
        return { key: enKey, value: translated };
      });
      const results = await Promise.all(promises);
      setForm(prev => {
        const updated = { ...prev };
        results.forEach(r => { if (r.value) (updated as any)[r.key] = r.value; });
        return updated;
      });
    } finally {
      setTranslating(false);
    }
  }, [form.name, form.description, form.detailed_description, form.location, form.nutrition, form.cooking_method, form.origin, form.cultural_importance, form.taste, form.price]);

  // Debounced auto-translate trigger
  const triggerAutoTranslate = useCallback(() => {
    clearTimeout(translateTimer.current);
    translateTimer.current = setTimeout(() => {
      autoTranslate();
    }, 1500);
  }, [autoTranslate]);

  // ─── Data loading ─────────────────────────────────────────
  const loadItems = async () => {
    setLoading(true);
    const { data } = await supabase.from('items').select('*').order('created_at', { ascending: false });
    setItems((data || []) as DbItem[]);
    setLoading(false);
  };

  // ─── Image handling ───────────────────────────────────────
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from('images').upload(fileName, file, { cacheControl: '3600', upsert: false });
    if (error) throw error;
    return supabase.storage.from('images').getPublicUrl(fileName).data.publicUrl;
  };

  const deleteStorageImage = async (url: string) => {
    try {
      const parts = url.split('/images/');
      if (parts.length < 2) return;
      await supabase.storage.from('images').remove([parts[1]]);
    } catch { /* ignore */ }
  };

  // ─── Validation ───────────────────────────────────────────
  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = t('নাম আবশ্যক', 'Name is required');
    else if (form.name.trim().length < 2) errors.name = t('নাম কমপক্ষে ২ অক্ষর', 'Name must be at least 2 characters');
    if (!form.description.trim()) errors.description = t('বিবরণ আবশ্যক', 'Description is required');
    else if (form.description.trim().length < 10) errors.description = t('বিবরণ কমপক্ষে ১০ অক্ষর', 'Description must be at least 10 characters');
    if (!form.category) errors.category = t('ক্যাটাগরি নির্বাচন করুন', 'Select a category');
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ─── Form submit ──────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (duplicateWarning && !editingId) { toast.error(duplicateWarning); return; }
    setSaving(true);

    try {
      let imageUrl = form.image_url;
      if (imageFile) {
        if (editingId && form.image_url) await deleteStorageImage(form.image_url);
        imageUrl = await uploadImage(imageFile);
      }

      const payload = {
        name: form.name.trim(),
        name_en: form.name_en.trim() || null,
        description: form.description.trim(),
        description_en: form.description_en.trim() || null,
        detailed_description: form.detailed_description.trim() || null,
        detailed_description_en: form.detailed_description_en.trim() || null,
        category: form.category,
        subcategory: form.subcategory || null,
        subcategory_en: form.subcategory_en || null,
        location: form.location.trim() || null,
        location_en: form.location_en.trim() || null,
        nutrition: form.nutrition.trim() || null,
        nutrition_en: form.nutrition_en.trim() || null,
        cooking_method: form.cooking_method.trim() || null,
        cooking_method_en: form.cooking_method_en.trim() || null,
        origin: form.origin.trim() || null,
        origin_en: form.origin_en.trim() || null,
        cultural_importance: form.cultural_importance.trim() || null,
        cultural_importance_en: form.cultural_importance_en.trim() || null,
        taste: form.taste.trim() || null,
        taste_en: form.taste_en.trim() || null,
        price: form.price.trim() || null,
        price_en: form.price_en.trim() || null,
        image_url: imageUrl || null,
      };

      if (editingId) {
        const { error } = await supabase.from('items').update(payload).eq('id', editingId);
        if (error) throw error;
        toast.success(t('আইটেম আপডেট হয়েছে!', 'Item updated!'));
      } else {
        const { error } = await supabase.from('items').insert(payload);
        if (error) throw error;
        toast.success(t('নতুন আইটেম যোগ হয়েছে!', 'New item added!'));
      }

      queryClient.invalidateQueries({ queryKey: ['items'] });
      resetForm();
      loadItems();
    } catch (err: any) {
      toast.error(err.message || t('সেভ করতে সমস্যা হয়েছে', 'Error saving'));
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
    setDuplicateWarning('');
    setValidationErrors({});
    setShowEnglish(false);
  };

  const handleEdit = (item: DbItem) => {
    setForm({
      name: item.name, name_en: item.name_en || '',
      description: item.description, description_en: item.description_en || '',
      detailed_description: item.detailed_description || '', detailed_description_en: item.detailed_description_en || '',
      category: item.category, subcategory: item.subcategory || '', subcategory_en: item.subcategory_en || '',
      location: item.location || '', location_en: item.location_en || '',
      nutrition: item.nutrition || '', nutrition_en: item.nutrition_en || '',
      cooking_method: item.cooking_method || '', cooking_method_en: item.cooking_method_en || '',
      origin: item.origin || '', origin_en: item.origin_en || '',
      cultural_importance: item.cultural_importance || '', cultural_importance_en: item.cultural_importance_en || '',
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
      if (deleteTarget.imageUrl) await deleteStorageImage(deleteTarget.imageUrl);
      const { error } = await supabase.from('items').delete().eq('id', deleteTarget.id);
      if (error) throw error;
      toast.success(t(`"${deleteTarget.name}" মুছে ফেলা হয়েছে`, `"${deleteTarget.name}" deleted`));
      queryClient.invalidateQueries({ queryKey: ['items'] });
      loadItems();
    } catch (err: any) {
      toast.error(err.message || t('মুছতে সমস্যা হয়েছে', 'Error deleting'));
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleCategoryChange = (value: string) => {
    setForm(prev => ({ ...prev, category: value, subcategory: '', subcategory_en: '' }));
  };

  const handleSubcategoryChange = (value: string) => {
    const match = SUBCATEGORIES[form.category]?.find(s => s.value === value);
    setForm(prev => ({ ...prev, subcategory: value, subcategory_en: match?.labelEn || '' }));
  };

  // Helper: update a Bangla field and trigger auto-translate
  const updateBanglaField = (key: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    triggerAutoTranslate();
  };

  // ─── Render guards ────────────────────────────────────────
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
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
      {/* ── Header ── */}
      <div className="glass-nav sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-body text-sm">
            <ArrowLeft className="w-4 h-4" /> {t('হোম', 'Home')}
          </button>
          <h1 className="font-heading text-lg font-bold gold-accent">{t('কন্টেন্ট ম্যানেজার', 'Content Manager')}</h1>
          <button onClick={signOut} className="flex items-center gap-1.5 text-destructive hover:text-destructive/80 transition-colors font-body text-sm">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* ── Stats ── */}
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

        {/* ── Hero Image Manager ── */}
        <div className="mb-6">
          <button onClick={() => setShowHeroManager(!showHeroManager)}
            className="inline-flex items-center gap-2 text-sm font-body font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ImageIcon className="w-4 h-4" /> {t('হিরো ইমেজ পরিচালনা', 'Manage Hero Images')}
            {showHeroManager ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          {showHeroManager && (
            <div className="glass-card p-4 mt-3">
              <div className="flex flex-wrap gap-3 mb-3">
                {heroImages.map(h => (
                  <div key={h.id} className="relative w-28 h-20 rounded-xl overflow-hidden group">
                    <img src={h.image_url} alt="Hero" className="w-full h-full object-cover" />
                    <button onClick={() => deleteHeroImage(h.id, h.image_url)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3" />
                    </button>
                    <span className="absolute bottom-1 left-1 text-[9px] bg-black/60 text-white px-1 rounded">{h.display_order}</span>
                  </div>
                ))}
              </div>
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-foreground text-xs font-body hover:bg-accent transition-colors">
                <Plus className="w-3 h-3" /> {t('হিরো ইমেজ যোগ করুন', 'Add Hero Image')}
                <input type="file" accept="image/*" onChange={handleHeroUpload} className="hidden" />
              </label>
            </div>
          )}
        </div>

        {/* ── Toolbar ── */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {!showForm && (
            <>
              <button onClick={() => { resetForm(); setShowForm(true); }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-body font-semibold text-sm transition-all hover:scale-[1.02] bg-primary text-primary-foreground shadow-md">
                <Plus className="w-4 h-4" /> {t('নতুন যোগ', 'Add New')}
              </button>
              <button onClick={() => setShowBulkUpload(!showBulkUpload)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-body font-medium text-sm transition-all border ${showBulkUpload ? 'bg-accent text-accent-foreground border-accent' : 'bg-secondary text-foreground border-border/50 hover:bg-accent/50'}`}>
                <Upload className="w-4 h-4" /> {t('বাল্ক আপলোড', 'Bulk Upload')}
              </button>
            </>
          )}
          <div className="flex-1 min-w-[180px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder={t('আইটেম খুঁজুন...', 'Search items...')}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-secondary text-foreground border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary font-body text-sm" />
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

        {/* ── Bulk Upload ── */}
        {showBulkUpload && (
          <BulkUpload
            existingNames={items.map(i => i.name)}
            onComplete={() => { setShowBulkUpload(false); loadItems(); }}
          />
        )}

        {/* ── Form ── */}
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
              {/* Image */}
              <div>
                <label className="font-accent text-xs tracking-wider uppercase text-muted-foreground mb-2 block">{t('ছবি', 'Image')}</label>
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
                  <div>
                    <p className="text-xs text-muted-foreground font-body mt-2">{t('ক্লিক করে ছবি আপলোড করুন', 'Click to upload image')}</p>
                    {imagePreview && (
                      <button type="button" onClick={() => { setImageFile(null); setImagePreview(''); setForm(prev => ({ ...prev, image_url: '' })); }}
                        className="mt-1 text-xs text-destructive hover:underline font-body">{t('ছবি মুছুন', 'Remove')}</button>
                    )}
                  </div>
                </div>
              </div>

              {/* Category & Subcategory */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-accent text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">{t('ক্যাটাগরি *', 'Category *')}</label>
                  <select value={form.category} onChange={e => handleCategoryChange(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-secondary text-foreground border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary font-body text-sm">
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                  {validationErrors.category && <p className="text-xs text-destructive mt-1">{validationErrors.category}</p>}
                </div>
                <div>
                  <label className="font-accent text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">{t('সাবক্যাটাগরি', 'Subcategory')}</label>
                  <select value={form.subcategory} onChange={e => handleSubcategoryChange(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-secondary text-foreground border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary font-body text-sm">
                    <option value="">{t('-- নির্বাচন করুন --', '-- Select --')}</option>
                    {currentSubcategories.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
              </div>

              {/* ── Bangla Fields (Primary) ── */}
              <fieldset className="space-y-4 border border-border/30 rounded-xl p-4">
                <legend className="text-xs font-accent uppercase tracking-wider text-primary px-2 font-semibold">{t('বাংলা কন্টেন্ট', 'Bangla Content')}</legend>

                <div>
                  <BanglaField label={t('নাম *', 'Name *')} value={form.name} onChange={v => updateBanglaField('name', v)} required />
                  {validationErrors.name && <p className="text-xs text-destructive mt-1">{validationErrors.name}</p>}
                  {duplicateWarning && (
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-destructive font-body">
                      <AlertTriangle className="w-3 h-3" />{duplicateWarning}
                    </div>
                  )}
                </div>

                <BanglaField label={t('বিবরণ *', 'Description *')} value={form.description} onChange={v => updateBanglaField('description', v)} textarea required />
                {validationErrors.description && <p className="text-xs text-destructive mt-1">{validationErrors.description}</p>}

                <BanglaField label={t('বিস্তারিত বিবরণ', 'Detailed Description')} value={form.detailed_description} onChange={v => updateBanglaField('detailed_description', v)} textarea />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <BanglaField label={t('অঞ্চল', 'Location')} value={form.location} onChange={v => updateBanglaField('location', v)} />
                  <BanglaField label={t('উৎপত্তি', 'Origin')} value={form.origin} onChange={v => updateBanglaField('origin', v)} />
                  <BanglaField label={t('পুষ্টিগুণ', 'Nutrition')} value={form.nutrition} onChange={v => updateBanglaField('nutrition', v)} />
                  <BanglaField label={t('স্বাদ', 'Taste')} value={form.taste} onChange={v => updateBanglaField('taste', v)} />
                  <BanglaField label={t('দাম', 'Price')} value={form.price} onChange={v => updateBanglaField('price', v)} />
                </div>

                <BanglaField label={t('রান্নার পদ্ধতি', 'Cooking Method')} value={form.cooking_method} onChange={v => updateBanglaField('cooking_method', v)} textarea />
                <BanglaField label={t('সাংস্কৃতিক গুরুত্ব', 'Cultural Importance')} value={form.cultural_importance} onChange={v => updateBanglaField('cultural_importance', v)} textarea />
              </fieldset>

              {/* ── Auto-translate indicator ── */}
              {translating && (
                <div className="flex items-center gap-2 text-xs text-primary font-body">
                  <Loader2 className="w-3 h-3 animate-spin" /> {t('ইংরেজিতে অনুবাদ হচ্ছে...', 'Auto-translating to English...')}
                </div>
              )}

              {/* ── English Fields (Collapsible, readonly by default) ── */}
              <div className="border border-border/30 rounded-xl overflow-hidden">
                <button type="button" onClick={() => setShowEnglish(!showEnglish)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-secondary/50 hover:bg-secondary transition-colors">
                  <span className="text-xs font-accent uppercase tracking-wider text-muted-foreground font-semibold">
                    {t('ইংরেজি অনুবাদ (স্বয়ংক্রিয়)', 'English Translation (Auto)')}
                  </span>
                  {showEnglish ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </button>
                {showEnglish && (
                  <div className="p-4 space-y-4">
                    <p className="text-[10px] text-muted-foreground font-body">{t('এগুলো স্বয়ংক্রিয়ভাবে তৈরি হয়। প্রয়োজনে সম্পাদনা করতে পারেন।', 'Auto-generated. Edit if needed.')}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <EnglishField label="Name (EN)" value={form.name_en} onChange={v => setForm(prev => ({ ...prev, name_en: v }))} />
                      <EnglishField label="Location (EN)" value={form.location_en} onChange={v => setForm(prev => ({ ...prev, location_en: v }))} />
                      <EnglishField label="Nutrition (EN)" value={form.nutrition_en} onChange={v => setForm(prev => ({ ...prev, nutrition_en: v }))} />
                      <EnglishField label="Taste (EN)" value={form.taste_en} onChange={v => setForm(prev => ({ ...prev, taste_en: v }))} />
                      <EnglishField label="Price (EN)" value={form.price_en} onChange={v => setForm(prev => ({ ...prev, price_en: v }))} />
                      <EnglishField label="Origin (EN)" value={form.origin_en} onChange={v => setForm(prev => ({ ...prev, origin_en: v }))} />
                    </div>
                    <EnglishField label="Description (EN)" value={form.description_en} onChange={v => setForm(prev => ({ ...prev, description_en: v }))} textarea />
                    <EnglishField label="Detailed Description (EN)" value={form.detailed_description_en} onChange={v => setForm(prev => ({ ...prev, detailed_description_en: v }))} textarea />
                    <EnglishField label="Cooking Method (EN)" value={form.cooking_method_en} onChange={v => setForm(prev => ({ ...prev, cooking_method_en: v }))} textarea />
                    <EnglishField label="Cultural Importance (EN)" value={form.cultural_importance_en} onChange={v => setForm(prev => ({ ...prev, cultural_importance_en: v }))} textarea />
                  </div>
                )}
              </div>

              {/* Submit */}
              <button type="submit" disabled={saving || (!!duplicateWarning && !editingId)}
                className="w-full py-3 rounded-xl font-body font-semibold text-sm transition-all hover:scale-[1.01] disabled:opacity-50 flex items-center justify-center gap-2 bg-primary text-primary-foreground shadow-lg">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? t('সেভ হচ্ছে...', 'Saving...') : (editingId ? t('আপডেট করুন', 'Update') : t('সেভ করুন', 'Save'))}
              </button>
            </form>
          </div>
        )}

        {/* ── Filter Tabs ── */}
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

        {/* ── Items Grid ── */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map(item => (
              <div key={item.id} className="glass-card overflow-hidden group">
                <div className="aspect-[4/3] bg-secondary overflow-hidden relative">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-10 h-10 text-muted-foreground/30" /></div>
                  )}
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-accent uppercase tracking-wider bg-background/80 backdrop-blur-sm text-foreground border border-border/30">
                    {CATEGORIES.find(c => c.value === item.category)?.label || item.category}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-heading text-base font-bold text-foreground truncate">{item.name}</h3>
                  {item.subcategory && <p className="text-[10px] font-accent uppercase tracking-wider text-muted-foreground mt-0.5">{item.subcategory}</p>}
                  <p className="font-body text-xs text-muted-foreground line-clamp-2 mt-1">{item.description}</p>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => handleEdit(item)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-secondary text-foreground text-xs font-body hover:bg-primary hover:text-primary-foreground transition-colors">
                      <Edit2 className="w-3 h-3" /> {t('সম্পাদনা', 'Edit')}
                    </button>
                    <button onClick={() => setDeleteTarget({ id: item.id, name: item.name, imageUrl: item.image_url || undefined })}
                      className="flex items-center justify-center gap-1 py-2 px-3 rounded-lg bg-destructive/10 text-destructive text-xs font-body hover:bg-destructive hover:text-destructive-foreground transition-colors">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Items List ── */}
        {viewMode === 'list' && (
          <div className="space-y-2">
            {filteredItems.map(item => (
              <div key={item.id} className="glass-card flex items-center gap-4 p-3 group">
                <div className="w-16 h-12 rounded-lg bg-secondary overflow-hidden flex-shrink-0">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-5 h-5 text-muted-foreground/30" /></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading text-sm font-bold text-foreground truncate">{item.name}</h3>
                  <p className="text-[10px] font-accent uppercase tracking-wider text-muted-foreground">
                    {CATEGORIES.find(c => c.value === item.category)?.label} {item.subcategory && `• ${item.subcategory}`}
                  </p>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <button onClick={() => handleEdit(item)} className="p-2 rounded-lg bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setDeleteTarget({ id: item.id, name: item.name, imageUrl: item.image_url || undefined })}
                    className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors">
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
            <p className="font-heading text-lg text-muted-foreground">{t('কোনো আইটেম নেই', 'No items found')}</p>
          </div>
        )}
      </div>

      {/* ── Delete Dialog ── */}
      <AlertDialog open={!!deleteTarget} onOpenChange={open => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('আইটেম মুছে ফেলবেন?', 'Delete this item?')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t(`"${deleteTarget?.name}" মুছে ফেলা হলে আর ফেরত আনা যাবে না।`, `"${deleteTarget?.name}" will be permanently deleted.`)}
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

// ─── Reusable sub-components ────────────────────────────────

const FilterTab = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-xs font-accent font-medium transition-all border ${active ? 'bg-primary text-primary-foreground border-primary' : 'bg-card/80 text-foreground border-border/50 hover:bg-secondary'}`}>
    {children}
  </button>
);

const BanglaField = ({ label, value, onChange, required, textarea }: {
  label: string; value: string; onChange: (v: string) => void; required?: boolean; textarea?: boolean;
}) => (
  <div>
    <label className="font-accent text-xs tracking-wider uppercase text-muted-foreground mb-1.5 block">{label}</label>
    {textarea ? (
      <textarea value={value} onChange={e => onChange(e.target.value)} required={required} rows={3}
        className="w-full px-4 py-2.5 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary font-body text-sm resize-y" />
    ) : (
      <input type="text" value={value} onChange={e => onChange(e.target.value)} required={required}
        className="w-full px-4 py-2.5 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary font-body text-sm" />
    )}
  </div>
);

const EnglishField = ({ label, value, onChange, textarea }: {
  label: string; value: string; onChange: (v: string) => void; textarea?: boolean;
}) => (
  <div>
    <label className="font-accent text-xs tracking-wider uppercase text-muted-foreground/60 mb-1.5 block">{label}</label>
    {textarea ? (
      <textarea value={value} onChange={e => onChange(e.target.value)} rows={2}
        className="w-full px-4 py-2.5 rounded-xl bg-muted/50 text-foreground/80 border border-border/30 focus:outline-none focus:ring-1 focus:ring-primary/50 font-body text-sm resize-y" />
    ) : (
      <input type="text" value={value} onChange={e => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl bg-muted/50 text-foreground/80 border border-border/30 focus:outline-none focus:ring-1 focus:ring-primary/50 font-body text-sm" />
    )}
  </div>
);

export default AdminPanel;
