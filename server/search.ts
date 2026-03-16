/**
 * @module search
 * @description Search engine for Voltz component registry. Implements a
 * multi-signal scoring system combining exact ID match (highest weight),
 * tag match (weighted), name fuzzy match, and description keyword match.
 * Supports category filtering and configurable result limits.
 */

export interface ComponentEntry {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  variants: string[];
  status: string;
}

export interface SearchOptions {
  category?: string;
  limit?: number;
  target?: string;
}

interface ScoredEntry {
  entry: ComponentEntry;
  score: number;
}

const SCORE_EXACT_ID = 100;
const SCORE_TAG_MATCH = 30;
const SCORE_NAME_STARTS_WITH = 25;
const SCORE_NAME_CONTAINS = 15;
const SCORE_DESCRIPTION_KEYWORD = 5;
const DEFAULT_LIMIT = 10;

/**
 * Scores a component entry against a single query term.
 */
function scoreEntry(entry: ComponentEntry, term: string): number {
  let score = 0;
  const lowerTerm = term.toLowerCase();

  if (entry.id.toLowerCase() === lowerTerm) {
    score += SCORE_EXACT_ID;
  }

  for (const tag of entry.tags) {
    if (tag.toLowerCase() === lowerTerm) {
      score += SCORE_TAG_MATCH;
    }
  }

  const lowerName = entry.name.toLowerCase();
  if (lowerName.startsWith(lowerTerm)) {
    score += SCORE_NAME_STARTS_WITH;
  } else if (lowerName.includes(lowerTerm)) {
    score += SCORE_NAME_CONTAINS;
  }

  if (entry.description.toLowerCase().includes(lowerTerm)) {
    score += SCORE_DESCRIPTION_KEYWORD;
  }

  return score;
}

/**
 * Scores a component entry against all query terms.
 */
function scoreEntryAllTerms(
  entry: ComponentEntry,
  terms: string[]
): number {
  let total = 0;
  for (const term of terms) {
    total += scoreEntry(entry, term);
  }
  return total;
}

/**
 * Filters entries by category if specified.
 */
function filterByCategory(
  entries: ComponentEntry[],
  category?: string
): ComponentEntry[] {
  if (!category) {
    return entries;
  }
  const lower = category.toLowerCase();
  return entries.filter(
    (e) => e.category.toLowerCase() === lower
  );
}

/**
 * Searches components by query string with scoring and ranking.
 * Returns matches sorted by relevance score, highest first.
 */
export function searchComponents(
  query: string,
  components: ComponentEntry[],
  options: SearchOptions = {}
): ComponentEntry[] {
  const limit = options.limit ?? DEFAULT_LIMIT;
  const filtered = filterByCategory(components, options.category);

  if (!query || query.trim() === '') {
    return filtered.slice(0, limit);
  }

  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 0);

  const scored: ScoredEntry[] = filtered
    .map((entry) => ({
      entry,
      score: scoreEntryAllTerms(entry, terms),
    }))
    .filter((s) => s.score > 0);

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((s) => s.entry);
}
