---
id: component-mcp-kb-server
type: component
title: MCP-сервер бази знань
aliases: [fridge-kb, mcp-server]
tags: [component, layer/harness]
status: implemented
layer: harness
path: mcp-server
implements: []
depends_on: ["[[Конвенції vault]]"]
source: "whats-in-the-fridge@e2a30f4:docs/harness-requirements.md"
created: 2026-10-26
updated: 2026-10-26
---

# MCP-сервер бази знань

Компонент **harness**, а не застосунку: MCP-сервер `fridge-kb` (TypeScript, `@modelcontextprotocol/sdk`, транспорт stdio) у директорії `mcp-server/` репозиторію застосунку. Єдиний дозволений шлях доступу агента до цього vault (див. [[ADR-0005 Окремий репозиторій бази знань із доступом через MCP]]). Реалізовано в коміті 84a435b ([[feat(mcp-server) fridge-kb MCP connector to knowledge base vault]]); реєстрація в `.mcp.json` — у [[chore register fridge-kb and read-only GitHub MCP servers]], див. також [[Конфігурація agent harness]].

## Інструменти

| Інструмент | Призначення |
|---|---|
| `search_notes(query, type?, limit?)` | повнотекстовий пошук за назвою, `aliases`, тегами й текстом; викликається перед записом, щоб не створити дублікат |
| `get_note(id \| title)` | нотатка за `id` або точною назвою: frontmatter, текст, вихідні посилання й backlinks |
| `ingest_note(type, title, content, ...)` | створення або оновлення нотатки за [[Конвенції vault|конвенціями]] |
| `vault_status()` | поточний коміт, гілка, наявність незакомічених змін, кількість нотаток за типами |

## Цикл ingest_note

1. `git pull` клону vault.
2. Пошук нотатки за `id`, потім за назвою — запис ідемпотентний: повторний виклик з тими самими даними повертає `unchanged` без коміту.
3. Запис нотатки: валідація frontmatter, папка за типом, перевірка, що всі `[[посилання]]` вказують на наявні нотатки.
4. Оновлення MOC-Застосунок.
5. `git commit`.
6. `git push` у репозиторій vault.

Відповідь містить `status` (created / updated / unchanged), `id`, `commit` і `pushed`. Для завершених задач використовується `type: change` з `fields.commit` (id `change-<sha7>`). Інтеграційні тести покривають усі інструменти.
