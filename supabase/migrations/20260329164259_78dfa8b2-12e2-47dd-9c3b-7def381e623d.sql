
CREATE TABLE public.game_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text NOT NULL DEFAULT 'Anonymous',
  game_name text NOT NULL,
  score integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.game_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read game_scores" ON public.game_scores FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can insert game_scores" ON public.game_scores FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE INDEX idx_game_scores_game_name ON public.game_scores(game_name);
CREATE INDEX idx_game_scores_top ON public.game_scores(game_name, score DESC);
