import assert from "node:assert/strict";
import test from "node:test";
import { QR_CODES } from "../src/lib/data.ts";

const locationsById = Object.fromEntries(QR_CODES.map((qr) => [qr.id, qr.location]));

test("shows interrogation QR locations matching the field placement", () => {
  assert.deepEqual(
    {
      f5r7t2: locationsById.f5r7t2,
      g1h6n8: locationsById.g1h6n8,
      m1d7k5: locationsById.m1d7k5,
      n4v8z3: locationsById.n4v8z3,
      w3n5k7: locationsById.w3n5k7,
    },
    {
      f5r7t2: "자재 물류창고",
      g1h6n8: "나팀장 사무실",
      m1d7k5: "나사장 집무실",
      n4v8z3: "자재 물류창고",
      w3n5k7: "채소장 연구실",
    }
  );
});