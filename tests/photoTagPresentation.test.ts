import assert from "node:assert/strict";
import test from "node:test";
import { photoTagTone } from "../src/lib/data.ts";

test("uses the fixed pastel presentation tone for every person tag", () => {
  assert.deepEqual(
    ["A", "B", "C", "D", "E", "PARK", null].map((tag) => photoTagTone(tag)),
    [
      "bg-amber-200 text-amber-950",
      "bg-emerald-200 text-emerald-950",
      "bg-blue-200 text-blue-950",
      "bg-violet-200 text-violet-950",
      "bg-rose-200 text-rose-950",
      "bg-zinc-200 text-zinc-700",
      "bg-zinc-700 text-zinc-300",
    ]
  );
});