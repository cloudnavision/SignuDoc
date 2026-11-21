import assert from "node:assert/strict";
import { test } from "node:test";

import {
  checkOrganization,
  GOOGLE_CLAIMS,
  profileFields,
  providerClaimsFor,
  readProfileClaims,
} from "./provider-claims.ts";
import { readSsoConfig } from "./sso.ts";

const PICTURE = "https://lh3.googleusercontent.com/a/ACg8ocJ-example=s96-c";
const google = readSsoConfig({
  SSO_CLIENT_ID: "client",
  SSO_CLIENT_SECRET: "secret",
  SSO_ISSUER: "https://accounts.google.com/",
});
const okta = readSsoConfig({
  SSO_CLIENT_ID: "client",
  SSO_CLIENT_SECRET: "secret",
  SSO_ISSUER: "https://acme.okta.com",
});

test("only a Google issuer brings the Google claims", () => {
  assert.equal(google?.google, true);
  assert.equal(okta?.google, false);
  assert.equal(providerClaimsFor("sso", google), GOOGLE_CLAIMS);
  assert.equal(providerClaimsFor("sso", okta), null);
  assert.equal(providerClaimsFor("sso", null), null);
  assert.equal(providerClaimsFor("other", google), null);
});

test("Google is asked for the one allowed domain, or any Workspace account", () => {
  assert.deepEqual(GOOGLE_CLAIMS.authorizationParams(["example.com"]), {
    hd: "example.com",
  });
  assert.deepEqual(GOOGLE_CLAIMS.authorizationParams(["a.com", "b.com"]), {
    hd: "*",
  });
  assert.deepEqual(GOOGLE_CLAIMS.authorizationParams([]), { hd: "*" });
});

test("the hd claim decides whether a Google account is in the organization", () => {
  const domains = ["example.com"];

  assert.deepEqual(
    checkOrganization({ hd: "Example.com" }, GOOGLE_CLAIMS, domains),
    { allowed: true },
  );

  for (const claims of [
    { email: "pat@gmail.com" },
    { hd: "" },
    { hd: 42 },
    {},
    undefined,
  ]) {
    const decision = checkOrganization(claims, GOOGLE_CLAIMS, domains);

    assert.equal(decision.allowed, false);
    assert.equal(
      !decision.allowed && decision.code,
      "organization_account_required",
    );
  }

  const elsewhere = checkOrganization(
    { hd: "other.com" },
    GOOGLE_CLAIMS,
    domains,
  );

  assert.equal(
    !elsewhere.allowed && elsewhere.code,
    "organization_not_allowed",
  );
});

test("with no domains limited, any Workspace account passes and a personal one does not", () => {
  assert.equal(
    checkOrganization({ hd: "other.com" }, GOOGLE_CLAIMS, []).allowed,
    true,
  );
  assert.equal(checkOrganization({}, GOOGLE_CLAIMS, []).allowed, false);
});

test("the name and picture are taken from the claims", () => {
  assert.deepEqual(
    readProfileClaims(
      { name: "  Matt   Jackson ", picture: PICTURE },
      GOOGLE_CLAIMS,
    ),
    { image: PICTURE, name: "Matt Jackson" },
  );
});

test("a picture anywhere but Google's photo hosts, or not https, is dropped", () => {
  for (const picture of [
    "http://lh3.googleusercontent.com/a/x",
    "https://lh3.googleusercontent.com.evil.example/a/x",
    "https://evil.example/a.png",
    "https://user@lh3.googleusercontent.com/a/x",
    "https://lh3.googleusercontent.com:8443/a/x",
    "javascript:alert(1)",
    `https://lh3.googleusercontent.com/${"a".repeat(3000)}`,
    42,
  ]) {
    assert.equal(
      readProfileClaims({ picture }, GOOGLE_CLAIMS).image,
      null,
      String(picture),
    );
  }
});

test("Google's photo hosts lh3 to lh6 are accepted, and no other", () => {
  for (const number of [3, 4, 5, 6]) {
    const picture = `https://lh${String(number)}.googleusercontent.com/a/x=s96-c`;

    assert.equal(readProfileClaims({ picture }, GOOGLE_CLAIMS).image, picture);
  }

  for (const host of [
    "lh2.googleusercontent.com",
    "lh7.googleusercontent.com",
    "googleusercontent.com",
  ]) {
    assert.equal(
      readProfileClaims({ picture: `https://${host}/a/x` }, GOOGLE_CLAIMS)
        .image,
      null,
      host,
    );
  }
});

test("a name is capped at 200 characters, and a blank or non-string name is no name", () => {
  assert.equal(
    readProfileClaims({ name: "a".repeat(300) }, GOOGLE_CLAIMS).name?.length,
    200,
  );

  for (const name of [undefined, null, 42, ["Ann"], " \t\n "]) {
    assert.equal(readProfileClaims({ name }, GOOGLE_CLAIMS).name, null);
  }
});

test("a new account gets only what the provider sent", () => {
  assert.deepEqual(profileFields({ name: " " }, GOOGLE_CLAIMS), {});
  assert.deepEqual(profileFields(null, GOOGLE_CLAIMS), {});
  assert.deepEqual(
    profileFields({ name: "Ann", picture: PICTURE }, GOOGLE_CLAIMS),
    { image: PICTURE, name: "Ann" },
  );
});
