---
id: change-84a435b
type: change
title: Реалізація MCP-сервера fridge-kb
aliases: []
tags: [change]
status: done
kind: feature
date: 2026-10-26
commit: 84a435b
pr: null
affects: ["[[MCP-сервер бази знань]]"]
source: "whats-in-the-fridge@84a435b:"
created: 2026-10-26
updated: 2026-10-26
---

# Реалізація MCP-сервера fridge-kb

Реалізовано MCP-сервер `fridge-kb` — [[MCP-сервер бази знань]], єдиний шлях доступу агента до vault згідно з [[ADR-0005 Окремий репозиторій бази знань із доступом через MCP]].

Інструменти: `ingest_note`, `get_note`, `search_notes`, `vault_status`. Додано інтеграційні тести сервера.
