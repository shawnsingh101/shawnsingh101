import { cardsForNode, GROUPS, nodeId, SECTIONS, shuffle, type Group, type Topic } from './cards';
import type { QuizSpec } from './components/Study';
import type { Dataset } from './types';

/** A quiz scope: the whole world, a section ("Europe", "Oceans & Seas", "China") or one group. */
export type Scope = 'world' | `sec:${string}` | `grp:${string}`;

export function scopeGroups(scope: Scope): Group[] {
  if (scope === 'world') return GROUPS.filter(g => g.layer === 'country');
  if (scope.startsWith('sec:')) return GROUPS.filter(g => g.section === scope.slice(4));
  return GROUPS.filter(g => g.id === scope.slice(4));
}

export function scopeName(scope: Scope) {
  if (scope === 'world') return 'World';
  if (scope === 'sec:Oceans & Seas') return 'All oceans & seas';
  if (scope.startsWith('sec:')) return scope.slice(4);
  return GROUPS.find(g => g.id === scope.slice(4))!.name;
}

/** Topics on offer for a scope, with the names used in that scope. */
export function scopeTopics(scope: Scope) {
  const seen = new Map<Topic, string>();
  for (const g of scopeGroups(scope)) for (const t of g.topics) if (!seen.has(t.id)) seen.set(t.id, t.id === 'places' && g.layer === 'water' ? 'Oceans & seas' : t.name);
  return [...seen].map(([id, name]) => ({ id, name }));
}

export function quizPool(ds: Dataset, scope: Scope, topics: Topic[]) {
  return scopeGroups(scope).flatMap(g => g.topics.filter(t => topics.includes(t.id)).flatMap(t => cardsForNode(ds, nodeId(g.id, t.id))));
}

export const quizKey = (scope: Scope, topics: Topic[]) => `${scope}|${[...topics].sort().join('+')}`;

export function quizTitle(scope: Scope, topics: Topic[]) {
  const names = scopeTopics(scope).filter(t => topics.includes(t.id)).map(t => t.name.toLowerCase());
  const list = names.length > 1 ? names.slice(0, -1).join(', ') + ' & ' + names[names.length - 1] : names[0];
  const name = scopeName(scope);
  return name.toLowerCase().includes(list) || list === 'oceans & seas' && scope.startsWith('grp:w-') ? name : `${name}: ${list}`;
}

export function makeQuiz(ds: Dataset, scope: Scope, topics: Topic[], length: number | 'all'): QuizSpec {
  return {
    key: quizKey(scope, topics), title: quizTitle(scope, topics),
    draw: () => { const pool = shuffle(quizPool(ds, scope, topics)); return length === 'all' ? pool : pool.slice(0, length); },
  };
}

export const ALL_SCOPES: Scope[] = ['world', ...SECTIONS.map(s => `sec:${s}` as Scope), ...GROUPS.map(g => `grp:${g.id}` as Scope)];
