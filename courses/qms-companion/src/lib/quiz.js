import { BANK } from '../data/bank';
import { QUIZ_KEY } from './constants';

export const QUIZ = { count: 20, threshold: 60, maxAttempts: 3, key: QUIZ_KEY };

export const SCORED = BANK.filter((q) => q.type !== 'Short answer');
export const WRITTEN = BANK.filter((q) => q.type === 'Short answer');

// Small seeded PRNG (mulberry32)
export function prng(seed) {
  let x = seed >>> 0;
  return () => {
    x += 0x6d2b79f5;
    let t = x;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffled(items, r) {
  const a = items.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const normal = (s) =>
  String(s || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/,/g, '.')
    .replace(/\s*%$/, '%');

export const fmt = (x) => (Math.round(x * 100) / 100).toString();

// ---- persisted attempt record ----
export function loadRecord() {
  try {
    const r = JSON.parse(localStorage.getItem(QUIZ.key) || 'null');
    if (r && typeof r.attempts === 'number')
      return {
        attempts: r.attempts,
        passed: !!r.passed,
        seen: Array.isArray(r.seen) ? r.seen : [],
        best: r.best || 0,
      };
  } catch (e) {}
  return { attempts: 0, passed: false, seen: [], best: 0 };
}

export function saveRecord(record) {
  try {
    localStorage.setItem(QUIZ.key, JSON.stringify(record));
  } catch (e) {}
}

export const attemptsLeft = (record) => Math.max(0, QUIZ.maxAttempts - record.attempts);

/**
 * Pick QUIZ.count questions: five per module, one per learning objective where
 * possible, preferring questions not seen in earlier attempts, never two from
 * the same `group`. Choices / matching options are shuffled per attempt.
 */
export function buildAttempt(record) {
  const r = prng(Math.floor(Math.random() * 4294967295));
  const seen = new Set(record.seen);
  const n = [0, 0, 0, 0];
  for (let i = 0; i < QUIZ.count; i++) n[i % 4]++;
  let picked = [];
  const usedGroups = new Set();
  [1, 2, 3, 4].forEach((m, mi) => {
    const los = shuffled([...new Set(SCORED.filter((q) => q.module === m).map((q) => q.objective))], r);
    const pools = {};
    los.forEach((lo) => {
      const all = shuffled(SCORED.filter((q) => q.objective === lo), r);
      pools[lo] = all.filter((q) => !seen.has(q.id)).concat(all.filter((q) => seen.has(q.id)));
    });
    for (let k = 0; k < n[mi]; k++) {
      const pool = pools[los[k % los.length]];
      let q = pool.shift();
      while (q && q.group && usedGroups.has(q.group)) q = pool.shift();
      if (q) {
        picked.push(q);
        if (q.group) usedGroups.add(q.group);
      }
    }
  });
  picked = shuffled(picked, r);
  const selected = picked.map((q) => {
    const o = { ...q };
    if (q.type === 'MCQ') o.choices = shuffled(Object.keys(q.options), r);
    if (q.type === 'True/False') o.choices = ['A', 'B'];
    if (q.type === 'Matching') o.rights = shuffled(q.pairs.map((p) => p[1]).concat(q.distractors || []), r);
    return o;
  });
  const nextRecord = {
    ...record,
    attempts: record.attempts + 1,
    seen: [...new Set(record.seen.concat(picked.map((q) => q.id)))],
  };
  return { selected, nextRecord };
}

export function isAnswered(q, v) {
  if (q.type === 'Matching') return !!v && Object.keys(v).length === q.pairs.length;
  return v !== undefined && String(v).trim() !== '';
}

export const answeredCount = (selected, responses) =>
  selected.filter((q, i) => isAnswered(q, responses[i])).length;

export function itemScore(q, v) {
  if (q.type === 'MCQ' || q.type === 'True/False') return v === q.answer ? 1 : 0;
  if (q.type === 'Fill-in-the-blank') return q.answers.some((a) => normal(a) === normal(v)) ? 1 : 0;
  if (q.type === 'Matching') {
    let ok = 0;
    q.pairs.forEach((p, j) => {
      if (v && v[j] !== undefined && q.rights[v[j]] === p[1]) ok++;
    });
    return ok / q.pairs.length;
  }
  return 0;
}

export function scoreAttempt(selected, responses, record) {
  let score = 0;
  const breakdown = {};
  const scored = selected.map((q, i) => {
    const s = itemScore(q, responses[i]);
    score += s;
    breakdown[q.module] = breakdown[q.module] || { total: 0, score: 0 };
    breakdown[q.module].total++;
    breakdown[q.module].score += s;
    return { ...q, earned: s };
  });
  const percent = (100 * score) / selected.length;
  const passed = percent >= QUIZ.threshold;
  return {
    selected: scored,
    result: { score, percent, passed, breakdown },
    record: {
      ...record,
      best: Math.max(record.best, percent),
      passed: record.passed || passed,
    },
  };
}
