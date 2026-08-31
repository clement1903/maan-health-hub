-- DOCTORS
CREATE TABLE public.doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role_fr text NOT NULL DEFAULT 'Médecin',
  role_en text NOT NULL DEFAULT 'Doctor',
  big text,
  photo_url text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.doctors TO authenticated;
GRANT ALL ON public.doctors TO service_role;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
CREATE POLICY doctors_select_authenticated ON public.doctors FOR SELECT TO authenticated USING (true);
CREATE POLICY doctors_admin_all ON public.doctors FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER doctors_updated_at BEFORE UPDATE ON public.doctors FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- CARE JOURNEYS
CREATE TABLE public.care_journeys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  questionnaire_id uuid REFERENCES public.questionnaires(id) ON DELETE SET NULL,
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  domain text NOT NULL DEFAULT 'sexual',
  title text NOT NULL,
  condition_fr text NOT NULL DEFAULT '',
  condition_en text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'SUBMITTED',
  stage_index integer NOT NULL DEFAULT 0,
  doctor_id uuid REFERENCES public.doctors(id) ON DELETE SET NULL,
  stages jsonb NOT NULL DEFAULT '[]'::jsonb,
  treatment jsonb,
  delivery jsonb,
  follow_up jsonb NOT NULL DEFAULT '{"due": false}'::jsonb,
  plan jsonb,
  progress jsonb,
  photos_enabled boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX care_journeys_user_idx ON public.care_journeys(user_id);
GRANT SELECT, INSERT, UPDATE ON public.care_journeys TO authenticated;
GRANT ALL ON public.care_journeys TO service_role;
ALTER TABLE public.care_journeys ENABLE ROW LEVEL SECURITY;
CREATE POLICY care_journeys_select_own ON public.care_journeys FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY care_journeys_insert_own ON public.care_journeys FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY care_journeys_update_own ON public.care_journeys FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY care_journeys_admin_all ON public.care_journeys FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER care_journeys_updated_at BEFORE UPDATE ON public.care_journeys FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Patients cannot move clinical fields themselves
CREATE OR REPLACE FUNCTION public.guard_care_journey_update()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.has_role(auth.uid(), 'admin') OR auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;
  NEW.status := OLD.status;
  NEW.stage_index := OLD.stage_index;
  NEW.doctor_id := OLD.doctor_id;
  NEW.treatment := OLD.treatment;
  NEW.delivery := OLD.delivery;
  NEW.questionnaire_id := OLD.questionnaire_id;
  RETURN NEW;
END;
$$;
CREATE TRIGGER care_journeys_guard BEFORE UPDATE ON public.care_journeys FOR EACH ROW EXECUTE FUNCTION public.guard_care_journey_update();

-- MESSAGES
CREATE TABLE public.journey_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  journey_id uuid REFERENCES public.care_journeys(id) ON DELETE CASCADE,
  author text NOT NULL,
  author_name text,
  body_fr text NOT NULL,
  body_en text NOT NULL,
  request jsonb,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX journey_messages_user_idx ON public.journey_messages(user_id);
