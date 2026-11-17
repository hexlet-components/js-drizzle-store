import { z } from "zod";
import { db } from "./db/index.js";
import { products } from "./db/schema.js";
import { productInput } from "./validation.js";

export const importProducts = async (input) => {
  const items = z.array(productInput).min(1).parse(input);

  return db.transaction(async (tx) => {
    const rows = [];

    for (const item of items) {
      const saved = await tx
        .insert(products)
        .values(item)
        .onConflictDoUpdate({
          target: products.sku,
          set: { name: item.name, price: item.price },
        })
        .returning({ sku: products.sku, price: products.price });
      rows.push(...saved);
    }

    return rows;
  });
};
