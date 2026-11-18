import { buildBranding } from "./branding.ts";
import { type DbExecutor, getDb } from "./db/connection.ts";
import {
  renewRecipientDownloadLinks,
  type RenewedDownloadLinks,
} from "./downloads.ts";
import { t } from "./i18n.ts";
import { getSettings } from "./settings.ts";
import { recordEmailSent } from "./services/audit.ts";
import { createEmailService, type EmailService } from "./services/email.ts";
import { withUserEmailLegalFooter } from "./services/email-legal-footer.ts";
import { RECIPIENT_DOWNLOAD_LINK_TTL_SECONDS } from "./types/domain.ts";
import { escapeHtml } from "./utils/html.ts";

const TTL_DAYS = RECIPIENT_DOWNLOAD_LINK_TTL_SECONDS / (24 * 60 * 60);

/** Sends fresh download links to the signer an expired link belonged to. */
export async function sendFreshDownloadLinks(
  token: string,
  {
    database = getDb(),
    emailService = createEmailService(),
  }: { database?: DbExecutor; emailService?: EmailService } = {},
): Promise<RenewedDownloadLinks> {
  const settings = await getSettings();
  const branding = buildBranding(settings);
  const { signerLanguage: locale } = settings;

  return renewRecipientDownloadLinks(token, {
    database,
    async sendLinks({ envelope, evidenceUrl, signedUrl, signer }) {
      const greeting = t(locale, "email.greeting", { name: signer.name });
      const subject = t(locale, "email.renewal.subject", {
        title: envelope.title,
      });
      const linksLine = t(locale, "email.renewal.line", {
        title: envelope.title,
        product: branding.productName,
        days: TTL_DAYS,
      });
      const keepLine = t(locale, "email.renewal.keep");
      const textBody = [
        greeting,
        "",
        linksLine,
        "",
        ...(signedUrl
          ? [`${t(locale, "email.text.signedPdfLabel")}: ${signedUrl}`]
          : []),
        `${t(locale, "email.text.certificateLabel")}: ${evidenceUrl}`,
        "",
        keepLine,
      ].join("\n");
      const htmlBody = [
        `<p>${escapeHtml(greeting)}</p>`,
        `<p>${escapeHtml(linksLine)}</p>`,
        "<p>",
        signedUrl
          ? `<a href="${escapeHtml(signedUrl)}">${escapeHtml(t(locale, "email.downloadSigned"))}</a><br />`
          : "",
        `<a href="${escapeHtml(evidenceUrl)}">${escapeHtml(t(locale, "email.downloadCertificate"))}</a></p>`,
        `<p>${escapeHtml(keepLine)}</p>`,
      ].join("");
      const body = withUserEmailLegalFooter(
        { htmlBody, locale, textBody },
        branding,
      );
      const delivery = await emailService.send({
        htmlBody: body.htmlBody,
        subject,
        template: "download_links",
        textBody: body.textBody,
        to: signer.email,
      });

      await recordEmailSent(
        {
          envelopeId: envelope.id,
          messageId: delivery.messageId,
          recipient: signer.email,
          signerId: signer.id,
          template: "download_links",
        },
        database,
      );
    },
  });
}
