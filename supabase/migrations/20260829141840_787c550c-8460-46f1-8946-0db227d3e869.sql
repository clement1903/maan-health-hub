-- Préférences de notification et discrétion
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS notify_email boolean NOT NULL DEFAULT true;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS notify_sms boolean NOT NULL DEFAULT false;

-- 1. Documents du patient
CREATE TABLE public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  kind text NOT NULL DEFAULT 'ordonnance',
  title text NOT NULL,
  summary text,
  issued_by text,
  issued_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.documents TO authenticated;
GRANT ALL ON public.documents TO service_role;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY documents_select_own ON public.documents
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY documents_admin_all ON public.documents
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER documents_updated_at BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX idx_documents_user ON public.documents (user_id, issued_at DESC);

-- 2. Messagerie sécurisée
CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_role text NOT NULL CHECK (sender_role IN ('patient', 'soignant')),
  topic text NOT NULL DEFAULT 'general',
  body text NOT NULL CHECK (length(btrim(body)) > 0 AND length(body) <= 4000),
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.messages TO authenticated;
GRANT ALL ON public.messages TO service_role;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY messages_select_own ON public.messages
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY messages_insert_own ON public.messages
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND auth.uid() = sender_id AND sender_role = 'patient');
CREATE POLICY messages_admin_all ON public.messages
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_messages_user ON public.messages (user_id, created_at);

-- 3. Rendez-vous de suivi
CREATE TABLE public.follow_ups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  scheduled_for timestamptz NOT NULL,
  topic text NOT NULL DEFAULT 'suivi_traitement',
  note text,
  status text NOT NULL DEFAULT 'planifie' CHECK (status IN ('planifie','confirme','termine','annule')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.follow_ups TO authenticated;
GRANT ALL ON public.follow_ups TO service_role;
ALTER TABLE public.follow_ups ENABLE ROW LEVEL SECURITY;

CREATE POLICY follow_ups_select_own ON public.follow_ups
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY follow_ups_insert_own ON public.follow_ups
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY follow_ups_update_own ON public.follow_ups
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY follow_ups_admin_all ON public.follow_ups
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER follow_ups_updated_at BEFORE UPDATE ON public.follow_ups
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX idx_follow_ups_user ON public.follow_ups (user_id, scheduled_for);

-- 4. File de notifications discrète et respectueuse des préférences
CREATE OR REPLACE FUNCTION public.queue_notification(_user_id uuid, _order_id uuid, _subject text, _body text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE prof record;
BEGIN
  SELECT email, phone, notify_email, notify_sms INTO prof FROM public.profiles WHERE id = _user_id;
  IF prof.notify_email IS DISTINCT FROM false AND prof.email IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, order_id, channel, recipient, subject, body)
    VALUES (_user_id, _order_id, 'email', prof.email, _subject, _body);
  END IF;
  IF prof.notify_sms IS TRUE AND prof.phone IS NOT NULL AND length(btrim(prof.phone)) > 0 THEN
    INSERT INTO public.notifications (user_id, order_id, channel, recipient, subject, body)
    VALUES (_user_id, _order_id, 'sms', prof.phone, 'MAAN', _body);
  END IF;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.queue_notification(uuid, uuid, text, text) FROM PUBLIC, anon, authenticated;

-- Notifications d'état de commande : formulation discrète, sans nom de traitement
CREATE OR REPLACE FUNCTION public.on_order_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  label_text text;
  detail_text text;
  next_action text;
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
    WHEN 'en_preparation' THEN 'La pharmacie partenaire prépare votre commande.'
    WHEN 'expedie' THEN COALESCE('Expédié via ' || NEW.carrier || COALESCE(' — suivi ' || NEW.tracking_number, ''), 'Votre colis a été expédié.')
    WHEN 'livre' THEN 'Votre colis a été livré.'
    WHEN 'refuse' THEN 'Le médecin n''a pas retenu votre demande. Consultez votre espace patient.'
    ELSE 'Mise à jour de votre dossier.'
  END;

  next_action := CASE NEW.status
    WHEN 'prescription_validee' THEN 'Prochaine action : aucune, la préparation démarre.'
    WHEN 'expedie' THEN 'Prochaine action : réceptionnez votre colis neutre.'
    WHEN 'livre' THEN 'Prochaine action : planifiez votre point de suivi dans votre espace.'
    WHEN 'refuse' THEN 'Prochaine action : échangez avec l''équipe médicale par message sécurisé.'
    ELSE 'Prochaine action : suivez l''avancement dans votre espace.'
  END;

  INSERT INTO public.order_events (order_id, user_id, label, detail)
  VALUES (NEW.id, NEW.user_id, label_text, detail_text);

  PERFORM public.queue_notification(
    NEW.user_id,
    NEW.id,
    'MAAN — mise à jour de votre dossier (' || NEW.reference || ')',
    detail_text || ' ' || next_action
  );

  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.on_order_status_change() FROM PUBLIC, anon, authenticated;

-- Nouveau message de l'équipe médicale -> notification discrète
CREATE OR REPLACE FUNCTION public.on_secure_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.sender_role = 'soignant' THEN
    PERFORM public.queue_notification(
      NEW.user_id,
      NEW.order_id,
      'MAAN — nouveau message sécurisé',
      'Vous avez reçu un message dans votre espace patient. Prochaine action : connectez-vous pour le lire et répondre.'
    );
  END IF;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.on_secure_message() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER messages_notify AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.on_secure_message();

-- Planification d'un suivi -> notification discrète
CREATE OR REPLACE FUNCTION public.on_follow_up_scheduled()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.queue_notification(
    NEW.user_id,
    NEW.order_id,
    'MAAN — point de suivi planifié',
    'Votre point de suivi est prévu le ' || to_char(NEW.scheduled_for AT TIME ZONE 'Europe/Paris', 'DD/MM/YYYY à HH24:MI') || '. Prochaine action : préparez vos questions dans votre espace patient.'
  );
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.on_follow_up_scheduled() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER follow_ups_notify AFTER INSERT ON public.follow_ups
  FOR EACH ROW EXECUTE FUNCTION public.on_follow_up_scheduled();