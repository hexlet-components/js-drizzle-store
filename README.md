# Drizzle ORM: учебный магазин

[![Check](https://github.com/hexlet-components/js-drizzle-store/actions/workflows/check.yml/badge.svg)](https://github.com/hexlet-components/js-drizzle-store/actions/workflows/check.yml)

## Зачем это нужно

Репозиторий используется в курсе Хекслета [«Drizzle ORM»](https://ru.hexlet.io/courses/js-drizzle?utm_source=github&utm_medium=referral&utm_campaign=hexlet-components&utm_content=js-drizzle-store). На нём запускаются примеры уроков и выполняются самостоятельные работы. В нём лежит полная схема магазина из шести таблиц и её миграция, поэтому схему перед работой готовить не нужно.

## Требования

- Node.js 24 или новее и npm, [инструкция по установке](https://github.com/Hexlet/ru-instructions/blob/main/nodejs.md)
- Docker с Compose, [инструкция по установке](https://github.com/Hexlet/ru-instructions/blob/main/docker.md). Без Docker подойдёт свой PostgreSQL, см. раздел «Без Docker»
- Make
- [mise](https://mise.jdx.dev/) для проверок репозитория, см. раздел «Разработка». Курсу он не нужен, но через него удобно поставить Node.js, [инструкция](https://github.com/Hexlet/ru-instructions/blob/main/nodejs.md#используя-менеджер-версий-mise)

## Состав

| Файл | Назначение |
| --- | --- |
| `src/db/schema.ts` | Таблицы `products`, `customers`, `orders`, `orderItems`, `categories` и `productCategories` |
| `src/db/index.ts` | Подключение Drizzle к PostgreSQL через пул `pg`, экспортирует `db` и `pool` |
| `drizzle/` | Миграция полной схемы, сгенерированная Drizzle Kit |
| `src/seed.ts` | Учебные данные магазина для пустой базы |
| `src/demo.ts` | Пример запроса с `innerJoin` |
| `compose.yaml` | PostgreSQL 18 в контейнере `drizzle-course-db` на порту `5434` |

## Запуск

Все команды выполняются из каталога проекта. Подготовка ставит пакеты, создаёт `.env` из `.env.example` и запускает PostgreSQL.

```bash
make setup
```

Compose поднимает PostgreSQL 18 в контейнере `drizzle-course-db` на порту `5434` с паролем `drizzle`, как в уроках курса. Команда `--wait` дожидается, пока база начнёт принимать подключения. Данные хранятся в томе и переживают перезапуск контейнера. Если контейнер `drizzle-course-db` уже создан командой `docker run` из урока, compose не нужен, и примеры работают с этим контейнером.

Каждый урок работает в своей пустой базе. Для неё создаётся база в контейнере, её адрес записывается в `.env`, затем применяется миграция.

```bash
make db-create DB=drizzle_joins
# в .env: DATABASE_URL=postgres://postgres:drizzle@localhost:5434/drizzle_joins
make migrate
make seed
make demo
```

Цели `make` повторяют команды уроков. `make db-create` вызывает `docker exec drizzle-course-db createdb`, `make migrate` и `make demo` вызывают `npm run db:migrate` и `npm run demo`, `make seed` запускает _src/seed.ts_.

Программа печатает заказы покупателей.

```text
[
  { customer: 'Аня', orderId: 1 },
  { customer: 'Аня', orderId: 2 },
  { customer: 'Борис', orderId: 3 }
]
```

Контейнер останавливается командой `make db-down`. Команда `docker compose down -v` удаляет его вместе со всеми базами.

## Без Docker

Проекту нужен любой PostgreSQL, до которого программа доходит по адресу из `DATABASE_URL`. Команды уроков вида `docker exec drizzle-course-db createdb …` в этом случае заменяются клиентскими утилитами PostgreSQL `createdb` и `psql`.

### PostgreSQL на своём компьютере

PostgreSQL ставится по [инструкции для вашей системы](https://github.com/Hexlet/ru-instructions/blob/main/postgresql.md). Вместе с сервером ставятся `createdb` и `psql`. По умолчанию сервер слушает порт `5432`, а пользователь и пароль задаются при установке.

```bash
createdb -h localhost -p 5432 -U postgres drizzle_joins
# в .env: DATABASE_URL=postgres://postgres:<пароль>@localhost:5432/drizzle_joins
npm run db:migrate
```

### Облачная база

Подойдёт облачный сервис с PostgreSQL, например Neon или Supabase. Сервис выдаёт строку подключения, она записывается в `DATABASE_URL` целиком, вместе с параметрами после `?`.

Отдельная база для урока создаётся в панели сервиса или через `psql` по выданной строке.

```bash
psql "<строка подключения>" -c "CREATE DATABASE drizzle_joins"
```

Если сервис даёт только одну базу, уроки работают в ней по очереди. Перед следующим уроком таблицы и журнал миграций удаляются, затем миграция применяется заново.

```bash
psql "<строка подключения>" -c "DROP SCHEMA IF EXISTS drizzle CASCADE; DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
npm run db:migrate
```

## Разработка

Проверки репозитория собраны в [mise](https://mise.jdx.dev/). Команда `mise run setup` ставит пакеты и git-хуки, `mise run check` запускает тот же набор проверок, что и CI.

## Отличия от других репозиториев организации

Проект повторяет код курса, поэтому версии пакетов и команды совпадают с уроками.

- Пакеты ставит npm, потому что уроки пишут `npm run` и `npm install`.
- Версии `drizzle-orm`, `drizzle-kit`, `pg` и остальных пакетов закреплены точно. Обновление меняет вывод программ, и он расходится с уроками. Поднимать их нужно вместе с курсом.

## Чего здесь нет

- Описаний `relations()` для Relations API. Урок про Relations API добавляет их сам вместе со счётчиком запросов в `src/db/index.ts`.
- Промежуточной схемы из двух таблиц, `products` и `customers`, на которой построены уроки про вставку, выборку, обновление и удаление.

---

[![Hexlet Ltd. logo](https://raw.githubusercontent.com/Hexlet/assets/master/images/hexlet_logo128.png)](https://hexlet.io/?utm_source=github&utm_medium=referral&utm_campaign=hexlet-components&utm_content=js-drizzle-store)

This repository is created and maintained by the team and the community of Hexlet, an educational project. [Read more about Hexlet](https://hexlet.io/?utm_source=github&utm_medium=referral&utm_campaign=hexlet-components&utm_content=js-drizzle-store).
