import { sql } from "drizzle-orm";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "../src/db/index.ts";
import { customers, orderItems, orders, products } from "../src/db/schema.ts";

// Тесты пересоздают схему, поэтому работают только с отдельной тестовой базой.
const url = new URL(process.env.DATABASE_URL ?? "");
if (!url.pathname.endsWith("_test")) {
  throw new Error(`Тесты запускаются только на базе с именем *_test, сейчас ${url.pathname}`);
}

export async function resetDb() {
  await db.execute(sql`drop schema if exists drizzle cascade`);
  await db.execute(sql`drop schema public cascade`);
  await db.execute(sql`create schema public`);
  await migrate(db, { migrationsFolder: "drizzle" });
}

export async function seedShop() {
  await db.insert(products).values([
    { sku: "chair", name: "Стул", price: 300000, stock: 10 },
    { sku: "lamp", name: "Лампа", price: 150000, stock: 5 },
  ]);
  await db.insert(customers).values([
    { firstName: "Аня", lastName: "Соколова", email: "anya@example.com" },
    { firstName: "Вера", lastName: "Орлова", email: "vera@example.com" },
  ]);
  await db.insert(orders).values([{ customerId: 1 }, { customerId: 1, status: "paid" }]);
  await db.insert(orderItems).values([
    { orderId: 1, productId: 1, quantity: 2, price: 300000 },
    { orderId: 2, productId: 2, quantity: 1, price: 150000 },
  ]);
}
