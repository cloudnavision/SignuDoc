import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, before, test } from "node:test";

import type pg from "pg";

import { openTestDatabase } from "../db/test-database.ts";
import { GOOGLE_CLAIMS, syncProfile } from "./provider-claims.ts";

// Each sign-in brings the account's name and picture up to date.
// Run with `npm run test:db`.

let database: pg.Pool;
const createdUsers: string[] = [];

before(async () => {
  database = await openTestDatabase();
});

after(async () => {
  for (const id of createdUsers) {
    await database.query(`delete from public."user" where id = $1`, [id]);
  }

  await database.end();
});

async function createUser(name: string) {
  const id = randomUUID();
  const email = `${id}@Example.test`;

  createdUsers.push(id);
  await database.query(
    `
      insert into public."user" (id, name, email, role, "emailVerified")
      values ($1, $2, $3, 'user', true)
    `,
    [id, name, email],
  );

  return { email, id };
}

async function read(id: string) {
  const { rows } = await database.query<{ image: string | null; name: string }>(
    `select name, image from public."user" where id = $1`,
    [id],
  );

  return { image: rows[0]?.image ?? null, name: rows[0]?.name };
}

test("the name and picture follow Google at each sign-in", async () => {
  const person = await createUser("M J");
  const first = "https://lh3.googleusercontent.com/a/first=s96-c";
  const second = "https://lh3.googleusercontent.com/a/second=s96-c";

  assert.equal(
    await syncProfile(
      person.email.toUpperCase(),
      { name: "Matt Jackson", picture: first },
      GOOGLE_CLAIMS,
      database,
    ),
    true,
  );
  assert.deepEqual(await read(person.id), {
    image: first,
    name: "Matt Jackson",
  });

  // A claim Google left out, or a picture from elsewhere, changes nothing.
  await syncProfile(
    person.email,
    { picture: "https://evil.example/x.png" },
    GOOGLE_CLAIMS,
    database,
  );
  assert.deepEqual(await read(person.id), {
    image: first,
    name: "Matt Jackson",
  });

  await syncProfile(person.email, { picture: second }, GOOGLE_CLAIMS, database);
  assert.deepEqual(await read(person.id), {
    image: second,
    name: "Matt Jackson",
  });
});

test("an address with no account changes nothing", async () => {
  assert.equal(
    await syncProfile(
      "nobody@example.test",
      { name: "Nobody" },
      GOOGLE_CLAIMS,
      database,
    ),
    false,
  );
});

test("a name-only claim keeps the stored picture, and a picture-only claim keeps the name", async () => {
  const person = await createUser("Old Name");
  const picture = "https://lh3.googleusercontent.com/a/kept=s96-c";

  await syncProfile(person.email, { picture }, GOOGLE_CLAIMS, database);
  await syncProfile(
    person.email,
    { name: "New Name" },
    GOOGLE_CLAIMS,
    database,
  );
  assert.deepEqual(await read(person.id), { image: picture, name: "New Name" });

  await syncProfile(
    person.email,
    { name: "x".repeat(300), picture: 42 },
    GOOGLE_CLAIMS,
    database,
  );
  assert.deepEqual(await read(person.id), {
    image: picture,
    name: "x".repeat(200),
  });

  await syncProfile(person.email, { name: "   " }, GOOGLE_CLAIMS, database);
  assert.deepEqual(await read(person.id), {
    image: picture,
    name: "x".repeat(200),
  });
});

test("a sign-in that brings nothing new does not write the account", async () => {
  const person = await createUser("Same Name");
  const picture = "https://lh3.googleusercontent.com/a/same=s96-c";
  const touched = async () => {
    const { rows } = await database.query<{ updated: string }>(
      `select "updatedAt"::text as updated from public."user" where id = $1`,
      [person.id],
    );

    return rows[0]?.updated;
  };

  await syncProfile(
    person.email,
    { name: "Same Name", picture },
    GOOGLE_CLAIMS,
    database,
    new Date("2030-01-01T00:00:00Z"),
  );

  const written = await touched();

  assert.equal(
    await syncProfile(
      person.email,
      { name: "Same Name", picture },
      GOOGLE_CLAIMS,
      database,
      new Date("2031-01-01T00:00:00Z"),
    ),
    true,
  );
  assert.equal(await touched(), written);
});
