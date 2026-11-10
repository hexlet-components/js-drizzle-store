import { db, pool } from "./db/index.ts";
import {
  categories,
  customers,
  orderItems,
  orders,
  productCategories,
  products,
} from "./db/schema.ts";

try {
  await db.insert(products).values([
    { sku: "chair", name: "Стул", price: 300000, stock: 10 },
    { sku: "desk", name: "Стол", price: 700000, stock: 0, description: "Большой стол" },
    { sku: "lamp", name: "Лампа", price: 150000, stock: 5 },
    { sku: "shelf", name: "Полка", price: 300000, stock: 2, description: "Настенная" },
  ]);
  await db.insert(customers).values([
    { firstName: "Аня", lastName: "Соколова", email: "anya@example.com" },
    { firstName: "Борис", lastName: "Волков", email: "boris@example.com" },
    { firstName: "Вера", lastName: "Орлова", email: "vera@example.com" },
  ]);
  await db
    .insert(orders)
    .values([{ customerId: 1 }, { customerId: 1, status: "paid" }, { customerId: 2 }]);
  await db.insert(orderItems).values([
    { orderId: 1, productId: 1, quantity: 2, price: 300000 },
    { orderId: 1, productId: 3, quantity: 1, price: 150000 },
    { orderId: 2, productId: 2, quantity: 1, price: 700000 },
    { orderId: 3, productId: 3, quantity: 2, price: 150000 },
  ]);
  await db.insert(categories).values([
    { code: "office", name: "Офис" },
    { code: "home", name: "Дом" },
    { code: "lighting", name: "Свет" },
    { code: "garden", name: "Сад" },
  ]);
  await db.insert(productCategories).values([
    { productId: 1, categoryId: 1 },
    { productId: 1, categoryId: 2 },
    { productId: 2, categoryId: 1 },
    { productId: 3, categoryId: 2 },
    { productId: 3, categoryId: 3 },
  ]);
} finally {
  await pool.end();
}
