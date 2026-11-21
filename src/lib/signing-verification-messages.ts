import { t, type SignerLocale } from "./i18n.ts";

/** Stable HTTP statuses select catalogue messages; server prose is never rendered. */
export function verificationErrorMessage(
  locale: SignerLocale,
  status: number,
  action: "send" | "check",
  method: "account" | "access_code" | "email_code",
): string {
  if (status === 429) return t(locale, "verify.tooMany");
  if (status === 409 || status === 404) return t(locale, "verify.unavailable");
  if (status === 410)
    return t(
      locale,
      action === "check" && method === "email_code"
        ? "error.codeExpired"
        : "verify.unavailable",
    );
  if (action === "check" && (status === 400 || status === 401))
    return t(
      locale,
      method === "account" ? "verify.accountError" : "error.codeWrong",
    );
  return t(
    locale,
    action === "send" ? "verify.sendError" : "verify.checkError",
  );
}
