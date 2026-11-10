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

.PHONY: setup install prepare-env db-up db-down db-create migrate seed demo typecheck
