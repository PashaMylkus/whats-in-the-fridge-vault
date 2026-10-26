---
id: component-harness-config
type: component
title: Конфігурація agent harness
aliases: [.claude, CLAUDE.md, harness config]
tags: [component, layer/harness]
status: planned
layer: harness
path: .claude
requirements: []
implements: []
depends_on: ["[[MCP-сервер бази знань]]"]
source: "whats-in-the-fridge@e2a30f4:docs/harness-requirements.md"
created: 2026-10-26
updated: 2026-10-26
---

# Конфігурація agent harness

Компонент **harness** у репозиторії застосунку: усе, що визначає поведінку агента Claude Code (див. [[ADR-0004 Claude Code як агентна IDE]]).

| Файл / директорія | Призначення | ПР |
|---|---|---|
| `CLAUDE.md` | проєктні інструкції й конвенції для агента | 3–5 |
| `.mcp.json` | реєстрація [[MCP-сервер бази знань|MCP-сервера fridge-kb]] | 3 |
| `.claude/settings.json` | `permissions.allow / ask / deny` і hooks — [[Guardrail|guardrails]] | 4 |
| `.claude/hooks/` | скрипти `PreToolUse` / `PostToolUse`, журнал `.claude/logs/` | 4 |
| `.claude/skills/` | [[Skill|skills]]: scaffold-module, generate-tests, review-code, sync-docs, triage-failures | 5 |
| `.claude/agents/` | subagents: planner, implementer, tester, reviewer | 6 |

Зміна цих файлів агентом заборонена (block) — їх редагує лише розробник.