GRANT SELECT, INSERT, UPDATE ON public.journey_messages TO authenticated;
GRANT ALL ON public.journey_messages TO service_role;
ALTER TABLE public.journey_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY journey_messages_select_own ON public.journey_messages FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY journey_messages_insert_own ON public.journey_messages FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND author = 'patient');
CREATE POLICY journey_messages_update_own ON public.journey_messages FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY journey_messages_admin_all ON public.journey_messages FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER journey_messages_updated_at BEFORE UPDATE ON public.journey_messages FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ACTIONS
CREATE TABLE public.journey_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  journey_id uuid REFERENCES public.care_journeys(id) ON DELETE CASCADE,
  title_fr text NOT NULL,
  title_en text NOT NULL,
  desc_fr text NOT NULL DEFAULT '',
  desc_en text NOT NULL DEFAULT '',
  priority text NOT NULL DEFAULT 'normale',
  due_fr text,
  due_en text,
  cta_fr text NOT NULL DEFAULT 'Ouvrir',
  cta_en text NOT NULL DEFAULT 'Open',
  target text NOT NULL DEFAULT 'messages',
  done boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX journey_actions_user_idx ON public.journey_actions(user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.journey_actions TO authenticated;
GRANT ALL ON public.journey_actions TO service_role;
ALTER TABLE public.journey_actions ENABLE ROW LEVEL SECURITY;
CREATE POLICY journey_actions_own ON public.journey_actions FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY journey_actions_admin_all ON public.journey_actions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER journey_actions_updated_at BEFORE UPDATE ON public.journey_actions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- MEASUREMENTS
CREATE TABLE public.journey_measurements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  journey_id uuid NOT NULL REFERENCES public.care_journeys(id) ON DELETE CASCADE,
  kind text NOT NULL DEFAULT 'weight',
  value numeric NOT NULL,
  recorded_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX journey_measurements_journey_idx ON public.journey_measurements(journey_id);
GRANT SELECT, INSERT, DELETE ON public.journey_measurements TO authenticated;
GRANT ALL ON public.journey_measurements TO service_role;
ALTER TABLE public.journey_measurements ENABLE ROW LEVEL SECURITY;
CREATE POLICY journey_measurements_own ON public.journey_measurements FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY journey_measurements_admin_read ON public.journey_measurements FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- PHOTOS
CREATE TABLE public.journey_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  journey_id uuid NOT NULL REFERENCES public.care_journeys(id) ON DELETE CASCADE,
  label_fr text NOT NULL DEFAULT '',
  label_en text NOT NULL DEFAULT '',
  src text,
  taken_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX journey_photos_journey_idx ON public.journey_photos(journey_id);
GRANT SELECT, INSERT, DELETE ON public.journey_photos TO authenticated;
GRANT ALL ON public.journey_photos TO service_role;
ALTER TABLE public.journey_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY journey_photos_own ON public.journey_photos FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY journey_photos_admin_read ON public.journey_photos FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- PATIENT NOTIFICATIONS (in-app, discreet)
CREATE TABLE public.patient_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  journey_id uuid REFERENCES public.care_journeys(id) ON DELETE CASCADE,
  title_fr text NOT NULL,
  title_en text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX patient_notifications_user_idx ON public.patient_notifications(user_id);
GRANT SELECT, UPDATE ON public.patient_notifications TO authenticated;
GRANT ALL ON public.patient_notifications TO service_role;
ALTER TABLE public.patient_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY patient_notifications_select_own ON public.patient_notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY patient_notifications_update_own ON public.patient_notifications FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY patient_notifications_admin_all ON public.patient_notifications FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER patient_notifications_updated_at BEFORE UPDATE ON public.patient_notifications FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Automatic message + notification on journey status change
CREATE OR REPLACE FUNCTION public.on_journey_status_change()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE fr text; en text;
BEGIN
  IF NEW.status IS NOT DISTINCT FROM OLD.status THEN RETURN NEW; END IF;

  SELECT s.fr, s.en INTO fr, en FROM (VALUES
    ('AWAITING_DOCTOR', 'Votre dossier attend un médecin.', 'Your file is waiting for a doctor.'),
    ('DOCTOR_REVIEW', 'Votre médecin examine votre dossier.', 'Your doctor is reviewing your file.'),
    ('MORE_INFORMATION_REQUIRED', 'Votre médecin a besoin d''une information.', 'Your doctor needs one piece of information.'),
    ('CONSULTATION_REQUIRED', 'Une consultation en ligne est nécessaire.', 'An online consultation is required.'),
    ('MEDICAL_DECISION_COMPLETED', 'La décision médicale a été rendue.', 'The medical decision has been made.'),
    ('PRESCRIPTION_CREATED', 'Votre prescription a été délivrée.', 'Your prescription has been issued.'),
    ('SENT_TO_PHARMACY', 'Votre traitement est transmis à la pharmacie.', 'Your treatment has been sent to the pharmacy.'),
    ('PHARMACY_PREPARING', 'Votre traitement est en préparation.', 'Your treatment is being prepared.'),
    ('SHIPPED', 'Votre colis est en route.', 'Your parcel is on its way.'),
    ('DELIVERED', 'Votre traitement est arrivé.', 'Your treatment has arrived.'),
    ('FOLLOW_UP_DUE', 'Votre suivi est disponible.', 'Your follow-up is available.'),
    ('FOLLOW_UP_COMPLETED', 'Votre suivi est enregistré.', 'Your follow-up is recorded.'),
    ('RENEWAL_REVIEW', 'Votre renouvellement est en cours d''examen.', 'Your renewal is under review.'),
    ('PAUSED', 'Votre plan est en pause.', 'Your plan is paused.'),
    ('CANCELLED', 'Votre plan est annulé.', 'Your plan is cancelled.')
  ) AS s(code, fr, en) WHERE s.code = NEW.status;

  IF fr IS NULL THEN RETURN NEW; END IF;

  INSERT INTO public.journey_messages (user_id, journey_id, author, body_fr, body_en)
  VALUES (NEW.user_id, NEW.id, 'system', fr, en);

  INSERT INTO public.patient_notifications (user_id, journey_id, title_fr, title_en)
  VALUES (NEW.user_id, NEW.id, 'Vous avez une nouvelle mise à jour MAAN.', 'You have a new MAAN update.');

  RETURN NEW;
END;
$$;
CREATE TRIGGER care_journeys_status_change AFTER UPDATE ON public.care_journeys FOR EACH ROW EXECUTE FUNCTION public.on_journey_status_change();

-- Notification when a doctor or MAAN writes
CREATE OR REPLACE FUNCTION public.on_journey_message()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.author IN ('doctor', 'maan') THEN
    INSERT INTO public.patient_notifications (user_id, journey_id, title_fr, title_en)
    VALUES (NEW.user_id, NEW.journey_id, 'Vous avez une nouvelle mise à jour MAAN.', 'You have a new MAAN update.');
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER journey_messages_notify AFTER INSERT ON public.journey_messages FOR EACH ROW EXECUTE FUNCTION public.on_journey_message();