CREATE POLICY "questionnaire uploads own read" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'questionnaire-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "questionnaire uploads own insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'questionnaire-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "questionnaire uploads own delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'questionnaire-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "questionnaire uploads admin read" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'questionnaire-uploads' AND public.has_role(auth.uid(), 'admin'::public.app_role));