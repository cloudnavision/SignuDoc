import type { DbExecutor } from "../db/connection.ts";
import { SSO_PROVIDER_ID, type SsoConfig } from "./sso.ts";

// What a sign-in provider's verified ID token says about the person, for
// providers that tell an organization's accounts from personal ones:
//
// - the organization the account belongs to, which has to be one of the
//   install's allowed domains when sign-up is limited to domains, and has to
//   be there at all (a personal account has none), and
// - the person's name and profile picture, kept up to date on the account.
//
// Each provider is one entry in providerClaimsFor below. Google is the one
// there is: its hd claim, name and picture.

const MAX_NAME_LENGTH = 200;
const MAX_PICTURE_LENGTH = 2048;

export type ProviderClaims = {
  /** What is added to the provider's sign-in link to ask for the organization's accounts. */
  authorizationParams: (domains: readonly string[]) => Record<string, string>;
  /** What the provider calls the organization's accounts, for messages. */
  label: string;
  /** The claim that names the organization an account belongs to. */
  organizationClaim: string;
  /**
   * Hosts a profile picture may be served from. These are also the image
   * hosts the site's Content Security Policy allows (src/proxy.ts).
   */
  pictureHosts: readonly string[];
  pictureClaim: string;
  nameClaim: string;
};

export const GOOGLE_PICTURE_HOSTS = [
  "lh3.googleusercontent.com",
  "lh4.googleusercontent.com",
  "lh5.googleusercontent.com",
  "lh6.googleusercontent.com",
] as const;

export const GOOGLE_CLAIMS: ProviderClaims = {
  // The hd hint makes Google offer only accounts in the organization's
  // Workspace. "*" asks for any Workspace account when there are several
  // domains, or none are limited. It is only a hint; the ID token is checked
  // on the way back.
  // https://developers.google.com/identity/openid-connect/openid-connect#hd-param
  authorizationParams: (domains) => ({
    hd: domains.length === 1 ? domains[0]! : "*",
  }),
  label: "Google Workspace",
  nameClaim: "name",
  organizationClaim: "hd",
  pictureClaim: "picture",
  pictureHosts: GOOGLE_PICTURE_HOSTS,
};

/** The claims to read for a sign-in provider, or null when it has none. */
export function providerClaimsFor(
  providerId: string,
  sso: SsoConfig | null,
): ProviderClaims | null {
  return providerId === SSO_PROVIDER_ID && sso?.google ? GOOGLE_CLAIMS : null;
}

export type OrganizationDecision =
  | { allowed: true }
  | {
      allowed: false;
      code: "organization_account_required" | "organization_not_allowed";
      message: string;
    };

/**
 * Checks the organization claim of a verified ID token. A personal account
 * has none. An account in another organization has that organization's
 * domain. With no domains given, any organization's account passes.
 */
export function checkOrganization(
  claims: Readonly<Record<string, unknown>> | undefined,
  provider: ProviderClaims,
  domains: readonly string[],
): OrganizationDecision {
  const claim = claims?.[provider.organizationClaim];
  const organization =
    typeof claim === "string" ? claim.trim().toLowerCase() : "";

  if (!organization) {
    return {
      allowed: false,
      code: "organization_account_required",
      message: `Sign in with your organization's ${provider.label} account.`,
    };
  }

  if (domains.length > 0 && !domains.includes(organization)) {
    return {
      allowed: false,
      code: "organization_not_allowed",
      message: `This account is not in this organization's ${provider.label}.`,
    };
  }

  return { allowed: true };
}

export type ProfileClaims = { image: string | null; name: string | null };

/** The name and picture in an ID token's claims, when they can be used. */
export function readProfileClaims(
  claims: Record<string, unknown> | null | undefined,
  provider: ProviderClaims,
): ProfileClaims {
  const rawName = claims?.[provider.nameClaim];
  const name = (typeof rawName === "string" ? rawName : "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_NAME_LENGTH);

  return {
    image: readPicture(claims?.[provider.pictureClaim], provider.pictureHosts),
    name: name || null,
  };
}

function readPicture(value: unknown, hosts: readonly string[]): string | null {
  if (typeof value !== "string" || value.length > MAX_PICTURE_LENGTH) {
    return null;
  }

  try {
    const url = new URL(value);

    return url.protocol === "https:" &&
      hosts.includes(url.hostname) &&
      url.port === "" &&
      !url.username &&
      !url.password
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

/** The fields to give a new account, leaving out what the provider did not send. */
export function profileFields(
  claims: Record<string, unknown> | null | undefined,
  provider: ProviderClaims,
): { image?: string; name?: string } {
  const profile = readProfileClaims(claims, provider);

  return {
    ...(profile.image ? { image: profile.image } : {}),
    ...(profile.name ? { name: profile.name } : {}),
  };
}

/**
 * Brings an existing account's name and picture up to date with the
 * provider. What it did not send is left as it is, and an account that is
 * already up to date is not written. True when the account was found.
 */
export async function syncProfile(
  email: string,
  claims: Record<string, unknown> | null | undefined,
  provider: ProviderClaims,
  database: DbExecutor,
  now: Date = new Date(),
): Promise<boolean> {
  const profile = readProfileClaims(claims, provider);

  if (!profile.name && !profile.image) {
    return false;
  }

  const target = email.trim().toLowerCase();
  const current = await database.query<{
    id: string;
    image: string | null;
    name: string | null;
  }>(`SELECT id, name, image FROM "user" WHERE lower(email) = $1`, [target]);
  const account = current.rows[0];

  if (!account) {
    return false;
  }

  const name = profile.name ?? account.name;
  const image = profile.image ?? account.image;

  // Most sign-ins bring nothing new, so they leave the account alone.
  if (name === account.name && image === account.image) {
    return true;
  }

  await database.query(
    `UPDATE "user" SET name = $1, image = $2, "updatedAt" = $3 WHERE id = $4`,
    [name, image, now.toISOString(), account.id],
  );

  return true;
}
