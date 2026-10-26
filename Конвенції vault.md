---
id: guide-vault-conventions
type: guide
title: Конвенції vault
aliases: [Conventions, правила vault]
tags: [guide]
status: active
source: "whats-in-the-fridge@e2a30f4:docs/harness-requirements.md"
created: 2026-10-26
updated: 2026-10-26
---

# Конвенції vault

Правила, що роблять vault однаково зрозумілим людині й агенту. Їх перевіряє скрипт `tools/validate-vault.mjs`, а з ПР № 3 — [[MCP-сервер бази знань]] під час запису.

## Структура

| Директорія | Тип нотатки (`type`) | Що містить |
|---|---|---|
| `Concepts/` | `concept` | поняття предметної області, їх атрибути й правила |
| `Components/` | `component` | модулі та компоненти кодової бази (по одній нотатці на компонент) |
| `Decisions/` | `decision` | архітектурні рішення у форматі [[ADR]] |
| `Glossary/` | `glossary` | терміни з коротким визначенням |
| `Changes/` | `change` | журнал завершених задач і змін у репозиторії застосунку (створюються інструментом `ingest_note`) |
| корінь | `moc`, `guide` | [[Map of Content|MOC-нотатки]] та ця нотатка |
| `Templates/` | — | шаблони frontmatter для плагіна Templates |

## Найменування

- Назва файлу = заголовок нотатки = поле `title`; українською, повними словами, без скорочень, у формі однини («Продукт», а не «Продукти»).
- ADR: `ADR-NNNN Назва рішення.md`, номер не перевикористовується.
- MOC: `MOC-<Розділ>.md`.
- Назви файлів унікальні в межах усього vault — посилання `[[Назва]]` однозначні.
- Синоніми й англійські назви — у полі `aliases` (за ними працює пошук).

## Frontmatter

Обов'язкові поля для всіх типів: `id` (латиницею, `<type>-<slug>`, незмінний), `type`, `title`, `aliases`, `tags`, `status`, `source`, `created`, `updated`.

| Тип | Додаткові поля | Допустимі `status` |
|---|---|---|
| `concept` | `requirements` — FR-xx | `active`, `deprecated` |
| `component` | `layer` (web, api, shared, db, harness), `path`, `requirements`, `implements`, `depends_on` | `planned`, `in-progress`, `implemented`, `deprecated` |
| `decision` | `adr`, `date`, `deciders`, `supersedes`, `applies_to` | `proposed`, `accepted`, `superseded`, `deprecated` |
| `glossary` | `term_en` | `active`, `deprecated` |
| `change` | `kind` (feature, fix, docs, refactor, test, chore), `date`, `commit`, `pr`, `affects` | `done` |

`source` вказує першоджерело та коміт у форматі `репозиторій@коміт:шлях` — агент може перевірити актуальність нотатки. Якщо нотатка суперечить коду, пріоритет має код, а нотатка оновлюється.

## Лінкування

- Кожне згадування поняття, що має власну нотатку, оформлюється як `[[wiki-посилання]]` хоча б один раз у нотатці; для відмінків — `[[Продукт|продуктів]]`.
- Типізовані відношення (`depends_on`, `implements`, `applies_to`, `supersedes`, `affects`) записуються у frontmatter як посилання `"[[Назва]]"`; їх domain і range визначено в [[Онтологія застосунку]].
- Кожна нотатка досяжна з [[MOC-Застосунок]]; нотатки без вхідних посилань (сироти) не допускаються.
- Шаблони: `Templates/Concept.md`, `Templates/Component.md`, `Templates/Decision.md`, `Templates/Glossary.md`, `Templates/Change.md`.
- Нотатки `change` для комітів мають `id` виду `change-<sha7>` — повторний запис того самого коміту оновлює, а не дублює нотатку.
