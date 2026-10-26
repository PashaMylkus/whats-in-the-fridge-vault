---
id: adr-0004
type: decision
title: ADR-0004 Claude Code як агентна IDE
aliases: [ADR-0004, Claude Code]
tags: [decision, adr]
status: accepted
adr: 4
date: 2026-10-26
deciders: [Милькус Павло]
supersedes: null
applies_to: ["[[Конфігурація agent harness]]"]
source: "whats-in-the-fridge@e2a30f4:docs/harness-requirements.md"
created: 2026-10-26
updated: 2026-10-26
---

# ADR-0004. Claude Code як агентна IDE

## Контекст

Курс вимагає агентну IDE з підтримкою MCP-серверів, bash-команд, проєктних інструкцій і hooks. Вибір фіксується до кінця курсу.

## Рішення

Claude Code (CLI + розширення VS Code). Конфігурація harness зберігається в репозиторії застосунку (див. [[Конфігурація agent harness]]).

## Розглянуті альтернативи

- Cursor — порівнянні можливості (hooks, правила, MCP); прийнятна альтернатива.
- GitHub Copilot — hooks задокументовані для cloud agent і Copilot CLI.

## Наслідки

- (+) `permissions.allow / ask / deny` прямо відповідають рівням [[Guardrail|guardrails]] allow / warn / block.
- (+) Нативні [[Skill|skills]] і subagents для ПР № 5–6.
- (−) Конфігурація прив'язана до формату Claude Code.
