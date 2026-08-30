ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS delivery_method text NOT NULL DEFAULT 'standard',
  ADD COLUMN IF NOT EXISTS delivery_address jsonb,
  ADD COLUMN IF NOT EXISTS delivery_eta_min_days integer,
  ADD COLUMN IF NOT EXISTS delivery_eta_max_days integer,
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'non_paye',
  ADD COLUMN IF NOT EXISTS amount_cents integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS payment_reference text,
  ADD COLUMN IF NOT EXISTS paid_at timestamptz;