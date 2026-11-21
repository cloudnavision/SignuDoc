import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { test } from "node:test";
import { renderEnvelopeCertificatePdf } from "./pdf-finalize.ts";
import { buildSigningInvitationEmail } from "./signing-invitation-email.ts";
import { buildBranding } from "../branding.ts";
import { resolveSettings } from "../settings.ts";

// Captured from upstream 9476cc59941c38ec70fa99240f805bdbfa4b9176.
// Text extraction excludes PDF creation timestamps and random seal identifiers.
test("English invitation and legacy certificate match upstream snapshots", async () => {
  const input = {
    branding: buildBranding(resolveSettings(null, {})),
    envelopeTitle: "Agreement & schedule",
    senderName: "Sam Sender",
    signerName: "Alex Signer",
    signerEmail: "alex@example.test",
    signingUrl: "https://sign.example.test/sign/example",
    expiresAt: 1_800_000_000,
    locale: "en" as const,
  };
  const invitation = buildSigningInvitationEmail(input);
  const bytes = await renderEnvelopeCertificatePdf(
    {
      envelope: {
        id: "envelope-english",
        userId: "sender",
        title: "Agreement",
        status: "completed",
        sourcePdfKey: "source.pdf",
        sourcePdfFilename: "source.pdf",
        sourcePdfSizeBytes: 100,
        pageCount: 1,
        sourcePdfHash: "a".repeat(64),
        createdAt: 1_800_000_000,
        updatedAt: 1_800_000_100,
        completedAt: 1_800_000_100,
      },
      signers: [
        {
          id: "signer-english",
          name: "Alex Signer",
          email: "alex@example.test",
          signOrder: 1,
          status: "signed",
          signedAt: 1_800_000_100,
          createdAt: 1_800_000_000,
          updatedAt: 1_800_000_100,
        },
      ],
      auditEvents: [],
    },
    { seal: (pdf) => pdf.save() },
  );
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const pdf = await pdfjs.getDocument({
    data: new Uint8Array(bytes),
    verbosity: 0,
  }).promise;
  const pages = [];
  for (let n = 1; n <= pdf.numPages; n++) {
    const page = await pdf.getPage(n);
    const content = await page.getTextContent();
    pages.push(
      content.items.map((item: { str?: string }) => item.str ?? "").join(" "),
    );
  }
  await pdf.destroy();
  const snapshot = {
    invitation,
    certificate: pages.join("\n").replace(/\s+/g, " ").trim(),
  };
  const file = new URL(
    "./__snapshots__/english-language.json",
    import.meta.url,
  );
  if (process.env.CAPTURE_UPSTREAM_SNAPSHOT === "1")
    await writeFile(file, JSON.stringify(snapshot, null, 2) + "\n");
  assert.deepEqual(snapshot, JSON.parse(await readFile(file, "utf8")));
});
