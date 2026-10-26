#!/usr/bin/env node
// Перевірка vault: frontmatter за конвенціями, розв'язність wiki-посилань,
// досяжність усіх нотаток із MOC-Застосунок, відсутність сиріт.
// Використання: node tools/validate-vault.mjs [--graph graph.json]
// Без залежностей; Node.js >= 18.
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ROOT_MOC = 'MOC-Застосунок';
const IGNORE_DIRS = new Set(['.git', '.obsidian', 'tools', 'Templates', 'node_modules']);
const IGNORE_FILES = new Set(['README.md']);

const COMMON = ['id', 'type', 'title', 'aliases', 'tags', 'status', 'source', 'created', 'updated'];
const SCHEMA = {
  concept:   { folder: 'Concepts',   fields: ['requirements'], status: ['active', 'deprecated'] },
  component: { folder: 'Components', fields: ['layer', 'path', 'implements', 'depends_on'], status: ['planned', 'in-progress', 'implemented', 'deprecated'] },
  decision:  { folder: 'Decisions',  fields: ['adr', 'date', 'deciders', 'supersedes'], status: ['proposed', 'accepted', 'superseded', 'deprecated'] },
  glossary:  { folder: 'Glossary',   fields: ['term_en'], status: ['active', 'deprecated'] },
  change:    { folder: 'Changes',    fields: ['kind', 'date', 'commit', 'pr', 'affects'], status: ['done'] },
  moc:       { folder: '',           fields: [], status: ['active'] },
  guide:     { folder: '',           fields: [], status: ['active'] },
};
const LAYERS = ['web', 'api', 'shared', 'db', 'harness'];
const KINDS = ['feature', 'fix', 'docs', 'refactor', 'test', 'chore'];

// ---------- мінімальний парсер YAML-frontmatter (key: scalar | [flow, list]) ----------
function parseScalar(s) {
  s = s.trim();
  if (s === 'null' || s === '~' || s === '') return null;
  if (/^-?\d+$/.test(s)) return Number(s);
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) return s.slice(1, -1).replace(/\\"/g, '"');
  return s;
}
function splitFlow(inner) {
  const out = []; let cur = ''; let q = null;
  for (const ch of inner) {
    if (q) { cur += ch; if (ch === q) q = null; continue; }
    if (ch === '"' || ch === "'") { q = ch; cur += ch; continue; }
    if (ch === ',') { out.push(cur); cur = ''; continue; }
    cur += ch;
  }
  if (cur.trim()) out.push(cur);
  return out.map(parseScalar);
}
function parseFrontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return { fm: null, body: text };
  const fm = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!kv) continue;
    const v = kv[2].trim();
    fm[kv[1]] = v.startsWith('[') && v.endsWith(']') ? splitFlow(v.slice(1, -1)) : parseScalar(v);
  }
  return { fm, body: text.slice(m[0].length) };
}

// ---------- посилання (без блоків коду та inline-коду) ----------
const LINK_RE = /\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|[^\]]*)?\]\]/g;
function extractLinks(body, fm) {
  const clean = body.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');
  const fmText = Object.values(fm || {}).flat().filter((v) => typeof v === 'string').join(' ');
  return [...(clean + ' ' + fmText).matchAll(LINK_RE)].map((m) => m[1].trim());
}

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return IGNORE_DIRS.has(name) ? [] : walk(p);
    return name.endsWith('.md') && !IGNORE_FILES.has(name) ? [p] : [];
  });
}

// ---------- перевірки ----------
const errors = [];
const warn = [];
const notes = new Map(); // name -> {path, fm, links}
for (const path of walk(ROOT)) {
  const name = basename(path, '.md');
  const rel = relative(ROOT, path);
  const folder = dirname(rel) === '.' ? '' : dirname(rel);
  const { fm, body } = parseFrontmatter(readFileSync(path, 'utf8'));
  if (!fm) { errors.push(`${rel}: немає frontmatter`); continue; }
  const sch = SCHEMA[fm.type];
  if (!sch) { errors.push(`${rel}: невідомий type "${fm.type}"`); continue; }
  for (const f of [...COMMON, ...sch.fields]) if (!(f in fm)) errors.push(`${rel}: відсутнє поле "${f}"`);
  if (sch.folder !== folder) errors.push(`${rel}: type "${fm.type}" має лежати в "${sch.folder || 'корені'}"`);
  if (!sch.status.includes(fm.status)) errors.push(`${rel}: недопустимий status "${fm.status}"`);
  if (fm.title !== name) errors.push(`${rel}: title "${fm.title}" ≠ назва файлу`);
  if (!/^[a-z]+-[a-z0-9-]+$/.test(String(fm.id))) errors.push(`${rel}: id "${fm.id}" не відповідає шаблону <type>-<slug>`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(fm.created)) || !/^\d{4}-\d{2}-\d{2}$/.test(String(fm.updated))) errors.push(`${rel}: дати created/updated не у форматі YYYY-MM-DD`);
  if (fm.type === 'component' && !LAYERS.includes(fm.layer)) errors.push(`${rel}: недопустимий layer "${fm.layer}"`);
  if (fm.type === 'change' && !KINDS.includes(fm.kind)) errors.push(`${rel}: недопустимий kind "${fm.kind}"`);
  if (fm.type === 'decision' && !name.startsWith(`ADR-${String(fm.adr).padStart(4, '0')} `)) errors.push(`${rel}: назва не відповідає номеру adr`);
  if (!/^[\w.-]+@[0-9a-f]{7,40}:/.test(String(fm.source))) warn.push(`${rel}: source без коміту`);
  if (notes.has(name)) errors.push(`${rel}: дубль назви файлу "${name}"`);
  notes.set(name, { rel, fm, links: extractLinks(body, fm) });
}

