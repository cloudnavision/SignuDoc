import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, before, test } from "node:test";

import type pg from "pg";

import { openTestDatabase } from "./db/test-database.ts";
import { ELECTRONIC_RECORDS_DISCLOSURE_VERSION } from "./electronic-records-disclosure.ts";
import type { EmailService } from "./services/email.ts";
import { issueSigningLink } from "./services/signing-links.ts";
import type { StorageService } from "./services/storage.ts";
import { formatSigningDate } from "./signing-date.ts";
import { recordSignerConsent, submitSigningForToken } from "./signing.ts";

// Date fields against a real Postgres (issue #184): each one stamps the day,
// the day and time, or the time, as the sender chose. Run with `npm run test:db`.

process.env.APP_URL ??= "https://sign.example.test";

let database: pg.Pool;
const createdUsers: string[] = [];

before(async () => {
  database = await openTestDatabase();
  // The next signer's invitation reads the install's name through the shared pool.
  globalThis.__signudocPgPool = database;
});

after(async () => {
  await database.query(`delete from public."user" where id = any($1)`, [
    createdUsers,
  ]);
  await database.end();
});

const refuse = async (): Promise<never> => {
  throw new Error("not used");
};

// The first of two signers types a signature, so nothing touches storage.
const storageService: StorageService = {
  deleteObject: refuse,
  getObject: refuse,
  getObjectStream: refuse,
  headObject: refuse,
  putObject: refuse,
};

const emailService: EmailService = {
  async send(message) {
    return { accepted: [message.to], messageId: "m-1", rejected: [] };
  },
  async sendBatch() {
    throw new Error("not used");
  },
};

async function createSentEnvelope() {
  const userId = randomUUID();
  const envelopeId = randomUUID();
  const rileyId = randomUUID();
  const now = Math.floor(Date.now() / 1000);
  const link = await issueSigningLink({ expiresInSeconds: 60, issuedAt: now });

  createdUsers.push(userId);
  await database.query(
    `insert into public."user" (id, name, email, role) values ($1, 'Sam Sender', $2, 'user')`,
    [userId, `${userId}@example.test`],
  );
  await database.query(
    `
      insert into envelopes (
        id, user_id, title, status, source_pdf_key, source_pdf_filename,
        source_pdf_size_bytes, page_count, source_pdf_hash, sent_at
      ) values ($1, $2, 'Offer', 'sent', $3, 'offer.pdf', 10, 1, $4, $5)
    `,
    [envelopeId, userId, `test/${envelopeId}.pdf`, "a".repeat(64), now],
  );
  await database.query(
    `
      insert into signers (
        id, envelope_id, name, email, sign_order, status,
        signing_token_hash, signing_token_expires_at, last_notified_at
      ) values ($1, $2, 'Riley Recipient', $3, 1, 'notified', $4, $5, $6)
    `,
    [
      rileyId,
      envelopeId,
      `${rileyId}@example.test`,
      link.tokenHash,
      link.exp,
      now,
    ],
  );
  await database.query(
    `
      insert into signers (id, envelope_id, name, email, sign_order, status)
      values ($1, $2, 'Casey Second', $3, 2, 'pending')
    `,
    [randomUUID(), envelopeId, `${randomUUID()}@example.test`],
  );

  return { envelopeId, link, rileyId };
}

test("each date field stamps the day, the day and time, or the time, in the signer's zone", async () => {
  const { envelopeId, link, rileyId } = await createSentEnvelope();
  const signatureId = randomUUID();
  const ids = {
    date: randomUUID(),
    date_time: randomUUID(),
    time: randomUUID(),
  };

  await database.query(
    `
      insert into fields (
        id, envelope_id, signer_id, type, page, x, y, width, height, date_format
      ) values
        ($1, $5, $6, 'signature', 1, 0.1, 0.1, 0.2, 0.1, null),
        ($2, $5, $6, 'date', 1, 0.1, 0.3, 0.2, 0.05, null),
        ($3, $5, $6, 'date', 1, 0.1, 0.4, 0.34, 0.05, 'date_time'),
        ($4, $5, $6, 'date', 1, 0.1, 0.5, 0.2, 0.05, 'time')
    `,
    [signatureId, ids.date, ids.date_time, ids.time, envelopeId, rileyId],
  );
  await recordSignerConsent(
    link.token,
    { disclosureVersion: ELECTRONIC_RECORDS_DISCLOSURE_VERSION },
    { database },
  );
  await submitSigningForToken(
    link.token,
    {
      // India, five and a half hours ahead of UTC.
      clientTimezoneOffsetMinutes: -330,
      fields: [
        {
          fieldId: signatureId,
          inputMethod: "typed",
          type: "signature",
          value: "Riley Recipient",
        },
      ],
    },
    { database, emailService, storageService },
  );

  const stored = await database.query<{
    id: string;
    input_method: string | null;
    submitted_at: number;
    value: string | null;
  }>(
    `select id, input_method, submitted_at, value from fields where id = any($1)`,
    [Object.values(ids)],
  );
  const byId = new Map(stored.rows.map((row) => [row.id, row]));

  for (const [format, id] of Object.entries(ids) as Array<
    [keyof typeof ids, string]
  >) {
    const row = byId.get(id)!;

    assert.equal(row.input_method, "auto", format);
    assert.equal(
      row.value,
      formatSigningDate(row.submitted_at * 1000, -330, format),
      format,
    );
  }

  assert.doesNotMatch(byId.get(ids.date)!.value!, /UTC/);
  assert.match(
    byId.get(ids.date_time)!.value!,
    /, \d{1,2}:\d{2} [AP]M \(UTC\+05:30\)$/,
  );
  assert.match(
    byId.get(ids.time)!.value!,
    /^\d{1,2}:\d{2} [AP]M \(UTC\+05:30\)$/,
  );
});

test("only a date field takes a date format, and only a known one", async () => {
  const { envelopeId, rileyId } = await createSentEnvelope();
  const insert = (type: string, dateFormat: string) =>
    database.query(
      `
        insert into fields (
          id, envelope_id, signer_id, type, page, x, y, width, height, date_format
        ) values ($1, $2, $3, $4, 1, 0.1, 0.1, 0.2, 0.05, $5)
      `,
      [randomUUID(), envelopeId, rileyId, type, dateFormat],
    );

  await assert.rejects(
    insert("text", "time"),
    /fields_date_format_only_on_dates/,
  );
  await assert.rejects(
    insert("date", "week"),
    /fields_date_format_only_on_dates/,
  );
  await insert("date", "date_time");
});
