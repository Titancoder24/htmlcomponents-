/**
 * @module slugify
 * @description Converts arbitrary strings to URL-safe slugs.
 * Lowercases, replaces whitespace with hyphens, strips special characters,
 * and collapses consecutive hyphens. Used for generating component IDs,
 * CSS class names, and URL paths from display names.
 */

/**
 * Converts a string to a URL-safe slug.
 * Lowercase, hyphens for spaces, no special characters.
 */
export function slugify(input: string): string {
  if (!input) {
    return '';
  }

  return input
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
