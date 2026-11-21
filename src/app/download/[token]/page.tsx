import type { Metadata } from "next";
import { getDownloadLanguageForToken } from "@/lib/downloads";
import { t } from "@/lib/i18n";

import { PublicDocumentShell } from "@/components/layout/public-document-shell";
import { RenewDownloadButton } from "@/components/downloads/renew-download-button";

type ExpiredDownloadPageProps = {
  params: Promise<{ token: string }>;
};

export async function generateMetadata({
  params,
}: ExpiredDownloadPageProps): Promise<Metadata> {
  const { token } = await params;
  const locale = await getDownloadLanguageForToken(token);
  return {
    robots: { follow: false, index: false },
    title: t(locale, "download.expired.title"),
  };
}

export default async function ExpiredDownloadPage({
  params,
}: ExpiredDownloadPageProps) {
  const { token } = await params;
  const locale = await getDownloadLanguageForToken(token);

  return (
    <PublicDocumentShell
      locale={locale}
      description={t(locale, "download.expired.description")}
      title={t(locale, "download.expired.title")}
    >
      <div className="mx-auto w-full max-w-[52rem]">
        <RenewDownloadButton token={token} locale={locale} />
      </div>
    </PublicDocumentShell>
  );
}
