import { execFileSync } from "node:child_process";
import { afterAll, beforeAll, expect, test } from "vitest";
import { pool } from "../src/db/index.js";
import { resetDb } from "./helpers.js";

beforeAll(async () => {
  await resetDb();
});

afterAll(async () => {
  await pool.end();
});

const run = (file) =>
  execFileSync("node", [file], {
    encoding: "utf8",
    env: { ...process.env, DRIZZLE_LOG: "false" },
  });

test("seed.js заполняет базу, а demo.js печатает заказы покупателей", () => {
  run("src/seed.js");
  expect(run("src/demo.js")).toBe(
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
