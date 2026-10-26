---
id: component-mcp-kb-server
type: component
title: MCP-сервер бази знань
aliases: [fridge-kb, mcp-server]
tags: [component, layer/harness]
status: planned
layer: harness
path: mcp-server
implements: []
depends_on: ["[[Конвенції vault]]"]
source: "whats-in-the-fridge@e2a30f4:docs/harness-requirements.md"
created: 2026-10-26
updated: 2026-10-26
---

# MCP-сервер бази знань

Компонент **harness**, а не застосунку: MCP-сервер `fridge-kb` (TypeScript, `@modelcontextprotocol/sdk`, транспорт stdio) у директорії `mcp-server/` репозиторію застосунку. Єдиний дозволений шлях доступу агента до цього vault (див. [[ADR-0005 Окремий репозиторій бази знань із доступом через MCP]]). Реалізується в ПР № 3.

## Інструменти (план)

| Інструмент | Тип | Призначення |
|---|---|---|
| `kb_search(query)` | retrieval | повнотекстовий пошук за назвою, `aliases`, тегами й текстом |
| `kb_get_note(id)` | retrieval | нотатка за `id` з frontmatter |
| `kb_list(type)` | retrieval | перелік нотаток типу concept / component / decision / glossary |
| `kb_related(id)` | retrieval | вихідні й вхідні wiki-посилання нотатки |
| `kb_upsert_note(note)` | ingestion | створити / оновити нотатку з валідацією frontmatter за [[Конвенції vault|конвенціями]] |
| `kb_ingest_adr(path)` | ingestion | перенести ADR з `docs/adr/` застосунку в `Decisions/` |

Кожен ingestion-виклик робить коміт у репозиторії vault. Схема frontmatter, яку перевіряє сервер, описана в [[Конвенції vault]].
