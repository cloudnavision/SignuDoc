import assert from "node:assert/strict";
import { test } from "node:test";
import { verificationErrorMessage } from "./signing-verification-messages.ts";
import { t } from "./i18n.ts";

test("verification failures use translated status messages and safe fallbacks", () => {
  for (const locale of ["en", "es"] as const) {
    assert.equal(
      verificationErrorMessage(locale, 429, "send", "email_code"),
      t(locale, "verify.tooMany"),
    );
    assert.equal(
      verificationErrorMessage(locale, 410, "check", "email_code"),
      t(locale, "error.codeExpired"),
    );
    assert.equal(
      verificationErrorMessage(locale, 400, "check", "access_code"),
      t(locale, "error.codeWrong"),
    );
    assert.equal(
      verificationErrorMessage(locale, 400, "check", "account"),
      t(locale, "verify.accountError"),
    );
    for (const status of [404, 409])
      assert.equal(
        verificationErrorMessage(locale, status, "check", "email_code"),
        t(locale, "verify.unavailable"),
      );
    assert.equal(
      verificationErrorMessage(locale, 500, "check", "access_code"),
      t(locale, "verify.checkError"),
    );
    assert.equal(
      verificationErrorMessage(locale, 503, "send", "email_code"),
      t(locale, "verify.sendError"),
    );
  }
});
