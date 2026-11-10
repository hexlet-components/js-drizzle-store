import { afterAll, beforeAll, expect, test } from "vitest";
import { db, pool } from "../src/db/index.ts";
import { resetDb, seedShop } from "./helpers.ts";

beforeAll(async () => {
  await resetDb();
  await seedShop();
});

afterAll(async () => {
  await pool.end();
});

test("покупатели загружаются вместе с заказами", async () => {
  const customers = await db.query.customers.findMany({
    columns: { firstName: true },
    orderBy: (table, { asc }) => [asc(table.id)],
    with: {
      orders: {
        columns: { id: true, status: true },
        orderBy: (table, { asc }) => [asc(table.id)],
      },
    },
  });

  expect(customers).toEqual([
    {
      firstName: "Аня",
      orders: [
        { id: 1, status: "new" },
        { id: 2, status: "paid" },
      ],
    },
    { firstName: "Вера", orders: [] },
  ]);
});

test("позиция заказа загружается с товаром", async () => {
  const item = await db.query.orderItems.findFirst({
    columns: { quantity: true },
    where: (table, { eq }) => eq(table.id, 1),
    with: { product: { columns: { sku: true } } },
  });

  expect(item).toEqual({ quantity: 2, product: { sku: "chair" } });
});
