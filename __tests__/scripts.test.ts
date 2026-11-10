import { execFileSync } from "node:child_process";
import { afterAll, beforeAll, expect, test } from "vitest";
import { pool } from "../src/db/index.ts";
import { resetDb } from "./helpers.ts";

beforeAll(async () => {
  await resetDb();
});

afterAll(async () => {
  await pool.end();
});

const run = (file: string) =>
  execFileSync("node", ["node_modules/tsx/dist/cli.mjs", file], {
    encoding: "utf8",
    env: { ...process.env, DRIZZLE_LOG: "false" },
  });

test("seed.ts заполняет базу, а demo.ts печатает заказы покупателей", () => {
  run("src/seed.ts");
  expect(run("src/demo.ts")).toBe([
      "[",
      "  { customer: 'Аня', orderId: 1 },",
      "  { customer: 'Аня', orderId: 2 },",
      "  { customer: 'Борис', orderId: 3 }",
      "]",
      "",
    ].join("\n"));
});
