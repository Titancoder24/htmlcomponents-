/**
 * @module merge-tokens
 * @description Deep merge utility for design token objects.
 * Merges an override token set onto a base token set, producing a new
 * combined object. Override values take precedence. Used when applying
 * custom theme tokens on top of the Voltz base token set.
 */

/**
 * Deep merges two flat design token objects.
 * Override values replace base values for matching keys.
 * Returns a new object without mutating either input.
 */
export function mergeTokens(
  base: Record<string, string>,
  overrides: Record<string, string>
): Record<string, string> {
  const merged: Record<string, string> = {};

  for (const key of Object.keys(base)) {
    merged[key] = base[key];
  }

  for (const key of Object.keys(overrides)) {
    if (overrides[key] !== undefined && overrides[key] !== '') {
      merged[key] = overrides[key];
    }
  }

  return merged;
}