const ids = new Map();
for (const [name, n] of notes) {
  if (ids.has(n.fm.id)) errors.push(`${n.rel}: дубль id "${n.fm.id}" (також ${ids.get(n.fm.id)})`);
  ids.set(n.fm.id, n.rel);
}

const lower = new Map([...notes.keys()].map((k) => [k.toLowerCase(), k]));
const edges = [];
for (const [name, n] of notes) {
  for (const target of n.links) {
    const t = notes.has(target) ? target : lower.get(target.toLowerCase());
    if (!t) errors.push(`${n.rel}: нерозв'язне посилання [[${target}]]`);
    else if (t !== name) edges.push([name, t]);
  }
}
const uniq = [...new Map(edges.map((e) => [e.join('→'), e])).values()];

// досяжність з кореневої MOC (за вихідними посиланнями)
const out = new Map([...notes.keys()].map((k) => [k, new Set()]));
const inc = new Map([...notes.keys()].map((k) => [k, new Set()]));
for (const [a, b] of uniq) { out.get(a).add(b); inc.get(b).add(a); }
const seen = new Set([ROOT_MOC]); const queue = [ROOT_MOC]; const depth = { [ROOT_MOC]: 0 };
if (!notes.has(ROOT_MOC)) errors.push(`немає кореневої нотатки ${ROOT_MOC}`);
while (queue.length) {
  const x = queue.shift();
  for (const y of out.get(x) || []) if (!seen.has(y)) { seen.add(y); depth[y] = depth[x] + 1; queue.push(y); }
}
const unreachable = [...notes.keys()].filter((k) => !seen.has(k));
const orphans = [...notes.keys()].filter((k) => k !== ROOT_MOC && inc.get(k).size === 0);
for (const u of unreachable) errors.push(`${notes.get(u).rel}: недосяжна з ${ROOT_MOC}`);
for (const o of orphans) errors.push(`${notes.get(o).rel}: сирота (немає вхідних посилань)`);
const direct = [...notes.keys()].filter((k) => k !== ROOT_MOC && out.get(ROOT_MOC).has(k)).length;

// ---------- звіт ----------
const byType = {};
for (const n of notes.values()) byType[n.fm.type] = (byType[n.fm.type] || 0) + 1;
const degree = [...notes.keys()].map((k) => [k, out.get(k).size + inc.get(k).size]).sort((a, b) => b[1] - a[1]);
console.log(`Vault: ${ROOT}`);
console.log(`Нотаток: ${notes.size}  (${Object.entries(byType).map(([t, c]) => `${t}: ${c}`).join(', ')})`);
console.log(`Унікальних зв'язків: ${uniq.length}, середній ступінь вузла: ${(2 * uniq.length / notes.size).toFixed(1)}`);
console.log(`Досяжні з ${ROOT_MOC}: ${seen.size}/${notes.size} (напряму: ${direct}, макс. глибина: ${Math.max(...Object.values(depth))})`);
console.log(`Сироти: ${orphans.length}, нерозв'язні посилання: ${errors.filter((e) => e.includes("нерозв'язне")).length}`);
console.log(`Найзв'язніші: ${degree.slice(0, 5).map(([k, d]) => `${k} (${d})`).join(', ')}`);
for (const w of warn) console.log(`WARN  ${w}`);
for (const e of errors) console.log(`ERROR ${e}`);
console.log(errors.length ? `\n✗ Помилок: ${errors.length}` : '\n✓ Vault валідний');

const gi = process.argv.indexOf('--graph');
if (gi > 0) {
  const nodes = [...notes].map(([name, n]) => ({ id: name, type: n.fm.type, degree: out.get(name).size + inc.get(name).size }));
  writeFileSync(process.argv[gi + 1], JSON.stringify({ nodes, links: uniq.map(([source, target]) => ({ source, target })) }, null, 1));
}
process.exit(errors.length ? 1 : 0);
