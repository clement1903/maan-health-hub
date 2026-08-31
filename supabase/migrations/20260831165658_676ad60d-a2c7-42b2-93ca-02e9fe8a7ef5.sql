INSERT INTO public.doctors (name, role_fr, role_en, big, active) VALUES
  ('Dr. Elise Lemoine', 'Médecin généraliste — santé masculine', 'General practitioner — men''s health', '19912345678', true),
  ('Dr. Thomas Badel', 'Médecin — accompagnement du poids', 'Physician — weight management', '19923456789', true),
  ('Dr. Sarah Vermeer', 'Médecin — dermatologie et cheveux', 'Physician — dermatology and hair', '19934567890', true)
ON CONFLICT DO NOTHING;