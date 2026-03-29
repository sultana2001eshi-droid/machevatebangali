import { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useItems, dbItemToFoodItem } from '@/hooks/useItems';
import type { FoodItem } from '@/data/content';
import { X } from 'lucide-react';
import Leaderboard from './Leaderboard';

type GameState = 'start' | 'playing' | 'paused';

const RiceRunnerGame = () => {
  const { t } = useLanguage();
  const { data: dbItems } = useItems();
  const [selectedRice, setSelectedRice] = useState<FoodItem | null>(null);
  const [gameState, setGameState] = useState<GameState>('start');
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const riceTypes = (dbItems || []).map(dbItemToFoodItem).filter(i => i.category === 'rice-type');

  // Increase speed over time
  useEffect(() => {
    if (gameState !== 'playing') return;
    const interval = setInterval(() => setSpeed(s => Math.min(s + 0.1, 3)), 8000);
    return () => clearInterval(interval);
  }, [gameState]);

  const handleSelect = (rice: FoodItem) => {
    setSelectedRice(rice);
    setScore(s => s + 10);
    setGameState('paused');
  };

  const handleClose = () => {
    setSelectedRice(null);
    setGameState('playing');
  };

  const handleStart = () => { setScore(0); setSpeed(1); setGameState('playing'); };

  if (riceTypes.length === 0) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/50 min-h-[340px]"
      style={{ background: 'linear-gradient(135deg, hsl(120 30% 92%), hsl(80 40% 88%), hsl(45 50% 90%))' }}>
      {/* Decorative paddy field bg */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute bottom-0 left-0 right-0 h-1/3" style={{
          background: 'repeating-linear-gradient(90deg, hsl(120 40% 40%) 0px, hsl(120 40% 50%) 2px, transparent 2px, transparent 20px)',
        }} />
      </div>

      <div className="relative z-10 p-6">
        <h3 className="font-heading text-xl font-bold text-foreground mb-1 flex items-center gap-2">
          <span className="text-2xl">🌾</span> {t('চাল ধরুন', 'Catch the Rice')}
        </h3>
        <div className="flex items-center gap-3 mb-4">
          <p className="text-sm text-muted-foreground font-body">
            {t('ভেসে যাওয়া চালে ট্যাপ করুন!', 'Tap on floating rice!')}
          </p>
          {gameState !== 'start' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gold/20 text-gold-foreground text-xs font-semibold font-accent">
              🏆 {score}
            </span>
          )}
        </div>
      </div>

      {/* Start screen */}
      {gameState === 'start' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="text-center">
            <p className="text-5xl mb-4">🌾</p>
            <button onClick={handleStart}
              className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-body font-semibold text-sm hover:scale-105 transition-transform shadow-lg">
              {t('খেলা শুরু', 'Start Game')}
            </button>
          </div>
        </div>
      )}

      {/* Game area */}
      {(gameState === 'playing' || gameState === 'paused') && (
        <div ref={containerRef} className="relative h-[220px] overflow-hidden mx-6">
          {riceTypes.map((rice, i) => (
            <button
              key={rice.id}
              onClick={() => handleSelect(rice)}
              className="absolute group cursor-pointer focus:outline-none"
              style={{
                animation: gameState === 'paused' ? 'none' : `floatRice ${(8 / speed) + i * 1.2}s linear infinite`,
                animationDelay: `${i * -2}s`,
                top: `${10 + (i % 4) * 48}px`,
              }}
            >
              <div className="glass-card px-4 py-2.5 flex items-center gap-2 hover:scale-110 transition-transform duration-300 hover:shadow-lg hover:shadow-gold/20 whitespace-nowrap border border-gold/20">
                {rice.image && rice.image.startsWith('http') ? (
                  <img src={rice.image} alt="" className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <span className="text-lg">🍚</span>
                )}
                <span className="font-heading text-sm font-semibold text-foreground">
                  {t(rice.name, rice.nameEn)}
                </span>
              </div>
            </button>
          ))}

          {/* Obstacles */}
          {[0, 1, 2].map(i => (
            <div key={`obs-${i}`} className="absolute text-2xl pointer-events-none opacity-40"
              style={{
                animation: gameState === 'paused' ? 'none' : `floatRice ${(6 / speed)}s linear infinite`,
                animationDelay: `${i * -3}s`,
                top: `${30 + i * 60}px`,
              }}>
              🌿
            </div>
          ))}
        </div>
      )}

      {/* Info modal */}
      {selectedRice && (
        <div className="absolute inset-0 z-30 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={handleClose} />
          <div className="glass-card relative z-10 max-w-sm w-full p-5 border border-gold/30 shadow-xl animate-scale-in">
            <button onClick={handleClose} className="absolute top-3 right-3 p-1 rounded-lg hover:bg-secondary transition-colors">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
            <div className="flex items-center gap-3 mb-3">
              {selectedRice.image && selectedRice.image.startsWith('http') ? (
                <img src={selectedRice.image} alt="" className="w-12 h-12 rounded-xl object-cover" />
              ) : (
                <span className="text-3xl">🌾</span>
              )}
              <div>
                <h4 className="font-heading text-lg font-bold text-foreground">{t(selectedRice.name, selectedRice.nameEn)}</h4>
                {selectedRice.region && <span className="text-xs text-muted-foreground font-body">{t(selectedRice.region, selectedRice.regionEn || '')}</span>}
              </div>
            </div>
            <Leaderboard gameName="rice-runner" currentScore={score} onClose={handleClose} />
            <div className="flex gap-2 mt-3">
              <button onClick={handleClose} className="flex-1 px-3 py-2 rounded-lg bg-secondary text-sm font-medium transition-colors">
                {t('চালিয়ে যান 🌾', 'Continue 🌾')}
              </button>
              <a href="#explore" onClick={handleClose} className="flex-1 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium text-center transition-colors">
                {t('বিস্তারিত →', 'Details →')}
              </a>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes floatRice {
          0% { transform: translateX(calc(100vw + 50px)); }
          100% { transform: translateX(-300px); }
        }
      `}</style>
    </div>
  );
};

export default RiceRunnerGame;
