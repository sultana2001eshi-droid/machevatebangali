import { useState, useEffect, useCallback, useRef } from 'react';
import type { FoodItem } from '@/data/content';

const DISPLAY_COUNT = 6;
const SWAP_INTERVAL = 25000; // 25 seconds

/**
 * Smart auto-swap hook: always returns exactly `DISPLAY_COUNT` items,
 * rotating through the full pool with diversity and no-repeat logic.
 */
export function useAutoSwap(allItems: FoodItem[]) {
  const [displayItems, setDisplayItems] = useState<FoodItem[]>([]);
  const [fadingIndices, setFadingIndices] = useState<Set<number>>(new Set());
  const shownIdsRef = useRef<Set<string>>(new Set());
  const prevSetRef = useRef<Set<string>>(new Set());

  // Pick a diverse set of DISPLAY_COUNT from pool, avoiding recently shown
  const pickDiverseSet = useCallback((pool: FoodItem[], avoid: Set<string>): FoodItem[] => {
    if (pool.length <= DISPLAY_COUNT) return [...pool];

    // Group by subcategory for diversity
    const bySubcat = new Map<string, FoodItem[]>();
    for (const item of pool) {
      const key = item.subCategoryEn || item.category || 'other';
      if (!bySubcat.has(key)) bySubcat.set(key, []);
      bySubcat.get(key)!.push(item);
    }

    const result: FoodItem[] = [];
    const usedIds = new Set<string>();

    // Round-robin from subcategories, preferring unseen items
    const subcats = Array.from(bySubcat.keys());
    // Shuffle subcategories
    for (let i = subcats.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [subcats[i], subcats[j]] = [subcats[j], subcats[i]];
    }

    // First pass: pick one unseen item from each subcategory
    for (const key of subcats) {
      if (result.length >= DISPLAY_COUNT) break;
      const candidates = bySubcat.get(key)!.filter(
        it => !usedIds.has(it.id) && !avoid.has(it.id)
      );
      if (candidates.length > 0) {
        const pick = candidates[Math.floor(Math.random() * candidates.length)];
        result.push(pick);
        usedIds.add(pick.id);
      }
    }

    // Second pass: fill remaining slots from any unseen items
    if (result.length < DISPLAY_COUNT) {
      const remaining = pool.filter(it => !usedIds.has(it.id) && !avoid.has(it.id));
      // Shuffle
      for (let i = remaining.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
      }
      for (const item of remaining) {
        if (result.length >= DISPLAY_COUNT) break;
        result.push(item);
        usedIds.add(item.id);
      }
    }

    // Third pass: if still short, allow previously shown items
    if (result.length < DISPLAY_COUNT) {
      const fallback = pool.filter(it => !usedIds.has(it.id));
      for (let i = fallback.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [fallback[i], fallback[j]] = [fallback[j], fallback[i]];
      }
      for (const item of fallback) {
        if (result.length >= DISPLAY_COUNT) break;
        result.push(item);
        usedIds.add(item.id);
      }
    }

    return result;
  }, []);

  // Initialize
  useEffect(() => {
    if (allItems.length === 0) return;
    const initial = pickDiverseSet(allItems, new Set());
    setDisplayItems(initial);
    prevSetRef.current = new Set(initial.map(i => i.id));
    initial.forEach(i => shownIdsRef.current.add(i.id));
  }, [allItems, pickDiverseSet]);

  // Auto-rotate
  useEffect(() => {
    if (allItems.length <= DISPLAY_COUNT) return;

    const interval = setInterval(() => {
      // Reset shown tracking if we've seen most items
      if (shownIdsRef.current.size >= allItems.length * 0.8) {
        shownIdsRef.current = new Set();
      }

      const newSet = pickDiverseSet(allItems, prevSetRef.current);

      // Determine which card positions are changing
      const changingIndices = new Set<number>();
      newSet.forEach((item, idx) => {
        if (!displayItems[idx] || displayItems[idx].id !== item.id) {
          changingIndices.add(idx);
        }
      });

      // Staggered fade-out
      setFadingIndices(changingIndices);

      setTimeout(() => {
        setDisplayItems(newSet);
        prevSetRef.current = new Set(newSet.map(i => i.id));
        newSet.forEach(i => shownIdsRef.current.add(i.id));

        // Fade back in after content swap
        setTimeout(() => setFadingIndices(new Set()), 50);
      }, 400);
    }, SWAP_INTERVAL);

    return () => clearInterval(interval);
  }, [allItems, displayItems, pickDiverseSet]);

  return { displayItems, fadingIndices };
}
