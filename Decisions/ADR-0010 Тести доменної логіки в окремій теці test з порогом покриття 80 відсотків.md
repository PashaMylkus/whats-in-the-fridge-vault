---
id: adr-0010
type: decision
title: ADR-0010 Тести доменної логіки в окремій теці test з порогом покриття 80 відсотків
aliases: [vitest.config.ts, coverage thresholds, test/<модуль>.test.ts]
tags: [decision, adr, testing]
status: accepted
adr: 10
date: 2026-10-26
deciders: [Милькус Павло]
supersedes: null
applies_to: ["[[Спільний пакет]]", "[[Конфігурація agent harness]]"]
source: "whats-in-the-fridge@e056423:packages/shared/vitest.config.ts"
created: 2026-10-26
updated: 2026-10-26
---

# ADR-0010 Тести доменної логіки в окремій теці test з порогом покриття 80 відсотків

## Контекст

NFR-04 вимагає покриття доменної логіки [[Спільний пакет|спільного пакета]] ≥ 80 %. Тести генерує агент, тож їх доводиться часто правити. Водночас [[Guardrail]] W-01 вимагає підтвердження людини для будь-якої зміни `packages/shared/src/domain/**`. Якщо тести лежать поруч із кодом, кожна правка тесту виглядає як зміна доменного ядра, і справжні зміни коду губляться серед запитів на підтвердження.

## Рішення

- Тести доменної логіки — Vitest у `packages/<пакет>/test/<модуль>.test.ts`; вони імпортують код із `../src/domain/…`. У `vitest.config.ts`: `include: ['test/**/*.test.ts']`.
- Покриття примусове: `coverage.include: ['src/domain/**/*.ts']`, `thresholds` 80 % для lines, functions, branches і statements (провайдер v8).
- Тести генерує [[Skill|skill]] `/generate-tests` за правилами з нотаток vault. Його `allowed-tools` дозволяють `Edit` лише в `packages/*/test/**`, а не в `src/domain/`.

## Розглянуті альтернативи

- Тести поруч із кодом у `src/domain/` — не обрано: кожна правка тесту потребувала б підтвердження W-01.

## Наслідки

- (+) Агент править тести без підтвердження, а W-01 спрацьовує лише на справжні зміни доменної логіки. Так у коміті e056423 єдина правка в зоні W-01 (`normalize.ts`) відокремлена від 120 тестів.
- (+) Поріг NFR-04 перевіряє Vitest, а не рев'ю: за покриття нижче 80 % запуск завершується з помилкою.
- (−) Поріг діє лише для `npm run test:coverage`; звичайний `npm test` покриття не перевіряє.
- (−) `coverage.include` охоплює лише `src/domain/`, тож zod-схеми в `src/schemas/` під поріг не потрапляють.
