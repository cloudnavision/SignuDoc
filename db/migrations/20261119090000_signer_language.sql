-- The language signers see: the signing pages, the legal notices a signer is
-- shown, and the emails a signer receives. Chosen by an administrator under
-- Settings, Organization; the dashboard itself stays in English.
--
-- One setting for the whole install: an envelope's signers are not asked
-- their language, and the record of what they saw is the disclosure version
-- they agreed to, not a per-signer choice.

alter table public.app_settings
  add column if not exists signer_language text not null default 'en'
    check (signer_language in ('en', 'es'));
