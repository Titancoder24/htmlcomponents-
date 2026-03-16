/**
 * @module security
 * @description Output sanitization and Content Security Policy header generation.
 * Provides HTML sanitization that strips dangerous elements and attributes
 * without using innerHTML or eval. Generates strict CSP headers for
 * embedding Voltz components in production environments.
 */

import { escapeHtml } from './utils/escape-html.js';

const DANGEROUS_TAG_PATTERN =
  /<\s*\/?\s*(script|iframe|object|embed|form|base|meta|link|applet)\b[^>]*>/gi;

const EVENT_HANDLER_PATTERN =
  /\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi;

const JAVASCRIPT_URI_PATTERN =
  /(?:href|src|action)\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*')/gi;

const DATA_URI_PATTERN =
  /(?:href|src)\s*=\s*(?:"data:[^"]*"|'data:[^']*')/gi;

/**
 * Removes dangerous HTML elements and attributes from output.
 * Strips script tags, event handlers, javascript: URIs, and data: URIs.
 */
export function sanitizeOutput(html: string): string {
  if (!html) {
    return '';
  }

  let sanitized = html;

  sanitized = sanitized.replace(DANGEROUS_TAG_PATTERN, '');
  sanitized = sanitized.replace(EVENT_HANDLER_PATTERN, '');
  sanitized = sanitized.replace(JAVASCRIPT_URI_PATTERN, '');
  sanitized = sanitized.replace(DATA_URI_PATTERN, '');

  return sanitized;
}

/**
 * Generates Content Security Policy header values for Voltz components.
 * Returns a strict CSP that allows inline styles (needed for tokens)
 * and Google Fonts, but blocks inline scripts and other unsafe sources.
 */
export function generateCSPHeaders(): Record<string, string> {
  const directives = [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self'",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
  ];

  return {
    'Content-Security-Policy': directives.join('; '),
  };
}

/**
 * Escapes a string for safe inclusion in an HTML attribute value.
 */
export function escapeAttribute(value: string): string {
  return escapeHtml(value);
}

/**
 * Validates that a URL is safe (no javascript: or data: protocol).
 */
export function isSafeUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  const trimmed = url.trim().toLowerCase();

  if (trimmed.startsWith('javascript:')) {
    return false;
  }

  if (trimmed.startsWith('data:')) {
    return false;
  }

  return true;
}
