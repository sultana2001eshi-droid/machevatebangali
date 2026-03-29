import { useState, useCallback, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useItems, dbItemToFoodItem } from '@/hooks/useItems';
import type { FoodItem } from '@/data/content';
import { X, RotateCcw } from 'lucide-react';
import Leaderboard from './Leaderboard';

type GameState = 'start' | 'playing' | 'info';

interface SwimmingFish {
  id: string;
  item: FoodItem;
  x: number;
  y: number;
  speed: number;
  direction: 1 | -1;
  size: number;
}

const FishingGame = () => {
  const { t, lang } = useLanguage();
  const { data: dbItems } = useItems();
  const [gameState, setGameState] = useState<GameState>('start');
  const [score, setScore] = useState(0);
  const [caughtFish, setCaughtFish] = useState<FoodItem | null>(null);
  const [fishes, setFishes] = useState<SwimmingFish[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const animRef = useRef<number>();
  const lastTimeRef = useRef(0);

  const fishItems = (dbItems || []).map(dbItemToFoodItem).filter(i => i.category === 'fish');

  const initFishes = useCallback(() => {
    return fishItems.slice(0, 8).map((item, i) => ({
      id: `${item.id}-${i}`,
      item,
      x: Math.random() * 80 + 10,
      y: 20 + (i % 4) * 18,
      speed: 0.3 + Math.random() * 0.4,
      direction: (i % 2 === 0 ? 1 : -1) as 1 | -1,
      size: 0.8 + Math.random() * 0.5,
    }));
  }, [fishItems]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setFishes(initFishes());
    setGameState('playing');
    setCaughtFish(null);
  };

  // Animate fish movement
  useEffect(() => {
    if (gameState !== 'playing') return;
    const animate = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const delta = (time - lastTimeRef.current) / 16; // normalize to ~60fps
      lastTimeRef.current = time;

      setFishes(prev => prev.map(f => {
        let newX = f.x + f.speed * f.direction * delta;
        let newDir = f.direction;
        if (newX > 90) { newX = 90; newDir = -1; }
        if (newX < 5) { newX = 5; newDir = 1; }
        // Gentle sine wave vertical
        const newY = f.y + Math.sin(time / 1000 + parseInt(f.id)) * 0.05;
        return { ...f, x: newX, y: Math.max(10, Math.min(80, newY)), direction: newDir };
      }));

      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); lastTimeRef.current = 0; };
  }, [gameState]);

  // Timer
  useEffect(() => {
    if (gameState !== 'playing') return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { setGameState('start'); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState]);

  const handleCatch = (fish: SwimmingFish) => {
    setScore(s => s + 10);
    setCaughtFish(fish.item);
    setFishes(prev => prev.filter(f => f.id !== fish.id));
    setGameState('info');
  };

  const handleCloseInfo = () => {
    setCaughtFish(null);
    // Respawn a fish
    if (fishItems.length > 0) {
      const randomItem = fishItems[Math.floor(Math.random() * fishItems.length)];
      setFishes(prev => [...prev, {
        id: `${randomItem.id}-${Date.now()}`,
        item: randomItem,
        x: Math.random() > 0.5 ? -5 : 95,
        y: 20 + Math.random() * 60,
        speed: 0.3 + Math.random() * 0.4,
        direction: Math.random() > 0.5 ? 1 : -1,
        size: 0.8 + Math.random() * 0.5,
      }]);
    }
    setGameState('playing');
  };

  if (fishItems.length === 0) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/50 min-h-[380px]"
      style={{ background: 'linear-gradient(180deg, hsl(200 50% 85%) 0%, hsl(210 60% 70%) 40%, hsl(220 50% 45%) 100%)' }}>

      {/* Water surface line */}
      <div className="absolute top-[35%] left-0 right-0 h-1 opacity-30"
        style={{ background: 'linear-gradient(90deg, transparent, hsl(200 80% 90%), transparent)', animation: 'waveMove 3s ease-in-out infinite' }} />

      {/* Bubbles */}
      {[1,2,3,4,5].map(i => (
        <div key={i} className="absolute rounded-full bg-white/20 pointer-events-none"
          style={{
            width: `${4 + i * 2}px`, height: `${4 + i * 2}px`,
            left: `${10 + i * 18}%`,
            animation: `bubble ${3 + i}s ease-in-out infinite`,
            animationDelay: `${i * 0.5}s`,
          }} />
      ))}

      <div className="relative z-10 p-6">
        <h3 className="font-heading text-xl font-bold mb-1 flex items-center gap-2" style={{ color: 'hsl(210 20% 15%)' }}>
          <span className="text-2xl">🎣</span> {t('মাছ ধরুন', 'Catch Fish')}
        </h3>
        <div className="flex items-center gap-3 mb-2">
          <p className="text-sm font-body" style={{ color: 'hsl(210 15% 30%)' }}>
            {t('মাছে ট্যাপ করে ধরুন!', 'Tap fish to catch them!')}
          </p>
          {gameState !== 'start' && (
            <>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/30 text-xs font-semibold">🏆 {score}</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/30 text-xs font-semibold">⏱ {timeLeft}s</span>
            </>
          )}
        </div>
      </div>

      {/* Start / Game Over screen */}
      {gameState === 'start' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="text-center">
            {score > 0 && (
              <div className="mb-4">
                <p className="text-4xl mb-2">🎉</p>
                <p className="font-heading text-xl font-bold text-white">{t('সময় শেষ!', 'Time\'s Up!')}</p>
                <p className="font-accent text-lg text-gold font-bold">🏆 {score}</p>
                <Leaderboard gameName="fishing" currentScore={score} onClose={() => {}} />
              </div>
            )}
            {score === 0 && <p className="text-5xl mb-4">🐟</p>}
            <button onClick={startGame}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-primary-foreground font-body font-semibold text-sm hover:scale-105 transition-transform shadow-lg">
              {score > 0 ? <><RotateCcw className="w-4 h-4" />{t('আবার খেলুন', 'Play Again')}</> : t('খেলা শুরু', 'Start Game')}
            </button>
          </div>
        </div>
      )}

      {/* Swimming fish */}
      {(gameState === 'playing' || gameState === 'info') && (
        <div className="absolute inset-0" style={{ top: '35%' }}>
          {fishes.map(fish => (
            <button
              key={fish.id}
              onClick={() => gameState === 'playing' && handleCatch(fish)}
              className="absolute transition-none cursor-pointer focus:outline-none group"
              style={{
                left: `${fish.x}%`,
                top: `${fish.y}%`,
                transform: `scaleX(${fish.direction}) scale(${fish.size})`,
              }}
            >
              <div className="relative">
                {fish.item.image && fish.item.image.startsWith('http') ? (
                  <img src={fish.item.image} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-white/40 group-hover:border-gold group-hover:scale-110 transition-all" />
                ) : (
                  <span className="text-3xl block group-hover:scale-125 transition-transform">🐟</span>
                )}
                {/* Name tag on hover */}
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[9px] font-heading font-bold text-white bg-black/50 px-1.5 py-0.5 rounded whitespace-nowrap">
                  {lang === 'bn' ? fish.item.name : fish.item.nameEn}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Caught fish info */}
      {caughtFish && gameState === 'info' && (
        <div className="absolute inset-0 z-30 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={handleCloseInfo} />
          <div className="glass-card relative z-10 max-w-sm w-full p-5 border border-gold/30 shadow-2xl animate-scale-in bg-card">
            <button onClick={handleCloseInfo} className="absolute top-3 right-3 p-1 rounded-lg hover:bg-secondary transition-colors">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
            <div className="text-center mb-3">
              {caughtFish.image && caughtFish.image.startsWith('http') ? (
                <img src={caughtFish.image} alt="" className="w-16 h-16 rounded-xl object-cover mx-auto mb-2" />
              ) : (
                <span className="text-4xl block mb-1">🐟</span>
              )}
              <p className="text-xs text-gold font-accent">{t('মাছ ধরা পড়েছে!', 'Fish Caught!')}</p>
            </div>
            <h4 className="font-heading text-lg font-bold text-foreground text-center mb-1">
              {lang === 'bn' ? caughtFish.name : caughtFish.nameEn}
            </h4>
            <p className="text-xs text-muted-foreground text-center mb-3 font-accent">
              {lang === 'bn' ? caughtFish.subCategory : caughtFish.subCategoryEn}
            </p>
            <p className="text-sm text-muted-foreground font-body leading-relaxed mb-4 line-clamp-3 text-center">
              {lang === 'bn' ? caughtFish.description : caughtFish.descriptionEn}
            </p>
            <div className="flex gap-2 justify-center">
              <button onClick={handleCloseInfo}
                className="px-4 py-2 rounded-lg bg-secondary text-sm font-medium transition-colors">
                {t('চালিয়ে যান 🎣', 'Continue 🎣')}
              </button>
              <a href="#explore" onClick={handleCloseInfo}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-colors">
                {t('বিস্তারিত →', 'Details →')}
              </a>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes waveMove {
          0%, 100% { transform: translateX(-10px); }
          50% { transform: translateX(10px); }
        }
        @keyframes bubble {
          0%, 100% { transform: translateY(0); opacity: 0.2; }
          50% { transform: translateY(-40px); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

export default FishingGame;
