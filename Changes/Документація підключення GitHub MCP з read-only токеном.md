---
id: change-5593a4d
type: change
title: Документація підключення GitHub MCP з read-only токеном
aliases: []
tags: [change]
status: done
kind: docs
date: 2026-10-26
commit: 5593a4d
pr: null
affects: ["[[MCP-сервер бази знань]]", "[[Конфігурація agent harness]]"]
source: "whats-in-the-fridge@5593a4d:mcp-server/README.md"
created: 2026-10-26
updated: 2026-10-26
---

# Документація підключення GitHub MCP з read-only токеном

У `mcp-server/README.md` додано розділ «Другий конектор: GitHub MCP (джерело даних)». Він описує офіційний віддалений GitHub MCP-сервер (`https://api.githubcopilot.com/mcp/`), зареєстрований у `.mcp.json` (див. [[Конфігурація agent harness]]) в режимі лише читання: заголовки `X-MCP-Readonly: true` і `X-MCP-Toolsets: repos,pull_requests`.

Токен — fine-grained PAT з доступом лише до репозиторію `whats-in-the-fridge`: Contents, Pull requests і Metadata у режимі read-only, строк дії 30 днів. Токен не зберігається в репозиторії: `.mcp.json` бере його зі змінної середовища `GITHUB_PAT`.

Також описано перевірку: схвалити сервери `fridge-kb` і `github`, переконатися через `/mcp`, що обидва підключені, і дати агенту наскрізну задачу. Агент читає коміти через GitHub і фіксує їх як change-нотатки через [[MCP-сервер бази знань]].

## Зв'язки

- [[MCP]]
- [[Guardrail]]
