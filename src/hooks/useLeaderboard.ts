import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface GameScore {
  id: string;
  player_name: string;
  game_name: string;
  score: number;
  created_at: string;
}

export const useLeaderboard = (gameName: string) => {
  const queryClient = useQueryClient();

  const { data: scores = [], isLoading } = useQuery({
    queryKey: ['leaderboard', gameName],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('game_scores')
        .select('*')
        .eq('game_name', gameName)
        .order('score', { ascending: false })
        .limit(5);
      if (error) throw error;
      return data as GameScore[];
    },
  });

  const submitScore = useMutation({
    mutationFn: async ({ playerName, score }: { playerName: string; score: number }) => {
      const { error } = await (supabase as any)
        .from('game_scores')
        .insert({ player_name: playerName || 'Anonymous', game_name: gameName, score });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaderboard', gameName] });
    },
  });

  return { scores, isLoading, submitScore };
};
