import { eq } from "drizzle-orm";
import assert from "node:assert/strict";
import { after, beforeEach, test } from "node:test";
import { db, pool } from "../src/db/index.ts";
import { orderItems, orders, products } from "../src/db/schema.ts";
import { resetDb, seedShop } from "./helpers.ts";

beforeEach(async () => {
  await resetDb();
  await seedShop();
});

after(async () => {
  await pool.end();
});

test("заказ получает статус new по умолчанию", async () => {
  const [order] = await db.select({ status: orders.status }).from(orders).where(eq(orders.id, 1));
  assert.equal(order.status, "new");
});

test("товар с позициями заказа удалить нельзя, restrict даёт 23001", async () => {
  const error = await db
    .delete(products)
    .where(eq(products.sku, "chair"))
    .catch((e: unknown) => e);
  assert.ok(error instanceof Error);
  assert.equal((error as Error & { cause?: { code?: string } }).cause?.code, "23001");
});

test("удаление заказа удаляет его позиции", async () => {
  await db.delete(orders).where(eq(orders.id, 1));
  const items = await db.select({ id: orderItems.id }).from(orderItems);
  assert.deepEqual(items, [{ id: 2 }]);
});

test("артикул товара уникален", async () => {
  const error = await db
    .insert(products)
    .values({ sku: "chair", name: "Другой стул", price: 1 })
    .catch((e: unknown) => e);
  assert.equal((error as Error & { cause?: { code?: string } }).cause?.code, "23505");
});
