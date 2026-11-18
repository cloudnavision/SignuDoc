"use client";

import { type SignerLocale, t, type SignerMessageKey } from "@/lib/i18n";
import type {
  SigningPayload,
  SigningVerificationState,
} from "@/lib/schemas/signing";
import { EmbedParentMessage } from "./embed-parent-message";
import { SignerVerificationScreen } from "./signer-verification-screen";
import { SigningStateScreen } from "./signing-state-screen";
import {
  SigningLiveShell,
  type ProviderSignatureProblem,
} from "./signing-live-shell";

type SigningUnavailableState =
  "already-signed" | "completed" | "declined" | "error" | "expired" | "voided";

type SigningShellProps = {
  /**
   * Set on an embedded signing page: the site framing it, which is told
   * when the signer signs or declines, or why the page cannot be used.
   */
  embedOrigin?: string | null;
  initialState?: SigningUnavailableState;
  /** The language the organization chose for its signers. */
  locale?: SignerLocale;
  record?: SigningPayload;
  /** Set when the signer came back from a signing provider without signing. */
  signatureProblem?: ProviderSignatureProblem | null;
  token: string;
  verification?: SigningVerificationState;
};

const tokenStateCopy: Record<
  SigningUnavailableState,
  { description: SignerMessageKey; title: SignerMessageKey }
> = {
  error: {
    title: "state.error.title",
    description: "state.error.description",
  },
  expired: {
    title: "state.expired.title",
    description: "state.expired.description",
  },
  "already-signed": {
    title: "state.alreadySigned.title",
    description: "state.alreadySigned.description",
  },
  completed: {
    title: "This envelope has been completed",
    description:
      "Everyone has signed this document. No further action is needed.",
  },
  voided: {
    title: "state.voided.title",
    description: "state.voided.description",
  },
  declined: {
    title: "state.declined.title",
    description: "state.declined.description",
  },
};

export function SigningShell({
  embedOrigin = null,
  initialState,
  locale = "en",
  record,
  signatureProblem,
  token,
  verification,
}: SigningShellProps) {
  if (record) {
    return (
      <SigningLiveShell
        embedOrigin={embedOrigin}
        locale={locale}
        record={record}
        signatureProblem={signatureProblem}
      />
    );
  }

  if (verification) {
    return (
      <SignerVerificationScreen
        locale={locale}
        state={verification}
        token={token}
      />
    );
  }

  const state = initialState ?? "error";
  const tokenState = tokenStateCopy[state];

  return (
    <>
      {embedOrigin ? (
        <EmbedParentMessage
          message={{ state, type: "signudoc:error" }}
          origin={embedOrigin}
        />
      ) : null}
      <SigningStateScreen
        description={
          embedOrigin && state === "expired"
            ? "Ask the app you are using for a new signing link."
            : t(locale, tokenState.description)
        }
        locale={locale}
        title={t(locale, tokenState.title)}
      />
    </>
  );
}
