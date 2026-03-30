import { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { FoodItem } from '@/data/content';

interface LightboxProps {
  items: FoodItem[];
  initialIndex: number;
  onClose: () => void;
}

const Lightbox = ({ items, initialIndex, onClose }: LightboxProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number; dist: number } | null>(null);
  const lastTapRef = useRef(0);
  const { lang } = useLanguage();

  const item = items[currentIndex];
  const name = lang === 'bn' ? item?.name : item?.nameEn;

  // Animate in
  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const close = useCallback(() => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  }, [onClose]);

  const goNext = useCallback(() => {
    setScale(1);
    setCurrentIndex(i => (i + 1) % items.length);
  }, [items.length]);

  const goPrev = useCallback(() => {
    setScale(1);
    setCurrentIndex(i => (i - 1 + items.length) % items.length);
  }, [items.length]);

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [close, goNext, goPrev]);

  // Touch handlers for swipe + pinch
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStartRef.current = { x: 0, y: 0, dist };
    } else if (e.touches.length === 1) {
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, dist: 0 };
      // Double tap detection
      const now = Date.now();
      if (now - lastTapRef.current < 300) {
        setScale(s => s > 1 ? 1 : 2.5);
      }
      lastTapRef.current = now;
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || e.changedTouches.length !== 1) return;
    if (scale > 1) return; // Don't swipe while zoomed
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) goNext();
      else goPrev();
    }
    touchStartRef.current = null;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current || e.touches.length !== 2) return;
    const dist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
    const ratio = dist / touchStartRef.current.dist;
    setScale(Math.min(4, Math.max(1, ratio * scale)));
  };

  if (!item) return null;

  const hasImage = item.image && item.image.startsWith('http');

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      onClick={close}
    >
      {/* Blurred dark backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" />

      {/* Close button */}
      <button
        onClick={close}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm">
        <span className="text-white text-sm font-accent">
          {currentIndex + 1} / {items.length}
        </span>
      </div>

      {/* Nav arrows - desktop */}
      <button
        onClick={(e) => { e.stopPropagation(); goPrev(); }}
        className="absolute left-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors hidden md:flex"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); goNext(); }}
        className="absolute right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors hidden md:flex"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Image */}
      <div
        className={`relative max-w-[90vw] max-h-[80vh] transition-all duration-300 ${isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onTouchMove={onTouchMove}
      >
        {hasImage ? (
          <img
            src={item.image}
            alt={name}
            className="max-w-full max-h-[75vh] object-contain rounded-2xl transition-transform duration-200"
            style={{ transform: `scale(${scale})` }}
            draggable={false}
          />
        ) : (
          <div className="w-64 h-64 flex items-center justify-center bg-secondary rounded-2xl">
            <span className="text-6xl">🍽️</span>
          </div>
        )}
        {/* Caption */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent rounded-b-2xl">
          <p className="text-white font-heading text-lg font-bold text-center">{name}</p>
        </div>
      </div>
    </div>
  );
};

export default Lightbox;
