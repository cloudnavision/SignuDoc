import assert from "node:assert/strict";
import { test } from "node:test";
import {
  dictionaries,
  en,
  t,
  translate,
  validateCatalogue,
  type Message,
} from "./i18n.ts";

test("catalogues reject unknown keys, empty text and changed placeholders; missing keys are reported", (context) => {
  for (const [language, catalogue] of Object.entries(dictionaries)) {
    const result = validateCatalogue(en, catalogue);
    assert.deepEqual(result.errors, []);
    context.diagnostic(
      `${language}: missing keys: ${result.missing.join(", ") || "none"}`,
    );
  }
  assert.deepEqual(validateCatalogue({ hello: "Hello {name}" }, {}).missing, [
    "hello",
  ]);
  for (const catalogue of [
    { unknown: "hello" },
    { hello: " " },
    { hello: "Hola" },
    { hello: "Hola {other}" },
  ] as Record<string, Message>[]) {
    assert.ok(
      validateCatalogue({ hello: "Hello {name}" }, catalogue).errors.length,
    );
  }
});

test("partial catalogues fall back to English and interpolate once", () => {
  assert.equal(
    translate({ hello: "Hello {name}" }, {}, "es", "hello", {
      name: "$& {name}",
    }),
    "Hello $& {name}",
  );
  assert.equal(
    t("es", "verify.codeSent", { email: "signer@example.com" }),
    "Se envió un código a signer@example.com.",
  );
});

test("plural rules select English and test-only Czech forms including fractions", () => {
  const source: Record<"signatures", Message> = {
    signatures: { one: "{count} signature", other: "{count} signatures" },
  };
  const cs = {
    signatures: {
      one: "{count} podpis",
      few: "{count} podpisy",
      many: "{count} podpisu",
      other: "{count} podpisů",
    },
  };
  assert.deepEqual(validateCatalogue(source, cs).errors, []);
  for (const [count, expected] of [
    [1, "1 podpis"],
    [2, "2 podpisy"],
    [5, "5 podpisů"],
    [1.5, "1.5 podpisu"],
  ] as const) {
    assert.equal(
      translate(source, cs, "cs", "signatures", { count }),
      expected,
    );
  }
  assert.equal(
    translate(source, {}, "en", "signatures", { count: 1 }),
    "1 signature",
  );
  assert.equal(
    translate(source, {}, "en", "signatures", { count: 2 }),
    "2 signatures",
  );
  assert.equal(
    translate(
      source,
      { signatures: { other: "{count} podpisů" } },
      "cs",
      "signatures",
      { count: 2 },
    ),
    "2 podpisů",
  );
});
