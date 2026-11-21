import { getSigningLanguageForToken } from "@/lib/signing";
import { SigningDoneShell } from "@/components/signing/signing-done-shell";

// Where an embedded signer lands after signing. The page that frames it was
// told already (signudoc:signed); this is what the signer sees meanwhile.

type EmbedSignDonePageProps = {
  params: Promise<{ token: string }>;
  searchParams?: Promise<{ title?: string | string[] }>;
};

export default async function EmbedSignDonePage({
  params,
  searchParams,
}: EmbedSignDonePageProps) {
  const { token } = await params;
  const locale = await getSigningLanguageForToken(token);
  const resolved = searchParams ? await searchParams : undefined;
  const envelopeTitle = Array.isArray(resolved?.title)
    ? resolved.title[0]
    : resolved?.title;

  return (
    <SigningDoneShell locale={locale} embedded envelopeTitle={envelopeTitle} />
  );
}
