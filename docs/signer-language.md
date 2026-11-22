# Signer languages (draft layer)

English (`en`) and Spanish (`es`) share `src/lib/i18n.ts`, based on Jorge
Palma Escobar's catalogue in upstream PR #121. English defines the keys.
Translations are partial: absent entries fall back to English. Catalogue
tests reject unknown keys, empty strings and changed placeholders, and report
missing keys without failing. A message can also be an object with plural
categories and a required `other` form; `t()` selects a form with
`Intl.PluralRules` and the `count` parameter. Czech plural examples are test
fixtures only, not an enabled language.

Draft signers have a nullable `language`. The sender can choose it on the
signers step, or an API caller can supply it in each signer object in
`POST /api/v1/envelopes`. Omission inherits the install's default when sent.
Sending stores resolved languages for all recipients in the same transaction
that sends the envelope. Later settings changes do not change them. A failed
first invitation restores the original draft choices. API responses and
webhooks include signer languages.

The review step and API send options also accept the certificate language.
The proposed mixed-envelope certificate has its frame in this envelope
language and each signer's block in their own language. Blocks include the
recorded consent statement, language and localized signing date. Legacy
certificates retain their original English rendering. Part 11 signature
meanings remain canonical English in the evidence.

Consent requests must supply `language` as well as `disclosureVersion`.
A language different from the stored signer language is rejected with 409;
a missing or unsupported language is invalid input. The audit event stores
the language, version and statement together. The existing custom disclosure
version checks remain in place.

The migration backfills existing sent envelopes and recipients to English,
the language upstream used before this layer. Unknown links also use English;
they cannot borrow a new install default. Privacy links carry a language when
needed, without including a signing token.

Administrators edit a disclosure for each supported language under Settings,
Organization. The existing `consent_disclosure` remains the English text;
`consent_disclosure_translations` stores administrator-authored translations.
The selected language alone is updated, under the settings row lock. Changing
a translation requires the same legal-responsibility acknowledgement as English.
Only the English starting text ships. A missing translation uses the English
custom disclosure, or the English standard if no custom text exists. The
rendered disclosure declares its actual language, and consent audit metadata
records `disclosureLanguage` separately from the signer's interface/statement
`language`. Changes to resolved custom words invalidate a stale consent version.
Hosted mode continues to use the standard English disclosure.

Signing screens, dialog portals, privacy/download pages and signer email HTML
documents declare their language. Sender and administrator mail stays English.
Verification failures select catalogue messages by HTTP status; raw server
error prose is never displayed. Manual and automatic reminders read settings
inside their error boundary before replacing the current signing link.

The English `declinedConfirmation` export is retained for compatibility with
external imports. Rendered decline screens use the signer's own locale.

Both implementation rounds of issue #200 are included; the PR remains a draft.
Czech, Bulgarian and French catalogues and further legal starting texts are
separate changes. No Czech legal text is shipped here.

Validation includes a mixed Spanish/English database test and browser test,
plural and fallback tests, and English invitation/certificate snapshots taken
from upstream `9476cc59941c38ec70fa99240f805bdbfa4b9176`.

The upstream English invitation body/text and legacy certificate text remain
snapshot-identical. The invitation now has a document wrapper with `lang="en"`;
the snapshot test asserts that wrapper separately before comparing its body.
