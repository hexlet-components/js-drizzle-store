import { afterAll, beforeEach, expect, test } from "vitest";
import { db, pool } from "../src/db/index.ts";
import { products } from "../src/db/schema.ts";
import { importProducts } from "../src/import-products.ts";
import { productPatchInput } from "../src/product-patch.ts";
import { productInput } from "../src/validation.ts";
import { resetDb } from "./helpers.ts";

beforeEach(async () => {
  await resetDb();
});

afterAll(async () => {
  await pool.end();
});

test("новый товар проверяется до записи", () => {
  expect(productInput.safeParse({ sku: "mug", name: "Кружка", price: 50000 }).success).toBe(true);
  expect(productInput.safeParse({ sku: "mug", name: " ", price: 50000 }).success).toBe(false);
  expect(productInput.safeParse({ sku: "mug", name: "Кружка", price: -1 }).success).toBe(false);
  expect(productInput.safeParse({ sku: "mug", name: "Кружка", price: 1, id: 7 }).success).toBe(false);
});

test("частичное обновление требует хотя бы одно поле", () => {
  expect(productPatchInput.safeParse({}).success).toBe(false);
  expect(productPatchInput.safeParse({ price: undefined }).success).toBe(false);
  expect(productPatchInput.safeParse({ description: null }).success).toBe(true);
});

test("импорт с ошибкой в пачке ничего не записывает", async () => {
  const batch = [
    { sku: "notebook", name: "Блокнот", price: 30000 },
    { sku: "pen", name: "Ручка", price: "дорого" },
  ];
  await expect(importProducts(batch)).rejects.toThrow();
  expect(await db.select().from(products)).toEqual([]);
});

test("импорт обновляет название и цену существующего товара", async () => {
  await importProducts([{ sku: "pen", name: "Ручка", price: 10000, stock: 3 }]);
  const rows = await importProducts([{ sku: "pen", name: "Ручка синяя", price: 12000 }]);

  expect(rows).toEqual([{ sku: "pen", price: 12000 }]);
  const [pen] = await db.select({ name: products.name, stock: products.stock }).from(products);
  expect(pen).toEqual({ name: "Ручка синяя", stock: 3 });
});
