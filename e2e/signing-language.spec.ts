import { expect, test } from "@playwright/test";
import pg from "pg";
import { e2eDatabaseUrl, e2eSetupToken } from "../playwright.config";
import { signInAsAdministrator, E2E_PASSWORD } from "./support/admin-session";
import { extractLink, waitForEmail } from "./support/outbox";
import { writeSamplePdf } from "./support/sample-pdf";
import { t } from "../src/lib/i18n";

// Also runs independently on a fresh test database.
test("Spanish and English signers receive their own language through signing and the certificate", async ({
  browser,
  page,
}, testInfo) => {
  const database = new pg.Client({ connectionString: e2eDatabaseUrl });
  await database.connect();
  const emails = [
    `ana.language.${Date.now()}@example.test`,
    `ben.language.${Date.now()}@example.test`,
  ];
  try {
    const admins = await database.query(
      'select id from public."user" where role = $1',
      ["admin"],
    );
    if (!admins.rowCount) {
      await page.goto("/setup");
      await page.getByLabel("Organization name").fill("Language Test");
      await page.getByLabel("Your name").fill("Sam Sender");
      await page.getByLabel("Your email").fill("language.admin@example.test");
      await page.getByLabel("Password").fill(E2E_PASSWORD);
      await page.getByLabel("Support email").fill("support@example.test");
      await page.getByLabel("Setup token").fill(e2eSetupToken);
      await page.getByRole("button", { name: "Finish setup" }).click();
      await expect(page).toHaveURL(/\/settings#organization$/);
    } else {
      await signInAsAdministrator(page);
    }
    await page.goto("/envelopes/new");
    await page.getByLabel("Envelope title").fill("Mixed language agreement");
    await page
      .getByLabel("Upload PDF")
      .setInputFiles(await writeSamplePdf(testInfo.outputPath("mixed.pdf")));
    await page.getByRole("button", { name: "Next ->" }).click();
    await expect(page).toHaveURL(/\/signers$/);
    await page.getByLabel("Signer 1 name").fill("Ana Language");
    await page.getByLabel("Signer 1 email").fill(emails[0]);
    await page.getByLabel("Signer 1 language").selectOption("es");
    await page
      .getByRole("button", { name: "+ Add another signer", exact: true })
      .click();
    await page.getByLabel("Signer 2 name").fill("Ben Language");
    await page.getByLabel("Signer 2 email").fill(emails[1]);
    await page.getByLabel("Signer 2 language").selectOption("en");
    await page.getByRole("button", { name: "Next →" }).click();
    await expect(page).toHaveURL(/\/prepare$/);
    const envelopeId = page.url().split("/").at(-2)!;
    const signers = await database.query(
      "select id,language from signers where envelope_id=$1 order by sign_order",
      [envelopeId],
    );
    expect(signers.rows.map((s) => s.language)).toEqual(["es", "en"]);
    // Set up identical signature/date boxes for both signers through the sender endpoint.
    const fields = signers.rows.flatMap((s, index) =>
      ["signature", "date"].map((type, offset) => ({
        signerId: s.id,
        type,
        page: 1,
        x: 0.1,
        y: 0.1 + index * 0.3 + offset * 0.1,
        width: 0.7,
        height: 0.06,
        required: true,
      })),
    );
    const response = await page.request.put(
      `/api/envelopes/${envelopeId}/fields`,
      { data: { fields } },
    );
    expect(response.ok(), await response.text()).toBeTruthy();
    await page.goto(`/envelopes/${envelopeId}/review`);
    await page.getByLabel("Certificate language").selectOption("es");
    await page
      .getByRole("button", { name: "Send envelope", exact: true })
      .click();
    const confirm = page.getByRole("dialog", { name: "Send this envelope?" });
    await confirm.getByRole("checkbox").check();
    await confirm.getByRole("button", { name: "Send now" }).click();
    await expect(page).toHaveURL(new RegExp(`/envelopes/${envelopeId}$`));
    for (const [index, language] of (["es", "en"] as const).entries()) {
      const invitation = await waitForEmail({
        template: "signing_invitation",
        to: emails[index],
      });
      expect(invitation.subject).toContain(
        index === 0 ? "le pide su firma" : "requested your signature",
      );
      const context = await browser.newContext();
      const signerPage = await context.newPage();
      await signerPage.goto(extractLink(invitation.text, "/sign/"));
      const consent = signerPage.getByRole("dialog", {
        name: t(language, "consentDialog.title"),
      });
      await expect(consent).toContainText(t(language, "disclosure.consent"));
      await consent.getByRole("checkbox").check();
      await consent
        .getByRole("button", { name: t(language, "consentDialog.agree") })
        .click();
      await expect(consent).toBeHidden();
      await signerPage
        .getByRole("button", {
          name: t(language, "field.summary.signature"),
          exact: true,
        })
        .click();
      await signerPage
        .getByRole("dialog")
        .getByRole("button", {
          name: language === "es" ? "Aplicar firma" : "Apply signature",
          exact: true,
        })
        .click();
      await signerPage
        .getByRole("button", { name: t(language, "live.finish"), exact: true })
        .click();
      await signerPage
        .getByRole("dialog", { name: t(language, "finishDialog.title") })
        .getByRole("button", {
          name: t(language, "finishDialog.finishSigning"),
          exact: true,
        })
        .click();
      await expect(signerPage).toHaveURL(/\/done/);
      await expect(signerPage.getByRole("heading", { level: 1 })).toContainText(
        t(language, "done.title"),
      );
      await context.close();
    }
    for (const [index, language] of (["es", "en"] as const).entries()) {
      const completion = await waitForEmail({
        template: "completion_notification",
        to: emails[index],
      });
      expect(completion.subject).toBe(
        t(language, "email.completion.subject", {
          title: "Mixed language agreement",
        }),
      );
      const certificate = await page.request.get(
        extractLink(completion.text, "/api/download/"),
      );
      // Select the certificate URL explicitly (the first download is the signed PDF).
      const links = [
        ...completion.text.matchAll(
          /https?:\/\/[^\s]+\/api\/download\/[^\s]+/g,
        ),
      ].map((m) => m[0]);
      expect(links.length).toBeGreaterThanOrEqual(2);
      const evidence = await page.request.get(links[1]);
      expect(evidence.ok()).toBeTruthy();
      expect(certificate.ok()).toBeTruthy();
      const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
      const pdf = await pdfjs.getDocument({
        data: new Uint8Array(await evidence.body()),
        verbosity: 0,
      }).promise;
      let text = "";
      for (let n = 1; n <= pdf.numPages; n++) {
        const content = await (await pdf.getPage(n)).getTextContent();
        text +=
          " " +
          content.items.map((i: { str?: string }) => i.str ?? "").join(" ");
      }
      await pdf.destroy();
      text = text.replace(/\s+/g, " ");
      expect(text).toContain("Certificado de finalización de SignuDoc");
      expect(text).toContain("Idioma: es");
      expect(text).toContain("Language: en");
      expect(text).toContain(t("es", "disclosure.consent"));
      expect(text).toContain(t("en", "disclosure.consent"));
    }
  } finally {
    await database.end();
  }
});
