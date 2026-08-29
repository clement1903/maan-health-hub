-- 1. Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'patient');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY user_roles_select_own ON public.user_roles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY user_roles_admin_manage ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 2. Phone on profile
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text;

CREATE POLICY profiles_admin_select ON public.profiles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 3. Admin access on patient data
CREATE POLICY questionnaires_admin_all ON public.questionnaires
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY orders_admin_all ON public.orders
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY order_events_admin_all ON public.order_events
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 4. Notifications
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  channel text NOT NULL DEFAULT 'email',
  recipient text,
  subject text NOT NULL,
  body text NOT NULL,
  status text NOT NULL DEFAULT 'en_attente',
  error text,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY notifications_select_own ON public.notifications
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY notifications_admin_all ON public.notifications
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER notifications_updated_at
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_notifications_status ON public.notifications (status, created_at);
CREATE INDEX idx_notifications_user ON public.notifications (user_id, created_at DESC);

-- 5. Automatic event + notification on order status change
CREATE OR REPLACE FUNCTION public.on_order_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  label_text text;
  detail_text text;
  prof record;
BEGIN
  IF NEW.status IS NOT DISTINCT FROM OLD.status THEN
    RETURN NEW;
  END IF;

  label_text := CASE NEW.status
    WHEN 'en_attente_validation' THEN 'En attente de validation médicale'
    WHEN 'prescription_validee' THEN 'Prescription validée'
    WHEN 'en_preparation' THEN 'Préparation en pharmacie'
    WHEN 'expedie' THEN 'Colis expédié'
    WHEN 'livre' THEN 'Colis livré'
    WHEN 'refuse' THEN 'Demande non retenue'
    ELSE NEW.status
  END;

  detail_text := CASE NEW.status
    WHEN 'prescription_validee' THEN 'Un médecin a validé votre prescription.'
    WHEN 'en_preparation' THEN 'La pharmacie partenaire prépare votre traitement.'
    WHEN 'expedie' THEN COALESCE('Expédié via ' || NEW.carrier || COALESCE(' — suivi ' || NEW.tracking_number, ''), 'Votre colis a été expédié.')
    WHEN 'livre' THEN 'Votre colis a été livré.'
    WHEN 'refuse' THEN 'Le médecin n''a pas retenu votre demande. Consultez votre espace patient.'
    ELSE 'Mise à jour de votre commande.'
  END;

  INSERT INTO public.order_events (order_id, user_id, label, detail)
  VALUES (NEW.id, NEW.user_id, label_text, detail_text);

  SELECT email, phone INTO prof FROM public.profiles WHERE id = NEW.user_id;

  INSERT INTO public.notifications (user_id, order_id, channel, recipient, subject, body)
  VALUES (
    NEW.user_id,
    NEW.id,
    'email',
    prof.email,
    'MAAN — ' || label_text || ' (' || NEW.reference || ')',
    detail_text
  );

  IF prof.phone IS NOT NULL AND length(trim(prof.phone)) > 0 THEN
    INSERT INTO public.notifications (user_id, order_id, channel, recipient, subject, body)
    VALUES (
      NEW.user_id,
      NEW.id,
      'sms',
      prof.phone,
      'MAAN ' || NEW.reference,
      'MAAN — ' || label_text || '. ' || detail_text
    );
  END IF;

  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.on_order_status_change() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER orders_status_change
  AFTER UPDATE OF status ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.on_order_status_change();