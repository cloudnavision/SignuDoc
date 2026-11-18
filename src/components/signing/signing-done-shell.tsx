import { Brand } from "@/components/layout/brand";
import { PublicLegalFooter } from "@/components/layout/public-legal-links";
import { type SignerLocale, t } from "@/lib/i18n";

type SigningDoneShellProps = {
  /** Shown inside another app's page, which carries on from here. */
  embedded?: boolean;
  envelopeTitle?: string | null;
  /** The language the organization chose for its signers. */
  locale?: SignerLocale;
};

export function SigningDoneShell({
  embedded = false,
  envelopeTitle,
  locale = "en",
}: SigningDoneShellProps) {
  const resolvedEnvelopeTitle =
    envelopeTitle && envelopeTitle.trim().length > 0
      ? envelopeTitle.trim()
      : t(locale, "done.fallbackTitle");

  return (
    <div className="flex min-h-screen flex-col">
      <header>
        <div className="page-width flex items-center py-4">
          <Brand href="/" />
        </div>
      </header>

      <main className="page-width flex flex-1 items-center justify-center py-10">
        <section
          className="panel w-full max-w-[640px] px-6 py-12 text-center sm:px-12 sm:py-16"
          data-animate="enter"
        >
          <div
            aria-hidden="true"
            className="mx-auto inline-flex size-[4.5rem] items-center justify-center rounded-full bg-(--success-soft)"
          >
            <svg
              className="size-9 text-(--success)"
              fill="none"
              viewBox="0 0 36 36"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 18.5L15.25 23.75L26.5 12.5"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
              />
            </svg>
          </div>

          <h1 className="mt-7 text-[clamp(1.875rem,4.5vw,2.375rem)] font-extrabold tracking-[-0.035em] text-(--fg)">
            {t(locale, "done.title")}
          </h1>
          <p className="mx-auto mt-4 max-w-[480px] text-base leading-7 text-(--secondary)">
            {t(locale, "done.recorded", { title: resolvedEnvelopeTitle })}
          </p>
          <p className="mx-auto mt-3 max-w-[480px] text-base leading-7 text-(--secondary)">
            {t(locale, "done.emailComing")}
          </p>
          {embedded ? null : (
            <p className="mt-8 inline-flex rounded-full bg-(--surface) px-4 py-2 text-sm font-semibold text-(--secondary)">
              {t(locale, "done.closeTab")}
            </p>
          )}
        </section>
      </main>

      <PublicLegalFooter locale={locale} />
    </div>
  );
}
