import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQueryClient } from '@tanstack/react-query';
import { Upload, FileText, AlertTriangle, Check, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface BulkItem {
  name: string;
  description: string;
  category: string;
  region?: string;
  image_url?: string;
  // generated
  name_en?: string;
  description_en?: string;
  location_en?: string;
  // status
  _status?: 'valid' | 'duplicate' | 'error';
  _error?: string;
}

const VALID_CATEGORIES = ['rice-type', 'rice-dish', 'fish'];
const CATEGORY_MAP: Record<string, string> = {
  'চাল': 'rice-type', 'rice': 'rice-type', 'rice-type': 'rice-type',
  'ভাতের পদ': 'rice-dish', 'dish': 'rice-dish', 'rice-dish': 'rice-dish',
  'মাছ': 'fish', 'fish': 'fish',
};

interface BulkUploadProps {
  existingNames: string[];
  onComplete: () => void;
}

async function translateText(text: string): Promise<string> {
  if (!text.trim()) return '';
  try {
    const { data, error } = await supabase.functions.invoke('translate', {
      body: { text, source: 'bn', target: 'en' },
    });
    if (error) throw error;
    return data?.translated || '';
  } catch { return ''; }
}

const BulkUpload = ({ existingNames, onComplete }: BulkUploadProps) => {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [items, setItems] = useState<BulkItem[]>([]);
  const [step, setStep] = useState<'upload' | 'preview' | 'inserting'>('upload');
  const [progress, setProgress] = useState(0);
  const [translating, setTranslating] = useState(false);

  const normalizeCategory = (raw: string): string => {
    const lower = raw.toLowerCase().trim();
    return CATEGORY_MAP[lower] || CATEGORY_MAP[raw.trim()] || '';
  };

  const parseCSV = (text: string): BulkItem[] => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]/g, ''));

    return lines.slice(1).map(line => {
      // Simple CSV parser handling quoted fields
      const values: string[] = [];
      let current = '';
      let inQuotes = false;
      for (const char of line) {
        if (char === '"') { inQuotes = !inQuotes; continue; }
        if (char === ',' && !inQuotes) { values.push(current.trim()); current = ''; continue; }
        current += char;
      }
      values.push(current.trim());

      const obj: any = {};
      headers.forEach((h, i) => { obj[h] = values[i] || ''; });

      return {
        name: obj.name || obj['নাম'] || '',
        description: obj.description || obj['বিবরণ'] || '',
        category: normalizeCategory(obj.category || obj['ক্যাটাগরি'] || ''),
        region: obj.region || obj['অঞ্চল'] || '',
        image_url: obj.image_url || obj['ছবি'] || '',
      } as BulkItem;
    }).filter(i => i.name.trim());
  };

  const parseJSON = (text: string): BulkItem[] => {
    try {
      const arr = JSON.parse(text);
      if (!Array.isArray(arr)) return [];
      return arr.map((obj: any) => ({
        name: obj.name || obj['নাম'] || '',
        description: obj.description || obj['বিবরণ'] || '',
        category: normalizeCategory(obj.category || obj['ক্যাটাগরি'] || ''),
        region: obj.region || obj['অঞ্চল'] || '',
        image_url: obj.image_url || obj['ছবি'] || '',
      })).filter((i: BulkItem) => i.name.trim());
    } catch { return []; }
  };

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    let parsed: BulkItem[] = [];

    if (file.name.endsWith('.json')) {
      parsed = parseJSON(text);
    } else {
      parsed = parseCSV(text);
    }

    if (parsed.length === 0) {
      toast.error(t('ফাইলে কোনো আইটেম পাওয়া যায়নি', 'No items found in file'));
      return;
    }

    // Validate & check duplicates
    const existingLower = existingNames.map(n => n.toLowerCase());
    const seenNames = new Set<string>();

    const validated = parsed.map(item => {
      const errors: string[] = [];
      if (!item.name.trim()) errors.push(t('নাম নেই', 'Missing name'));
      if (!item.description.trim()) errors.push(t('বিবরণ নেই', 'Missing description'));
      if (!item.category || !VALID_CATEGORIES.includes(item.category)) errors.push(t('ক্যাটাগরি ভুল', 'Invalid category'));

      const nameLower = item.name.toLowerCase().trim();
      const isDuplicate = existingLower.includes(nameLower) || seenNames.has(nameLower);
      seenNames.add(nameLower);

      return {
        ...item,
        _status: errors.length > 0 ? 'error' as const : isDuplicate ? 'duplicate' as const : 'valid' as const,
        _error: errors.length > 0 ? errors.join(', ') : isDuplicate ? t('ডুপ্লিকেট', 'Duplicate') : undefined,
      };
    });

    setItems(validated);
    setStep('preview');

    // Auto-translate valid items
    setTranslating(true);
    const translated = await Promise.all(
      validated.map(async item => {
        if (item._status !== 'valid') return item;
        const [name_en, description_en, location_en] = await Promise.all([
          translateText(item.name),
          translateText(item.description),
          item.region ? translateText(item.region) : Promise.resolve(''),
        ]);
        return { ...item, name_en, description_en, location_en };
      })
    );
    setItems(translated);
    setTranslating(false);
  }, [existingNames]);

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleInsert = async () => {
    const validItems = items.filter(i => i._status === 'valid');
    if (validItems.length === 0) { toast.error(t('কোনো বৈধ আইটেম নেই', 'No valid items')); return; }

    setStep('inserting');
    setProgress(0);
    let inserted = 0;

    for (let i = 0; i < validItems.length; i++) {
      const item = validItems[i];
      const { error } = await supabase.from('items').insert({
        name: item.name.trim(),
        name_en: item.name_en || null,
        description: item.description.trim(),
        description_en: item.description_en || null,
        category: item.category,
        location: item.region?.trim() || null,
        location_en: item.location_en || null,
        image_url: item.image_url?.trim() || null,
      });
      if (!error) inserted++;
      setProgress(Math.round(((i + 1) / validItems.length) * 100));
    }

    toast.success(t(`${inserted}টি আইটেম যোগ হয়েছে!`, `${inserted} items added!`));
    queryClient.invalidateQueries({ queryKey: ['items'] });
    onComplete();
    setItems([]);
    setStep('upload');
  };

  const validCount = items.filter(i => i._status === 'valid').length;
  const dupCount = items.filter(i => i._status === 'duplicate').length;
  const errCount = items.filter(i => i._status === 'error').length;

  return (
    <div className="glass-card p-5 md:p-6 mb-6">
      <h3 className="font-heading text-lg font-bold text-foreground mb-4 flex items-center gap-2">
        <Upload className="w-5 h-5" /> {t('বাল্ক আপলোড', 'Bulk Upload')}
      </h3>

      {step === 'upload' && (
        <div>
          <p className="text-sm text-muted-foreground font-body mb-4">
            {t('CSV বা JSON ফাইল আপলোড করুন। ফরম্যাট: name, description, category, region, image_url',
              'Upload CSV or JSON file. Format: name, description, category, region, image_url')}
          </p>
          <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors">
            <label className="cursor-pointer">
              <FileText className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm font-body text-muted-foreground mb-1">{t('ফাইল নির্বাচন করুন', 'Choose a file')}</p>
              <p className="text-[10px] text-muted-foreground/60">.csv, .json</p>
              <input type="file" accept=".csv,.json" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
          {/* Sample format hint */}
          <div className="mt-4 p-3 rounded-xl bg-secondary/50 text-xs font-mono text-muted-foreground">
            <p className="font-body font-semibold mb-1">{t('CSV উদাহরণ:', 'CSV Example:')}</p>
            <p>name,description,category,region,image_url</p>
            <p>ইলিশ,বাংলাদেশের জাতীয় মাছ,মাছ,পদ্মা নদী,</p>
          </div>
        </div>
      )}

      {step === 'preview' && (
        <div>
          {/* Summary */}
          <div className="flex gap-3 mb-4 text-xs font-body">
            <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary">✓ {validCount} {t('বৈধ', 'valid')}</span>
            {dupCount > 0 && <span className="px-2.5 py-1 rounded-full bg-accent/20 text-accent-foreground">⚠ {dupCount} {t('ডুপ্লিকেট', 'duplicate')}</span>}
            {errCount > 0 && <span className="px-2.5 py-1 rounded-full bg-destructive/10 text-destructive">✗ {errCount} {t('ত্রুটি', 'error')}</span>}
          </div>

          {translating && (
            <div className="flex items-center gap-2 text-xs text-primary font-body mb-3">
              <Loader2 className="w-3 h-3 animate-spin" /> {t('অনুবাদ হচ্ছে...', 'Translating...')}
            </div>
          )}

          {/* Items list */}
          <div className="max-h-[300px] overflow-y-auto space-y-2 mb-4">
            {items.map((item, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-xl text-sm ${
                item._status === 'valid' ? 'bg-primary/5 border border-primary/20' :
                item._status === 'duplicate' ? 'bg-yellow-500/5 border border-yellow-500/20' :
                'bg-destructive/5 border border-destructive/20'
              }`}>
                <div className="flex-shrink-0">
                  {item._status === 'valid' ? <Check className="w-4 h-4 text-primary" /> :
                   item._status === 'duplicate' ? <AlertTriangle className="w-4 h-4 text-yellow-500" /> :
                   <X className="w-4 h-4 text-destructive" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-heading text-sm font-bold truncate">{item.name}</p>
                  <p className="text-[10px] text-muted-foreground font-body truncate">
                    {item.category} {item.name_en && `• ${item.name_en}`}
                  </p>
                  {item._error && <p className="text-[10px] text-destructive">{item._error}</p>}
                </div>
                <button onClick={() => removeItem(i)} className="p-1 rounded hover:bg-secondary flex-shrink-0">
                  <X className="w-3 h-3 text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={() => { setItems([]); setStep('upload'); }}
              className="flex-1 py-2.5 rounded-xl bg-secondary text-foreground text-sm font-body font-medium hover:bg-secondary/80 transition-colors">
              {t('বাতিল', 'Cancel')}
            </button>
            <button onClick={handleInsert} disabled={validCount === 0 || translating}
              className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-body font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              <Upload className="w-4 h-4" /> {t(`${validCount}টি যোগ করুন`, `Add ${validCount} items`)}
            </button>
          </div>
        </div>
      )}

      {step === 'inserting' && (
        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="font-body text-sm text-muted-foreground mb-2">{t('আইটেম যোগ হচ্ছে...', 'Inserting items...')}</p>
          <div className="w-full h-2 rounded-full bg-secondary overflow-hidden max-w-xs mx-auto">
            <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-muted-foreground mt-2">{progress}%</p>
        </div>
      )}
    </div>
  );
};

export default BulkUpload;
