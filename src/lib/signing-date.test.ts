import assert from "node:assert/strict";
import test from "node:test";

import { formatSigningDate } from "./signing-date.ts";

// 20:38 UTC on November 21, 2026: already the 22nd in India.
const MOMENT = Date.UTC(2026, 10, 21, 20, 38, 53);
const INDIA = -330;

test("a date field stamps the signer's own day by default", () => {
  assert.equal(formatSigningDate(MOMENT, INDIA), "November 22, 2026");
  assert.equal(formatSigningDate(MOMENT, INDIA, "date"), "November 22, 2026");
});

test("the time is the signer's own, with its offset from UTC", () => {
  assert.equal(formatSigningDate(MOMENT, INDIA, "time"), "2:08 AM (UTC+05:30)");
  assert.equal(
    formatSigningDate(MOMENT, INDIA, "date_time"),
    "November 22, 2026, 2:08 AM (UTC+05:30)",
  );
  assert.equal(formatSigningDate(MOMENT, 300, "time"), "3:38 PM (UTC-05:00)");
  assert.equal(formatSigningDate(MOMENT, 0, "time"), "8:38 PM (UTC)");
});

test("noon and midnight read as 12, not 0", () => {
  assert.equal(
    formatSigningDate(Date.UTC(2026, 0, 1, 0, 5), 0, "time"),
    "12:05 AM (UTC)",
  );
  assert.equal(
    formatSigningDate(Date.UTC(2026, 0, 1, 12, 0), 0, "time"),
    "12:00 PM (UTC)",
  );
});
