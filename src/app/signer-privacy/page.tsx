import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";

import { PublicDocumentShell } from "@/components/layout/public-document-shell";
import { t } from "@/lib/i18n";
import { getSettings } from "@/lib/settings";
import { STALE_DRAFT_RETENTION_DAYS } from "@/lib/retention";

// A GDPR Article 13 notice for signers, built from the install's settings.
// Shown in the footer when the organization has not linked its own privacy
// policy. The organization remains the controller and should check it.

type PrivacyProps = { searchParams: Promise<{ language?: string }> };
async function privacyLocale(props: PrivacyProps) {
  const { language } = await props.searchParams;
  return language === "es" || language === "en" ? language : "en";
}
export async function generateMetadata(props: PrivacyProps): Promise<Metadata> {
  const locale = await privacyLocale(props);

  return {
    description: t(locale, "privacy.description"),
    title: t(locale, "privacy.title"),
  };
}

export default async function SignerPrivacyPage(props: PrivacyProps) {
  await connection();

  const settings = await getSettings();

  if (settings.hosted) {
    redirect("/privacy");
  }

  if (settings.privacyUrl) {
    redirect(settings.privacyUrl);
  }

  const locale = await privacyLocale(props);
  const organization =
    settings.organizationName?.trim() ||
    t(locale, "privacy.fallbackOrganization");
  const contact = settings.supportAddress;
  const retention = settings.retentionDays
    ? t(locale, "privacy.retention.days", { days: settings.retentionDays })
    : t(locale, "privacy.retention.untilDeleted");

  return (
    <PublicDocumentShell
      locale={locale}
      description={t(locale, "privacy.intro", { organization })}
      lastUpdated="2026-11-13"
      title={t(locale, "privacy.title")}
    >
      <section className="space-y-3">
        <h2 className="text-xl font-extrabold tracking-[-0.02em] text-(--fg)">
          {t(locale, "privacy.responsible.heading")}
        </h2>
        <p>
          {t(locale, "privacy.responsible.body", { organization })}{" "}
          {contact ? (
            <>
              {t(locale, "privacy.responsible.contactLead")}{" "}
              <a className="underline" href={`mailto:${contact}`}>
                {contact}
              </a>
              {t(locale, "privacy.responsible.contactTail")}
            </>
          ) : (
            t(locale, "privacy.responsible.noContact")
          )}
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-extrabold tracking-[-0.02em] text-(--fg)">
          {t(locale, "privacy.collected.heading")}
        </h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>{t(locale, "privacy.collected.name")}</li>
          <li>{t(locale, "privacy.collected.entries")}</li>
          <li>{t(locale, "privacy.collected.evidence")}</li>
          <li>{t(locale, "privacy.collected.emails")}</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-extrabold tracking-[-0.02em] text-(--fg)">
          {t(locale, "privacy.basis.heading")}
        </h2>
        <p>{t(locale, "privacy.basis.body")}</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-extrabold tracking-[-0.02em] text-(--fg)">
          {t(locale, "privacy.recipients.heading")}
        </h2>
        <p>{t(locale, "privacy.recipients.body", { organization })}</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-extrabold tracking-[-0.02em] text-(--fg)">
          {t(locale, "privacy.retention.heading")}
        </h2>
        <p>
          {retention}{" "}
          {t(locale, "privacy.retention.drafts", {
            days: STALE_DRAFT_RETENTION_DAYS,
          })}
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-extrabold tracking-[-0.02em] text-(--fg)">
          {t(locale, "privacy.rights.heading")}
        </h2>
        <p>{t(locale, "privacy.rights.body", { organization })}</p>
      </section>
    </PublicDocumentShell>
  );
}
