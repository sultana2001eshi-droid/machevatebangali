import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { Trophy } from 'lucide-react';

interface Props {
  gameName: string;
  currentScore: number;
  onClose: () => void;
}

const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];

const Leaderboard = ({ gameName, currentScore, onClose }: Props) => {
  const { t } = useLanguage();
  const { scores, submitScore } = useLeaderboard(gameName);
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (currentScore <= 0) return;
    submitScore.mutate({ playerName: name || 'Anonymous', score: currentScore });
    setSubmitted(true);
  };

  return (
    <div className="mt-4 p-4 rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-3">
        <Trophy className="w-4 h-4 text-gold" />
        <h4 className="font-heading text-sm font-bold text-foreground">
          {t('লিডারবোর্ড', 'Leaderboard')}
        </h4>
      </div>

      {/* Score list */}
      {scores.length > 0 ? (
        <div className="space-y-1.5 mb-3">
          {scores.map((s, i) => (
            <div key={s.id} className="flex items-center justify-between text-xs font-body px-2 py-1.5 rounded-lg bg-secondary/50">
              <span className="flex items-center gap-2">
                <span>{medals[i] || `${i + 1}.`}</span>
                <span className="font-medium text-foreground truncate max-w-[120px]">{s.player_name}</span>
              </span>
              <span className="font-accent font-bold text-foreground">{s.score}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground font-body mb-3">
          {t('এখনো কোনো স্কোর নেই', 'No scores yet')}
        </p>
      )}

      {/* Submit score */}
      {!submitted && currentScore > 0 && (
        <div className="flex gap-2">
          <input
            type="text"
            placeholder={t('আপনার নাম', 'Your name')}
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={20}
            className="flex-1 px-3 py-1.5 rounded-lg border border-border/50 bg-background text-xs font-body focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            onClick={handleSubmit}
            disabled={submitScore.isPending}
            className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-body font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {submitScore.isPending ? '...' : t('সেভ', 'Save')}
          </button>
        </div>
      )}
      {submitted && (
        <p className="text-xs text-center text-green-600 font-body">
          ✅ {t('স্কোর সেভ হয়েছে!', 'Score saved!')}
        </p>
      )}
    </div>
  );
};

export default Leaderboard;
