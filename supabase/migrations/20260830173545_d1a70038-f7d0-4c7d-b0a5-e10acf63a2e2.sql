ALTER TABLE public.questionnaires
  ADD COLUMN IF NOT EXISTS definition_id text,
  ADD COLUMN IF NOT EXISTS version text,
  ADD COLUMN IF NOT EXISTS shown_questions jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS triggered_rules jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS overall_signal text NOT NULL DEFAULT 'green',
  ADD COLUMN IF NOT EXISTS edit_log jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS submitted_at timestamptz;

CREATE TABLE IF NOT EXISTS public.questionnaire_drafts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  definition_id text NOT NULL,
  version text NOT NULL,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  current_question_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, definition_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.questionnaire_drafts TO authenticated;
GRANT ALL ON public.questionnaire_drafts TO service_role;

ALTER TABLE public.questionnaire_drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY questionnaire_drafts_own ON public.questionnaire_drafts
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY questionnaire_drafts_admin ON public.questionnaire_drafts
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TRIGGER questionnaire_drafts_updated_at
  BEFORE UPDATE ON public.questionnaire_drafts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();