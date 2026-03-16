/**
 * @module escape-html
 * @description HTML entity escaping utility for safe string interpolation.
 * Prevents XSS by encoding the five dangerous HTML characters: &, <, >, ", '.
 * Used throughout the compiler pipeline to sanitize user-provided content
 * before embedding it in HTML output.
 */

const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

const HTML_ESCAPE_PATTERN = /[&<>"']/g;

/**
 * Escapes HTML special characters in a string to their entity equivalents.
 * Returns empty string for falsy inputs.
 */
export function escapeHtml(input: string): string {
  if (!input) {
    return '';
  }

  return input.replace(
    HTML_ESCAPE_PATTERN,
    (char) => HTML_ESCAPE_MAP[char] ?? char
  );
}
