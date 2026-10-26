---
id: component-api-server
type: component
title: API-сервер
aliases: [apps/api, backend, REST API]
tags: [component, layer/api]
status: planned
layer: api
path: apps/api
requirements: [FR-01, FR-02, FR-04, FR-05, FR-06, FR-07, FR-08, FR-09, FR-10]
implements: []
depends_on: ["[[Спільний пакет]]", "[[База даних]]"]
source: "whats-in-the-fridge@e2a30f4:docs/app-requirements.md"
created: 2026-10-26
updated: 2026-10-26
---

# API-сервер

REST API на Node.js 24 LTS + Express + TypeScript. Складається з функціональних модулів, кожен із яких має однакову шарову структуру (див. [[ADR-0007 Шарова архітектура модулів API]]).

## Модулі

- [[Модуль автентифікації]] — `/api/auth`
- [[Модуль продуктів]] — `/api/products`
- [[Модуль рецептів]] — `/api/recipes`
- [[Модуль списку покупок]] — `/api/shopping-items`
- [[Модуль журналу та статистики]] — `/api/events`, `/api/stats`

## Наскрізні механізми

- `validate(schema)` — middleware валідації тіла й параметрів запиту zod-схемами зі [[Спільний пакет|спільного пакета]]; помилка → 400 з переліком полів.
- `requireAuth` — перевірка сесії (див. [[Модуль автентифікації]]).
- Єдиний обробник помилок: формат `{ error: { code, message, details? } }`.

## Структура модуля

```
apps/api/src/modules/<module>/
  <module>.router.ts      # HTTP: маршрути, validate, requireAuth
  <module>.service.ts     # бізнес-правила, транзакції
  <module>.repository.ts  # доступ до Prisma, фільтр за userId
  <module>.test.ts        # інтеграційні тести Supertest
```
