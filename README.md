# Drizzle ORM: учебный магазин

Репозиторий используется в курсе Хекслета «Drizzle ORM». На нём запускаются примеры уроков и выполняются самостоятельные работы. В нём лежит полная схема магазина из шести таблиц и её миграция, поэтому схему перед работой готовить не нужно.

## Состав

| Файл | Назначение |
| --- | --- |
| `src/db/schema.ts` | Таблицы `products`, `customers`, `orders`, `orderItems`, `categories` и `productCategories` |
| `src/db/index.ts` | Подключение Drizzle к PostgreSQL через пул `pg`, экспортирует `db` и `pool` |
| `drizzle/` | Миграция полной схемы, сгенерированная Drizzle Kit |
| `src/seed.ts` | Учебные данные магазина для пустой базы |
| `src/demo.ts` | Пример запроса с `innerJoin` |

## Запуск

Нужны Node.js 24 или новее, npm и Docker. Все команды выполняются из каталога проекта.

```bash
npm install
cp .env.example .env
docker run --name drizzle-course-db \
  -e POSTGRES_PASSWORD=drizzle \
  -e POSTGRES_DB=drizzle_course \
  -p 5434:5432 \
  -d postgres:18
docker exec drizzle-course-db pg_isready -U postgres -d drizzle_course
```

Каждый урок работает в своей пустой базе. Для неё создаётся база в контейнере, её адрес записывается в `.env`, затем применяется миграция.

```bash
docker exec drizzle-course-db createdb -U postgres drizzle_joins
# в .env: DATABASE_URL=postgres://postgres:drizzle@localhost:5434/drizzle_joins
npm run db:migrate
npx tsx --env-file=.env src/seed.ts
npm run demo
```

Программа печатает заказы покупателей.

```text
[
  { customer: 'Аня', orderId: 1 },
  { customer: 'Аня', orderId: 2 },
  { customer: 'Борис', orderId: 3 }
]
```

## Отличия от других репозиториев организации

Проект повторяет код курса, поэтому версии пакетов и команды совпадают с уроками.

- Пакеты ставит npm, потому что уроки пишут `npm run` и `npm install`.
- Версии `drizzle-orm`, `drizzle-kit`, `pg` и остальных пакетов закреплены точно. Обновление меняет вывод программ, и он расходится с уроками. Поднимать их нужно вместе с курсом.

## Чего здесь нет

- Описаний `relations()` для Relations API. Урок про Relations API добавляет их сам вместе со счётчиком запросов в `src/db/index.ts`.
- Промежуточной схемы из двух таблиц, `products` и `customers`, на которой построены уроки про вставку, выборку, обновление и удаление.
