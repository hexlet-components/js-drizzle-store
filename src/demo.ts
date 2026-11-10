import { asc, eq } from "drizzle-orm";
import { db, pool } from "./db/index.ts";
import { customers, orders } from "./db/schema.ts";

try {
  const rows = await db
    .select({ customer: customers.firstName, orderId: orders.id })
    .from(customers)
    .innerJoin(orders, eq(orders.customerId, customers.id))
    .orderBy(asc(customers.id), asc(orders.id));

  console.log(rows);
} finally {
  await pool.end();
}
