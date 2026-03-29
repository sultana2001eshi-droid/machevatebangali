import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useItems, dbItemToFoodItem } from '@/hooks/useItems';
import type { FoodItem } from '@/data/content';
import { X, RotateCcw } from 'lucide-react';

type GameState = 'start' | 'playing' | 'complete';

interface Card {
  id: string;
  item: FoodItem;
  flipped: boolean;
  matched: boolean;
}

const DiningTableGame = () => {
  const { t, lang } = useLanguage();
  const { data: dbItems } = useItems();
  const [gameState, setGameState] = useState<GameState>('start');
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [selectedDish, setSelectedDish] = useState<FoodItem | null>(null);

  const riceDishes = useMemo(() =>
    (dbItems || []).map(dbItemToFoodItem).filter(i => i.category === 'rice-dish'),
  [dbItems]);

  const startGame = useCallback(() => {
    const selected = riceDishes.slice(0, 6);
    // Create pairs
    const pairs = [...selected, ...selected].map((item, i) => ({
      id: `${item.id}-${i}`,
      item,
      flipped: false,
      matched: false,
    }));
    // Shuffle
    for (let i = pairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
    }
    setCards(pairs);
    setFlippedIds([]);
    setScore(0);
    setMoves(0);
    setGameState('playing');
  }, [riceDishes]);

  const handleCardClick = (cardId: string) => {
    if (flippedIds.length >= 2) return;
    const card = cards.find(c => c.id === cardId);
    if (!card || card.flipped || card.matched) return;

    const newFlipped = [...flippedIds, cardId];
    setFlippedIds(newFlipped);
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, flipped: true } : c));

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped.map(id => cards.find(c => c.id === id)!);
      const firstItem = cards.find(c => c.id === newFlipped[0])!;
      const secondItem = card;

      if (firstItem.item.id === secondItem.item.id) {
        // Match!
        setScore(s => s + 20);
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.item.id === firstItem.item.id ? { ...c, matched: true } : c
          ));
          setFlippedIds([]);
          // Check win
          setCards(prev => {
            const allMatched = prev.every(c => c.item.id === firstItem.item.id ? true : c.matched);
            if (allMatched || prev.filter(c => !c.matched).length <= 2) {
              setTimeout(() => setGameState('complete'), 500);
            }
            return prev.map(c => c.item.id === firstItem.item.id ? { ...c, matched: true } : c);
          });
        }, 400);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            newFlipped.includes(c.id) ? { ...c, flipped: false } : c
          ));
          setFlippedIds([]);
        }, 800);
      }
    }
  };

  if (riceDishes.length === 0) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/50 p-6"
      style={{ background: 'linear-gradient(135deg, hsl(25 40% 92%), hsl(35 50% 90%), hsl(15 30% 88%))' }}>

      <h3 className="font-heading text-xl font-bold text-foreground mb-1 flex items-center gap-2">
        <span className="text-2xl">🍽️</span> {t('মেমরি ম্যাচ', 'Memory Match')}
      </h3>
      <div className="flex items-center gap-3 mb-5">
        <p className="text-sm text-muted-foreground font-body">
          {t('জোড়া মিলান!', 'Find matching pairs!')}
        </p>
        {gameState !== 'start' && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gold/20 text-xs font-semibold font-accent">
            🏆 {score} • {moves} {t('চাল', 'moves')}
          </span>
        )}
      </div>

      {/* Start screen */}
      {gameState === 'start' && (
        <div className="text-center py-10">
          <p className="text-5xl mb-4">🍚</p>
          <p className="font-body text-sm text-muted-foreground mb-4">
            {t('ভাতের পদের জোড়া মিলান খেলা', 'Match pairs of rice dishes')}
          </p>
          <button onClick={startGame}
            className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-body font-semibold text-sm hover:scale-105 transition-transform shadow-lg">
            {t('খেলা শুরু', 'Start Game')}
          </button>
        </div>
      )}

      {/* Game grid */}
      {gameState === 'playing' && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
          {cards.map(card => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`aspect-square rounded-xl transition-all duration-300 transform ${
                card.matched ? 'scale-90 opacity-40' :
                card.flipped ? 'rotate-y-180 bg-card shadow-lg border-gold/30' :
                'bg-primary/10 hover:bg-primary/20 border-border/50'
              } border flex items-center justify-center`}
              disabled={card.matched || card.flipped}
            >
              {(card.flipped || card.matched) ? (
                <div className="text-center p-1">
                  {card.item.image && card.item.image.startsWith('http') ? (
                    <img src={card.item.image} alt="" className="w-10 h-10 rounded-lg object-cover mx-auto mb-1" />
                  ) : (
                    <span className="text-2xl block">🍚</span>
                  )}
                  <span className="font-heading text-[9px] sm:text-[10px] font-bold text-foreground leading-tight line-clamp-2">
                    {lang === 'bn' ? card.item.name : card.item.nameEn}
                  </span>
                </div>
              ) : (
                <span className="text-2xl">❓</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Complete screen */}
      {gameState === 'complete' && (
        <div className="text-center py-10 animate-scale-in">
          <p className="text-5xl mb-3">🎉</p>
          <h4 className="font-heading text-xl font-bold text-foreground mb-2">
            {t('অভিনন্দন!', 'Congratulations!')}
          </h4>
          <p className="font-body text-sm text-muted-foreground mb-1">
            {t(`${moves} চালে সম্পন্ন`, `Completed in ${moves} moves`)}
          </p>
          <p className="font-accent text-lg font-bold gold-accent mb-4">🏆 {score}</p>
          <button onClick={startGame}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-body font-semibold text-sm hover:scale-105 transition-transform">
            <RotateCcw className="w-4 h-4" /> {t('আবার খেলুন', 'Play Again')}
          </button>
        </div>
      )}
    </div>
  );
};

export default DiningTableGame;
