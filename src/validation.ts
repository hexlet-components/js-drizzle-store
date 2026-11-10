import { createInsertSchema } from "drizzle-zod";
import { products } from "./db/schema.ts";

export const productInput = createInsertSchema(products, {
  sku: (schema) => schema.trim().min(1),
  name: (schema) => schema.trim().min(1),
  price: (schema) => schema.positive(),
  stock: (schema) => schema.nonnegative(),
})
  .pick({ sku: true, name: true, price: true, stock: true, description: true })
  .strict();
