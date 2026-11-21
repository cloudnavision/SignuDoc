import { cookies, headers } from "next/headers";

import { SigningShell } from "@/components/signing/signing-shell";
import { getDb } from "@/lib/db/connection";
import { type SignerLocale } from "@/lib/i18n";
import {
  getClientIpAddress,
  getRequestUserAgent,
} from "@/lib/security/request";
import type { SigningVerificationState } from "@/lib/schemas/signing";
import { getSigningLanguageForToken } from "@/lib/signing";
import { verifiedMethodsFromCookies } from "@/lib/signer-checks";
import {
  SigningAccessError,
  SigningVerificationRequiredError,
  getSigningPayloadForToken,
} from "@/lib/signing";

type SignPageProps = {
  params: Promise<{
    token: string;
  }>;
  searchParams: Promise<{ signatureProblem?: string | string[] }>;
};

const SIGNATURE_PROBLEMS = ["cancelled", "expired", "failed", "name"] as const;

export default async function SignPage({
  params,
  searchParams,
}: SignPageProps) {
  const { token } = await params;
  const { signatureProblem: problemParam } = await searchParams;
  const signatureProblem =
    SIGNATURE_PROBLEMS.find((problem) => problem === problemParam) ?? null;
  let initialState:
    | "already-signed"
    | "completed"
    | "declined"
    | "error"
    | "expired"
    | "voided"
    | undefined;
  let record: Awaited<ReturnType<typeof getSigningPayloadForToken>> | null =
    null;
  let verification: SigningVerificationState | null = null;
  // English if the stored language cannot be read: the page below still
  // says what happened to the link, in the language it has.
  let locale: SignerLocale = "en";

  try {
    const requestHeaders = await headers();
    const cookieStore = await cookies();

    locale = await getSigningLanguageForToken(token);
    record = await getSigningPayloadForToken(token, {
      database: getDb(),
      requestMeta: {
        ipAddress: getClientIpAddress(requestHeaders),
        userAgent: getRequestUserAgent(requestHeaders),
      },
      verifiedMethods: verifiedMethodsFromCookies(
        token,
        (name) => cookieStore.get(name)?.value,
      ),
    });
  } catch (error) {
    if (error instanceof SigningVerificationRequiredError) {
      verification = error.details;
    } else if (error instanceof SigningAccessError) {
      initialState = error.state;
    } else {
      initialState = "error";
    }
  }

  return (
    <SigningShell
      initialState={initialState}
      key={token}
      locale={locale}
      record={record ?? undefined}
      signatureProblem={signatureProblem}
      token={token}
      verification={verification ?? undefined}
    />
  );
}
