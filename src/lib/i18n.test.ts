import assert from "node:assert/strict";
import { test } from "node:test";

import { en, es, t } from "./i18n.ts";

// The type of `es` is Record<SignerMessageKey, string>, so a missing key
// fails typecheck; these tests catch what types cannot: a translation left
// as a copy of the English text, a placeholder dropped or renamed, and a
// translation that is only whitespace.

const placeholders = (value: string): string[] =>
  [...value.matchAll(/\{(\w+)\}/g)].map((match) => match[1] ?? "").sort();

test("both languages carry the same keys", () => {
  assert.deepEqual(Object.keys(es).sort(), Object.keys(en).sort());
});

test("Spanish is a translation, not a copy and not empty", () => {
  for (const [key, englishText] of Object.entries(en) as Array<
    [keyof typeof en, string]
  >) {
    const spanishText = es[key];

    assert.notEqual(spanishText.trim(), "", `${key}: empty translation`);
    // A key that is only punctuation ("." to end a sentence built from
    // parts) is the same in every language.
    if (/[a-zA-Z]/.test(englishText)) {
      assert.notEqual(
        spanishText,
        englishText,
        `${key}: Spanish text is the English text`,
      );
    }
  }
});

test("every placeholder in a message is in its translation", () => {
  for (const [key, englishText] of Object.entries(en) as Array<
    [keyof typeof en, string]
  >) {
    assert.deepEqual(
      placeholders(es[key]),
      placeholders(englishText),
      `${key}: placeholders differ`,
    );
  }
});

test("t fills the placeholders it is given and leaves the rest", () => {
  assert.equal(
    t("es", "verify.codeSent", { email: "signer@example.com" }),
    "Se envió un código a signer@example.com.",
  );
  assert.equal(t("en", "verify.codeSent"), "A code was sent to {email}.");
});
