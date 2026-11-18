"use client";

import { ShieldCheckIcon } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import { Brand } from "@/components/layout/brand";
import { PublicLegalFooter } from "@/components/layout/public-legal-links";
import { FieldShell, ShellButton } from "@/components/shared/form-shell";
import { type SignerLocale, type SignerMessageKey, t } from "@/lib/i18n";
import type { SigningVerificationState } from "@/lib/schemas/signing";

type Method = SigningVerificationState["required"][number];

const METHOD_COPY: Record<
  Method,
  { helper: SignerMessageKey; label: SignerMessageKey }
> = {
  access_code: {
    helper: "verify.accessCodeHelper",
    label: "verify.accessCodeLabel",
  },
  account: {
    helper: "verify.accountHelper",
    label: "verify.accountLabel",
  },
  email_code: {
    helper: "verify.emailCodeHelper",
    label: "verify.emailCodeLabel",
  },
};

export function SignerVerificationScreen({
  locale = "en",
  state,
  token,
}: {
  /** The language the organization chose for its signers. */
  locale?: SignerLocale;
  state: SigningVerificationState;
  token: string;
}) {
  const method = state.pending[0]!;
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(
    state.emailCodeSentAt && method === "email_code"
      ? t(locale, "verify.codeSent", { email: state.maskedEmail })
      : null,
  );
  const [isChecking, setIsChecking] = useState(false);
  const [isSending, setIsSending] = useState(false);
  // When the server will send another code, after it says the last one is
  // still in its resend cooldown, and the whole seconds left until then.
  // The seconds come from the clock, not from counting ticks, because a
  // hidden tab (the signer checking their email) can pause its timers.
  const [resendAt, setResendAt] = useState<number | null>(null);
  const [resendWait, setResendWait] = useState(0);
  const base = `/api/signing/${encodeURIComponent(token)}`;

  async function sendCode() {
    setIsSending(true);
    setError(null);

    try {
      const response = await fetch(`${base}/verify/email-code`, {
        method: "POST",
      });
      const payload = (await response.json().catch(() => null)) as {
        error?: string;
        maskedEmail?: string;
        retryAfterSeconds?: number;
        sent?: boolean;
      } | null;

      if (!response.ok) {
        setError(payload?.error ?? t(locale, "verify.sendError"));
        return;
      }

      const maskedEmail = payload?.maskedEmail ?? state.maskedEmail;

      if (payload?.sent === false) {
        setNotice(
          `A code was already sent to ${maskedEmail} less than a minute ago, so no new email went out. Use that code, or send a new one when the countdown on the button ends.`,
        );
        const seconds = Math.max(1, Math.ceil(payload.retryAfterSeconds ?? 60));

        setResendAt(Date.now() + seconds * 1000);
        setResendWait(seconds);
        return;
      }

      setNotice(
        t(locale, "verify.codeSent", {
          email: maskedEmail,
        }),
      );
    } catch {
      setError(t(locale, "verify.sendError"));
    } finally {
      setIsSending(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsChecking(true);
    setError(null);

    try {
      const response = await fetch(`${base}/verify`, {
        body: JSON.stringify(
          method === "account"
            ? { email, method, password: code }
            : { code, method },
        ),
        headers: { "content-type": "application/json" },
        method: "POST",
      });
      const payload = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!response.ok) {
        setError(payload?.error ?? t(locale, "verify.checkError"));
        return;
      }

      // The page reads the new cookie and shows the next check or the
      // document.
      window.location.reload();
    } catch {
      setError(t(locale, "verify.checkError"));
    } finally {
      setIsChecking(false);
    }
  }

  useEffect(() => {
    if (resendAt === null) {
      return;
    }

    const until = resendAt;

    function tick() {
      const seconds = Math.ceil((until - Date.now()) / 1000);

      if (seconds > 0) {
        setResendWait(seconds);
        return;
      }

      setResendAt(null);
      setResendWait(0);
      setNotice(
        `A code was sent to ${state.maskedEmail}. If it has not arrived, you can send a new one now.`,
      );
    }

    const timer = window.setInterval(tick, 1000);

    document.addEventListener("visibilitychange", tick);

    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [resendAt, state.maskedEmail]);

  const copy = METHOD_COPY[method];
  const step = state.required.indexOf(method) + 1;

  return (
    <div className="flex min-h-screen flex-col">
      <header>
        <div className="page-width flex items-center py-4">
          <Brand href="/" />
        </div>
      </header>
      <main className="page-width flex flex-1 items-center justify-center py-10">
        <section
          className="panel w-full max-w-[560px] px-6 py-10 sm:px-10 sm:py-12"
          data-animate="enter"
        >
          <span
            aria-hidden="true"
            className="inline-flex size-14 items-center justify-center rounded-2xl bg-(--accent-soft) text-(--accent)"
          >
            <ShieldCheckIcon className="size-6" strokeWidth={2.2} />
          </span>
          <h1 className="mt-6 text-[clamp(1.625rem,4vw,2rem)] font-extrabold leading-tight tracking-[-0.03em] text-(--fg)">
            {t(locale, "verify.title")}
          </h1>
          <p className="mt-3 text-base leading-7 text-(--secondary)">
            {t(locale, "verify.intro", {
              sender: state.senderName,
              title: state.envelopeTitle,
            })}
            {state.required.length > 1
              ? ` ${t(locale, "verify.step", {
                  step,
                  total: state.required.length,
                })}`
              : ""}
          </p>
          <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
            {method === "account" ? (
              <FieldShell
                autoComplete="username"
                helper={t(locale, "verify.emailHelper", {
                  email: state.maskedEmail,
                })}
                label={t(locale, "verify.emailAddress")}
                name="signer-email"
                onChange={(event) => setEmail(event.target.value)}
                readOnly={false}
                type="email"
                value={email}
              />
            ) : null}
            <FieldShell
              autoComplete={
                method === "account" ? "current-password" : "one-time-code"
              }
              helper={t(locale, copy.helper)}
              label={t(locale, copy.label)}
              name="signer-code"
              onChange={(event) => setCode(event.target.value)}
              readOnly={false}
              type={method === "account" ? "password" : "text"}
              value={code}
            />
            {notice ? (
              <p className="notice notice-accent" role="status">
                {notice}
              </p>
            ) : null}
            {error ? (
              <p className="notice notice-danger" role="alert">
                {error}
              </p>
            ) : null}
            <div className="flex flex-col gap-3 sm:flex-row">
              <ShellButton
                disabled={
                  code.trim().length === 0 ||
                  (method === "account" && email.trim().length === 0)
                }
                loading={isChecking}
                type="submit"
              >
                {t(locale, "verify.continue")}
              </ShellButton>
              {method === "email_code" ? (
                <ShellButton
                  disabled={resendWait > 0}
                  loading={isSending}
                  onClick={sendCode}
                  variant="secondary"
                >
                  {!notice
                    ? t(locale, "verify.emailMeCode")
                    : resendWait > 0
                      ? `Send a new code in ${String(resendWait)}s`
                      : t(locale, "verify.sendNewCode")}
                </ShellButton>
              ) : null}
            </div>
          </form>
        </section>
      </main>
      <PublicLegalFooter locale={locale} />
    </div>
  );
}
