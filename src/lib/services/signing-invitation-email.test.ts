import assert from "node:assert/strict";
import { test } from "node:test";

import { type Branding } from "../branding.ts";
import {
  buildDeadlineLine,
  buildSigningInvitationEmail,
} from "./signing-invitation-email.ts";

const branding: Branding = {
  brandColor: null,
  contactUrl: null,
  hosted: false,
  logoUrl: null,
  organizationName: "Acme Corp",
  privacyUrl: null,
  productName: "Acme Corp",
  signupAvailable: true,
  supportAddress: "help@acme.com",
  termsUrl: null,
};

const input = {
  branding,
  envelopeTitle: "Contrato de arrendamiento",
  senderName: "Ana Acme",
  signerEmail: "signer@example.test",
  signerName: "Luis López",
  signingUrl: "https://sign.acme.com/sign/token",
};

test("an English invitation keeps the English words", () => {
  const message = buildSigningInvitationEmail({ ...input, locale: "en" });

  assert.equal(
    message.subject,
    "Ana Acme requested your signature on “Contrato de arrendamiento”",
  );
  assert.match(message.textBody, /^Hi Luis López,$/m);
  assert.match(
    message.textBody,
    /Ana Acme sent you “Contrato de arrendamiento” through Acme Corp\./,
  );
  assert.match(
    message.textBody,
    /You do not need a Acme Corp account to sign\./,
  );
});

test("a Spanish signer gets the invitation in Spanish", () => {
  const message = buildSigningInvitationEmail({ ...input, locale: "es" });

  assert.equal(
    message.subject,
    "Ana Acme le pide su firma en «Contrato de arrendamiento»",
  );
  assert.match(message.textBody, /^Hola Luis López:$/m);
  assert.match(
    message.textBody,
    /Ana Acme le envió «Contrato de arrendamiento» a través de Acme Corp\./,
  );
  assert.match(message.textBody, /Revise y firme el documento/);
  assert.match(
    message.textBody,
    /No necesita una cuenta de Acme Corp para firmar\./,
  );
  // The footer follows the signer's language too.
  assert.match(message.textBody, /Enviado por Acme Corp con SignuDoc\./);
  assert.match(
    message.htmlBody!,
    /¿Preguntas\? Escriba a <a href="mailto:help@acme\.com">help@acme\.com<\/a>\./,
  );
});

test("the deadline line carries the date in the signer's language", () => {
  const november16 = 1_763_294_400; // 2025-11-16 12:00:00 UTC

  assert.equal(
    buildDeadlineLine(november16, "en"),
    "This request expires on November 16, 2025 at 12:00 PM UTC.",
  );
  assert.match(
    buildDeadlineLine(november16, "es")!,
    /^Esta solicitud vence el 16 de noviembre de 2025 a las 12:00 UTC\.$/,
  );
  assert.equal(buildDeadlineLine(null, "es"), null);
});
