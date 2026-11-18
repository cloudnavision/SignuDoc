import { type Branding } from "../branding.ts";
import { formatDeadline } from "../envelope-deadline.ts";
import { type SignerLocale, t } from "../i18n.ts";
import { escapeHtml } from "../utils/html.ts";
import { withUserEmailLegalFooter } from "./email-legal-footer.ts";
import { type TransactionalEmailMessage } from "./email.ts";

type SigningInvitationEmailInput = {
  branding: Branding;
  envelopeTitle: string;
  /** The envelope's deadline, when it has one. */
  expiresAt?: number | null;
  /** The signer's language: the install's signer language. */
  locale: SignerLocale;
  senderName: string;
  signerEmail: string;
  signerName: string;
  signingUrl: string;
};

/** "This request expires on …", or nothing for an envelope with no deadline. */
export function buildDeadlineLine(
  expiresAt: number | null | undefined,
  locale: SignerLocale = "en",
): string | null {
  return typeof expiresAt === "number"
    ? t(locale, "email.deadlineLine", {
        date: formatDeadline(expiresAt, locale),
      })
    : null;
}

export function buildSigningInvitationEmail(
  input: SigningInvitationEmailInput,
): TransactionalEmailMessage {
  const { locale } = input;
  const { productName } = input.branding;
  const greeting = t(locale, "email.greeting", { name: input.signerName });
  const sentLine = t(locale, "email.invitation.sent", {
    sender: input.senderName,
    title: input.envelopeTitle,
    product: productName,
  });
  const subject = t(locale, "email.invitation.subject", {
    sender: input.senderName,
    title: input.envelopeTitle,
  });
  const deadlineLine = buildDeadlineLine(input.expiresAt, locale);
  const cta = t(locale, "email.cta");
  const noAccount = t(locale, "email.noAccount", { product: productName });
  const newestLink = t(locale, "email.newestLink");
  const textBody = [
    greeting,
    "",
    sentLine,
    "",
    cta,
    input.signingUrl,
    ...(deadlineLine ? ["", deadlineLine] : []),
    "",
    noAccount,
    newestLink,
  ].join("\n");
  const htmlBody = [
    `<p>${escapeHtml(greeting)}</p>`,
    `<p>${escapeHtml(sentLine)}</p>`,
    `<p><a href="${escapeHtml(input.signingUrl)}">${escapeHtml(cta)}</a></p>`,
    deadlineLine ? `<p>${escapeHtml(deadlineLine)}</p>` : "",
    `<p>${escapeHtml(noAccount)}</p>`,
    `<p>${escapeHtml(newestLink)}</p>`,
  ].join("");
  const legalFooter = withUserEmailLegalFooter(
    {
      htmlBody,
      locale,
      textBody,
    },
    input.branding,
  );

  return {
    htmlBody: legalFooter.htmlBody,
    subject,
    template: "signing_invitation",
    textBody: legalFooter.textBody,
    to: input.signerEmail,
  };
}
