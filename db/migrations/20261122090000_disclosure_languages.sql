-- Keep the existing English disclosure and add administrator-authored translations.
ALTER TABLE public.app_settings
  ADD COLUMN consent_disclosure_translations jsonb NOT NULL DEFAULT '{}'::jsonb
  CHECK (jsonb_typeof(consent_disclosure_translations) = 'object');
