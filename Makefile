setup: install prepare-env db-up

install:
	npm ci

prepare-env:
	cp -n .env.example .env

db-up:
	docker compose up -d --wait

db-down:
	docker compose down

# Пустая база для урока: make db-create DB=drizzle_joins_study
db-create:
	docker exec drizzle-course-db createdb -U postgres $(DB)

migrate:
	npm run db:migrate

seed:
	npx tsx --env-file=.env src/seed.ts

demo:
	npm run demo

typecheck:
	npm run typecheck

# Тесты пересоздают схему, поэтому идут в отдельной базе drizzle_store_test
TEST_DATABASE_URL = postgres://postgres:postgres@localhost:5432/drizzle_store_test

test:
	docker exec drizzle-course-db psql -U postgres -tAc "select 1 from pg_database where datname = 'drizzle_store_test'" | grep -q 1 \
		|| docker exec drizzle-course-db createdb -U postgres drizzle_store_test
	DATABASE_URL=$(TEST_DATABASE_URL) npm test

.PHONY: setup install prepare-env db-up db-down db-create migrate seed demo typecheck test
