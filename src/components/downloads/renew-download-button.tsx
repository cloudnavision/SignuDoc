"use client";

import { useState } from "react";
import { t, type SignerLocale } from "@/lib/i18n";

import { ShellButton } from "@/components/shared/form-shell";

export function RenewDownloadButton({
  token,
  locale = "en",
}: {
  token: string;
  locale?: SignerLocale;
}) {
  const [state, setState] = useState<
    | { kind: "idle" }
    | { kind: "sending" }
    | { kind: "sent"; maskedEmail: string }
    | { kind: "error"; message: string }
  >({ kind: "idle" });

  async function handleClick() {
    setState({ kind: "sending" });

    try {
      const response = await fetch(
        `/api/download/${encodeURIComponent(token)}/renew`,
        { method: "POST" },
      );
      const payload = (await response.json().catch(() => null)) as {
        error?: string;
        maskedEmail?: string;
      } | null;

      if (!response.ok || !payload?.maskedEmail) {
        setState({
          kind: "error",
          message: t(locale, "download.renew.error"),
        });
        return;
      }

      setState({ kind: "sent", maskedEmail: payload.maskedEmail });
    } catch {
      setState({
        kind: "error",
        message: t(locale, "download.renew.error"),
      });
    }
  }

  return (
    <div className="space-y-4">
      {state.kind === "sent" ? (
        <p role="status" className="notice notice-success">
          {t(locale, "download.renew.sent", { email: state.maskedEmail })}
        </p>
      ) : (
        <ShellButton loading={state.kind === "sending"} onClick={handleClick}>
          {state.kind === "sending"
            ? t(locale, "download.renew.sending")
            : t(locale, "download.renew.button")}
        </ShellButton>
      )}
      {state.kind === "error" ? (
        <p role="alert" className="notice notice-danger">
          {state.message}
        </p>
      ) : null}
    </div>
  );
}
