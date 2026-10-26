---
id: change-e2a30f4
type: change
title: Формування вимог до застосунку та agent harness
aliases: []
tags: [change]
status: done
kind: docs
date: 2026-10-26
commit: e2a30f4
pr: null
affects: ["[[Веб-клієнт]]", "[[API-сервер]]", "[[Спільний пакет]]", "[[База даних]]", "[[MCP-сервер бази знань]]", "[[Конфігурація agent harness]]"]
source: "whats-in-the-fridge@e2a30f4:docs/app-requirements.md"
created: 2026-10-26
updated: 2026-10-26
---

# Формування вимог до застосунку та agent harness

Перший коміт репозиторію (ПР1). Він фіксує аналіз задачі та вимоги, з яких виведено нотатки цього vault.

- `ЗАВДАННЯ.md` — постановка завдання за шаблоном курсу.
- `docs/app-requirements.md` — [[Функціональна вимога|функціональні вимоги]] FR-01…FR-10, нефункціональні вимоги, стек і вибір IDE ([[ADR-0004 Claude Code як агентна IDE]]). Трасування до понять і компонентів — у [[MOC-Вимоги]].
- `docs/harness-requirements.md` — вимоги до [[Agent harness|agent harness]]: джерела даних, цільові задачі T-01…T-05, [[Guardrail|guardrails]] allow / warn / block, вимоги до оркестрації та оцінювання.
- `README.md` і `.gitignore` — опис репозиторію та ігноровані файли.

Вимоги визначають усі заплановані компоненти: [[Веб-клієнт]], [[API-сервер]], [[Спільний пакет]] і [[База даних]] у застосунку, а також [[MCP-сервер бази знань]] і [[Конфігурація agent harness]] в agent harness.
