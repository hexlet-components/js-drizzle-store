import { createUpdateSchema } from "drizzle-zod";
import { products } from "./db/schema.ts";

export const productPatchInput = createUpdateSchema(products, {
  name: (schema) => schema.trim().min(1),
  price: (schema) => schema.positive(),
})
  .pick({ name: true, price: true, description: true })
  .strict()
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "Нет изменений",
  });
