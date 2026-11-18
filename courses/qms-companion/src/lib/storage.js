import { DRAFTS_KEY, PROGRESS_KEY } from './constants';

// ---- written-answer drafts (textareas / inputs with data-answer) ----
let drafts = (() => {
  try {
    return JSON.parse(localStorage.getItem(DRAFTS_KEY) || '{}') || {};
  } catch (e) {
    return {};
  }
})();

export const getDraft = (id) => drafts[id] || '';

export function saveDraft(id, value) {
  drafts[id] = value;
  try {
    localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
  } catch (e) {}
}

// ---- module progress ----
export function loadProgress() {
  try {
    const p = JSON.parse(localStorage.getItem(PROGRESS_KEY) || 'null');
    if (p && p.done) return p;
  } catch (e) {}
  return { done: {}, last: null };
}

export function saveProgress(progress) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (e) {}
}
