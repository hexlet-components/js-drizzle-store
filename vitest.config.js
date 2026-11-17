import { defineConfig } from "vitest/config";

// Все файлы работают с одной тестовой базой и пересоздают её схему,
// поэтому идут по очереди.
export default defineConfig({
  test: {
    fileParallelism: false,
  },
});
