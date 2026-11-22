import assert from "node:assert/strict";
import { createHash, randomUUID } from "node:crypto";
import { mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { PDFDocument } from "pdf-lib";
import { openTestDatabase } from "./db/test-database.ts";
import { replaceDraftEnvelopeSigners, sendDraftEnvelope } from "./envelopes.ts";
import { saveSettings, readStoredSettings } from "./settings.ts";
import { createStorageService } from "./services/storage.ts";
import {
  getSigningPayloadForToken,
  getSigningLanguageForToken,
  recordSignerConsent,
  submitSigningForToken,
} from "./signing.ts";
import { buildConsentStatement } from "./electronic-records-disclosure.ts";
import { getApiEnvelope } from "./api/envelope-view.ts";
import { apiCreateEnvelopeSchema } from "./api/envelopes.ts";

test("mixed envelope freezes signer languages, validates consent and stores localized dates and evidence", async () => {
  const database = await openTestDatabase();
  globalThis.__signudocPgPool = database;
  const work = await mkdtemp(path.join(tmpdir(), "signudoc-language-"));
  const userId = randomUUID(),
    envelopeId = randomUUID();
  const previous = await readStoredSettings(database);
  Object.assign(process.env, {
    APP_URL: "http://localhost:3100",
    EMAIL_DRIVER: "capture",
    EMAIL_CAPTURE_DIR: path.join(work, "outbox"),
    STORAGE_DRIVER: "local",
    STORAGE_LOCAL_DIR: work,
  });
  const storage = createStorageService();
  try {
    await saveSettings(
      { signerLanguage: "es", part11Mode: false, consentDisclosure: null },
      database,
    );
    await database.query(
      `insert into public."user" (id,name,email) values ($1,'Sam Sender',$2)`,
      [userId, `${userId}@example.test`],
    );
    const pdf = await PDFDocument.create();
    pdf.addPage([612, 792]);
    const bytes = await pdf.save();
    const key = `test/${envelopeId}.pdf`;
    await storage.putObject({
      key,
      body: bytes,
      contentType: "application/pdf",
    });
    await database.query(
      `insert into envelopes (id,user_id,title,status,source_pdf_key,source_pdf_filename,source_pdf_size_bytes,page_count,source_pdf_hash) values ($1,$2,'Mixed languages','draft',$3,'mixed.pdf',$4,1,$5)`,
      [
        envelopeId,
        userId,
        key,
        bytes.length,
        createHash("sha256").update(bytes).digest("hex"),
      ],
    );
    await database.query(
      `insert into envelope_pages (id,envelope_id,page_number,width_pt,height_pt) values ($1,$2,1,612,792)`,
      [randomUUID(), envelopeId],
    );
    const saved = await replaceDraftEnvelopeSigners(
      userId,
      envelopeId,
      {
        signers: [
          {
            name: "Ana",
            email: "ana@example.test",
            language: null,
            signingStep: 1,
          },
          {
            name: "Ben",
            email: "ben@example.test",
            language: "en",
            signingStep: 1,
          },
        ],
      },
      database,
    );
    for (const [index, signer] of saved.signers.entries()) {
      for (const [offset, type] of ["signature", "date"].entries())
        await database.query(
          `insert into fields (id,envelope_id,signer_id,type,page,x,y,width,height) values ($1,$2,$3,$4,1,0.1,$5,0.7,0.06)`,
          [
            randomUUID(),
            envelopeId,
            signer.id,
            type,
            0.1 + index * 0.3 + offset * 0.1,
          ],
        );
    }
    // A failed first delivery restores draft language choices as well as links.
    const blocker = path.join(work, "not-a-directory");
    await writeFile(blocker, "test");
    process.env.EMAIL_CAPTURE_DIR = blocker;
    await assert.rejects(
      sendDraftEnvelope(
        userId,
        envelopeId,
        { senderName: "Sam Sender", senderEmail: userId + "@example.test" },
        { database },
      ),
    );
    assert.deepEqual(
      (
        await database.query(
          "select language from signers where envelope_id=$1 order by sign_order",
          [envelopeId],
        )
      ).rows.map((row) => row.language),
      [null, "en"],
    );
    process.env.EMAIL_CAPTURE_DIR = path.join(work, "outbox");
    await sendDraftEnvelope(
      userId,
      envelopeId,
      {
        senderName: "Sam Sender",
        senderEmail: `${userId}@example.test`,
        language: "es",
      },
      { database },
    );
    const view = await getApiEnvelope(userId, envelopeId, database);
    assert.deepEqual(
      view?.signers.map((s) => s.language),
      ["es", "en"],
    ); // Same representation is used by webhooks.
    await saveSettings({ signerLanguage: "en" }, database);
    const invitations = await Promise.all(
      (await readdir(path.join(work, "outbox")))
        .filter((f) => f.endsWith(".json"))
        .map(async (f) =>
          JSON.parse(await readFile(path.join(work, "outbox", f), "utf8")),
        ),
    );
    for (const [index, signer] of saved.signers.entries()) {
      const language = index === 0 ? "es" : "en";
      const invitation = invitations.find(
        (m) =>
          m.template === "signing_invitation" && m.to.includes(signer.email),
      );
      assert.ok(invitation);
      assert.match(
        invitation.subject,
        index === 0 ? /le pide su firma/ : /requested your signature/,
      );
      const token = new URL(
        invitation.text.match(/http:\/\/localhost:3100\/sign\/[^\s]+/)[0],
      ).pathname
        .split("/")
        .pop()!;
      const payload = await getSigningPayloadForToken(token, { database });
      assert.equal(payload.locale, language);
      assert.equal(
        payload.disclosure.statement,
        buildConsentStatement(language),
      );
      await assert.rejects(
        recordSignerConsent(
          token,
          {
            disclosureVersion: payload.disclosure.version,
            language: language === "es" ? "en" : "es",
          },
          { database },
        ),
        { statusCode: 409 },
      );
      await assert.rejects(
        recordSignerConsent(
          token,
          { disclosureVersion: payload.disclosure.version },
          { database },
        ),
      );
      await recordSignerConsent(
        token,
        { disclosureVersion: payload.disclosure.version, language },
        { database },
      );
      await submitSigningForToken(
        token,
        {
          clientTimezoneOffsetMinutes: 0,
          fields: payload.currentSignerFields
            .filter((f) => f.type === "signature")
            .map((f) => ({
              fieldId: f.id,
              type: "signature",
              inputMethod: "typed",
              value: signer.name,
            })),
        },
        { database, storageService: storage },
      );
      assert.equal(await getSigningLanguageForToken(token, database), language);
      const stored = await database.query(
        `select value,submitted_at from fields where signer_id=$1 and type='date'`,
        [signer.id],
      );
      assert.equal(
        stored.rows[0].value,
        new Intl.DateTimeFormat(language === "es" ? "es-ES" : "en-US", {
          day: "numeric",
          month: "long",
          year: "numeric",
          timeZone: "UTC",
        }).format(new Date(stored.rows[0].submitted_at * 1000)),
      );
    }
    const events = await database.query(
      `select metadata from audit_events where envelope_id=$1 and event='consented' order by sequence`,
      [envelopeId],
    );
    assert.deepEqual(
      events.rows.map((r) => r.metadata.language),
      ["es", "en"],
    );
    for (const row of events.rows)
      assert.equal(
        row.metadata.statement,
        buildConsentStatement(row.metadata.language),
      );
    assert.equal(
      (
        await database.query("select language from envelopes where id=$1", [
          envelopeId,
        ])
      ).rows[0].language,
      "es",
    );
  } finally {
    await database.query('delete from public."user" where id=$1', [userId]);
    if (previous) await saveSettings(previous, database);
    else await database.query("delete from app_settings");
    await database.end();
    await rm(work, { recursive: true, force: true });
  }
});

test("API rejects unsupported signer languages", () => {
  const parsed = apiCreateEnvelopeSchema.safeParse({
    title: "Test",
    signers: [
      { ref: "a", name: "Ana", email: "a@example.test", language: "cs" },
    ],
    fields: [
      {
        signer: "a",
        type: "signature",
        page: 1,
        x: 0.1,
        y: 0.1,
        width: 0.3,
        height: 0.1,
      },
    ],
  });
  assert.equal(parsed.success, false);
  if (!parsed.success)
    assert.ok(
      parsed.error.issues.some(
        (i) => i.path.join(".") === "signers.0.language",
      ),
    );
});
