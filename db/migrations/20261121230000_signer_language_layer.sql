-- Drafts inherit the install default. Sending freezes both languages.
ALTER TABLE signers ADD COLUMN language text CHECK (language IN ('en', 'es'));
ALTER TABLE envelopes ADD COLUMN language text CHECK (language IN ('en', 'es'));
-- Before this layer all upstream sent envelopes were English. Never infer
-- historical evidence from today's settings.
UPDATE signers SET language = 'en' WHERE envelope_id IN (SELECT id FROM envelopes WHERE status <> 'draft');
UPDATE envelopes SET language = 'en' WHERE status <> 'draft';
