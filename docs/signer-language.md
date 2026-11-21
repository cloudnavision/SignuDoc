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

This is round one of issue #200. Per-language administrator disclosures and
the remaining PR #121 reminder-recovery and verification-error work follow
inside the draft, along with maintainer feedback. The required date and
privacy/decline language propagation overlaps those review findings and is
included here. Czech, Bulgarian and French catalogues are separate changes;
no Czech legal text is shipped here.

Validation includes a mixed Spanish/English database test and browser test,
plural and fallback tests, and English invitation/certificate snapshots taken
from upstream `9476cc59941c38ec70fa99240f805bdbfa4b9176`.
