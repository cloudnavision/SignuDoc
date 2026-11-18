import { SigningDoneShell } from "@/components/signing/signing-done-shell";
import { type SignerLocale } from "@/lib/i18n";
import { getSettings } from "@/lib/settings";

type SignDonePageProps = {
  searchParams?: Promise<{
    title?: string | string[];
  }>;
};

export default async function SignDonePage({
  searchParams,
}: SignDonePageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const envelopeTitle = Array.isArray(resolvedSearchParams?.title)
    ? resolvedSearchParams.title[0]
    : resolvedSearchParams?.title;
  // English unless the settings read itself fails: a signer who just signed
  // still gets their done page.
  let locale: SignerLocale = "en";

  try {
    locale = (await getSettings()).signerLanguage;
  } catch {
    // Nothing to add: the page renders below in the language it has.
  }

  return <SigningDoneShell envelopeTitle={envelopeTitle} locale={locale} />;
}
