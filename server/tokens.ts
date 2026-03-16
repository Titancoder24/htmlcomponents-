/**
 * @module tokens
 * @description Token management for the Voltz design system.
 * Reads base CSS custom properties from tokens/base.css, parses them
 * into a key-value map, and supports merging custom overrides on top.
 * Provides the token pipeline used by all compilers.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { mergeTokens } from './utils/merge-tokens.js';

const TOKEN_PROPERTY_PATTERN = /^\s*(--[\w-]+)\s*:\s*(.+?)\s*;/;

/**
 * Parses CSS custom properties from a CSS file string.
 * Extracts --variable: value pairs from :root blocks.
 */
function parseCssTokens(css: string): Record<string, string> {
  const tokens: Record<string, string> = {};
  const lines = css.split('\n');

  for (const line of lines) {
    const match = line.match(TOKEN_PROPERTY_PATTERN);
    if (match) {
      tokens[match[1]] = match[2];
    }
  }

  return tokens;
}

/**
 * Reads and parses the base.css token file from disk.
 * Returns a flat map of CSS custom property names to values.
 */
export function getBaseTokens(): Record<string, string> {
  const basePath = resolve(
    process.cwd(),
    'tokens',
    'base.css'
  );

  try {
    const css = readFileSync(basePath, 'utf-8');
    return parseCssTokens(css);
  } catch {
    return {};
  }
}

/**
 * Reads and parses a theme CSS file (light or dark).
 */
export function getThemeTokens(theme: string): Record<string, string> {
  const themePath = resolve(
    process.cwd(),
    'tokens',
    'themes',
    `${theme}.css`
  );

  try {
    const css = readFileSync(themePath, 'utf-8');
    return parseCssTokens(css);
  } catch {
    return {};
  }
}

/**
 * Resolves final token set by merging base tokens with optional
 * theme tokens and custom overrides. Override precedence:
 * base < theme < custom overrides.
 */
export function resolveTokens(
  overrides: Record<string, string> = {},
  theme?: string
): Record<string, string> {
  let tokens = getBaseTokens();

  if (theme) {
    const themeTokens = getThemeTokens(theme);
    tokens = mergeTokens(tokens, themeTokens);
  }

  if (Object.keys(overrides).length > 0) {
    tokens = mergeTokens(tokens, overrides);
  }

  return tokens;
}

/**
 * Formats a token map back into CSS custom property declarations.
 */
export function tokensToCSS(tokens: Record<string, string>): string {
  const declarations = Object.entries(tokens)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n');

  return `:root {\n${declarations}\n}`;
}
