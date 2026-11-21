"use client";

import Link from "next/link";

import { useBranding } from "@/components/layout/branding-provider";
import { SIGNUDOC_NAME, SIGNUDOC_URL } from "@/lib/branding";
import { t, type SignerLocale } from "@/lib/i18n";
import { PUBLIC_COPYRIGHT_YEAR, publicFooterLinks } from "@/lib/legal";
import { cn } from "@/lib/cn";
import { PERMITTED_USE_PATH } from "@/lib/permitted-uses";

type PublicLegalFooterProps = {
  className?: string;
  contentClassName?: string;
  labelVariant?: "long" | "short";
  /** The signer's language, on pages a signer sees; English elsewhere. */
  locale?: SignerLocale;
  linkClassName?: string;
};

type FooterLink = {
  external: boolean;
  href: string;
  label: string;
};

export function PublicLegalFooter({
  className = "",
  contentClassName = "",
  labelVariant = "short",
  linkClassName,
  locale = "en",
}: PublicLegalFooterProps) {
  const branding = useBranding();
  const resolvedLinkClassName =
    linkClassName ??
    "text-[0.8125rem] font-medium text-(--tertiary) transition-colors hover:text-(--accent-ink)";
  // The hosted service links to its own pages. Any other install links to
  // whatever terms and privacy policy its organization has published.
  const links: FooterLink[] = branding.hosted
    ? publicFooterLinks.map((link) => ({
        external: false,
        href: link.href,
        label: labelVariant === "long" ? link.longLabel : link.shortLabel,
      }))
    : [
        ...(branding.termsUrl
          ? [
              {
                external: true,
                href: branding.termsUrl,
                label: t(
                  locale,
                  labelVariant === "long" ? "footer.termsLong" : "footer.terms",
                ),
              },
            ]
          : []),
        // Without the organization's own policy, signers still get a
        // notice, built from the install's settings.
        branding.privacyUrl
          ? {
              external: true,
              href: branding.privacyUrl,
              label: t(
                locale,
                labelVariant === "long"
                  ? "footer.privacyLong"
                  : "footer.privacy",
              ),
            }
          : {
              external: false,
              href:
                locale === "en"
                  ? "/signer-privacy"
                  : `/signer-privacy?language=${locale}`,
              label:
                labelVariant === "long"
                  ? t(locale, "footer.privacyNotice")
                  : t(locale, "footer.privacy"),
            },
      ];

  // Which documents may be signed here: on every install.
  links.push({
    external: false,
    href: PERMITTED_USE_PATH,
    label: t(
      locale,
      labelVariant === "long" ? "footer.eSignaturesLong" : "footer.eSignatures",
    ),
  });

  return (
    <footer lang={locale} className={cn("relative z-10", className)}>
      <div className={cn("page-width py-7", contentClassName)}>
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-[0.8125rem] text-(--tertiary)">
            © {PUBLIC_COPYRIGHT_YEAR} {branding.productName}
          </p>

          {links.length > 0 ? (
            <nav
              aria-label="Footer"
              className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
            >
              {links.map((link) =>
                link.external ? (
                  <a
                    className={resolvedLinkClassName}
                    href={link.href}
                    key={link.href}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    className={resolvedLinkClassName}
                    href={link.href}
                    key={link.href}
                  >
                    {link.label}
                  </Link>
                ),
              )}
            </nav>
          ) : null}

          {branding.hosted ? null : (
            <a
              className={resolvedLinkClassName}
              href={SIGNUDOC_URL}
              rel="noreferrer"
              target="_blank"
            >
              {t(locale, "footer.poweredBy", { name: SIGNUDOC_NAME })}
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
