import { execFileSync } from "node:child_process";
import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { pool } from "../src/db/index.ts";
import { resetDb } from "./helpers.ts";

before(async () => {
  await resetDb();
});

after(async () => {
  await pool.end();
});

const run = (file: string) =>
  execFileSync("node", ["node_modules/tsx/dist/cli.mjs", file], {
    encoding: "utf8",
    env: { ...process.env, DRIZZLE_LOG: "false" },
  });

test("seed.ts заполняет базу, а demo.ts печатает заказы покупателей", () => {
  run("src/seed.ts");
  assert.equal(
    run("src/demo.ts"),
    [
      "[",
      "  { customer: 'Аня', orderId: 1 },",
      "  { customer: 'Аня', orderId: 2 },",
      "  { customer: 'Борис', orderId: 3 }",
      "]",
      "",
    ].join("\n"),
  );
});
