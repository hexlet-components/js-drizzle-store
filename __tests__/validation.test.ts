import assert from "node:assert/strict";
import { after, beforeEach, test } from "node:test";
import { db, pool } from "../src/db/index.ts";
import { products } from "../src/db/schema.ts";
import { importProducts } from "../src/import-products.ts";
import { productPatchInput } from "../src/product-patch.ts";
import { productInput } from "../src/validation.ts";
import { resetDb } from "./helpers.ts";

beforeEach(async () => {
  await resetDb();
});

after(async () => {
  await pool.end();
});

test("новый товар проверяется до записи", () => {
  assert.equal(productInput.safeParse({ sku: "mug", name: "Кружка", price: 50000 }).success, true);
  assert.equal(productInput.safeParse({ sku: "mug", name: " ", price: 50000 }).success, false);
  assert.equal(productInput.safeParse({ sku: "mug", name: "Кружка", price: -1 }).success, false);
  assert.equal(productInput.safeParse({ sku: "mug", name: "Кружка", price: 1, id: 7 }).success, false);
});

test("частичное обновление требует хотя бы одно поле", () => {
  assert.equal(productPatchInput.safeParse({}).success, false);
  assert.equal(productPatchInput.safeParse({ price: undefined }).success, false);
  assert.equal(productPatchInput.safeParse({ description: null }).success, true);
});

test("импорт с ошибкой в пачке ничего не записывает", async () => {
  const batch = [
    { sku: "notebook", name: "Блокнот", price: 30000 },
    { sku: "pen", name: "Ручка", price: "дорого" },
  ];
  await assert.rejects(importProducts(batch));
  assert.deepEqual(await db.select().from(products), []);
});

test("импорт обновляет название и цену существующего товара", async () => {
  await importProducts([{ sku: "pen", name: "Ручка", price: 10000, stock: 3 }]);
  const rows = await importProducts([{ sku: "pen", name: "Ручка синяя", price: 12000 }]);

  assert.deepEqual(rows, [{ sku: "pen", price: 12000 }]);
  const [pen] = await db.select({ name: products.name, stock: products.stock }).from(products);
  assert.deepEqual(pen, { name: "Ручка синяя", stock: 3 });
});
