import { SigningDoneShell } from "@/components/signing/signing-done-shell";
import { type SignerLocale } from "@/lib/i18n";
import { getSigningLanguageForToken } from "@/lib/signing";

type SignDonePageProps = {
  params: Promise<{ token: string }>;
  searchParams?: Promise<{
    title?: string | string[];
  }>;
};

export default async function SignDonePage({
  params,
  searchParams,
}: SignDonePageProps) {
  const { token } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const envelopeTitle = Array.isArray(resolvedSearchParams?.title)
    ? resolvedSearchParams.title[0]
    : resolvedSearchParams?.title;
  // English if the stored language cannot be read: a signer who just signed
  // still gets their done page.
  let locale: SignerLocale = "en";

  try {
    locale = await getSigningLanguageForToken(token);
  } catch {
    // Nothing to add: the page renders below in the language it has.
  }

  return <SigningDoneShell envelopeTitle={envelopeTitle} locale={locale} />;
}
