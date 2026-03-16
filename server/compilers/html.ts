/**
 * @module compilers/html
 * @description Compiles universal Voltz component templates to vanilla HTML + CSS + JS.
 * Processes {{variant}} placeholders, resolves {{#if}} conditional blocks,
 * fills {{slot:name}} placeholders with provided content, and bundles
 * the component's style.css and script.js alongside the markup.
 */

import { escapeHtml } from '../utils/escape-html.js';

export interface HtmlCompilerInput {
  template: string;
  style: string;
  script: string;
  props: Record<string, string | boolean>;
  slots: Record<string, string>;
  tokens: Record<string, string>;
  componentName: string;
}

export interface HtmlCompilerOutput {
  html: string;
  css: string;
  js: string;
  combined: string;
}

/**
 * Replaces {{propName}} placeholders with escaped prop values.
 */
function replacePropPlaceholders(
  template: string,
  props: Record<string, string | boolean>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_match, key: string) => {
    const value = props[key];
    if (value === undefined) {
      return '';
    }
    return escapeHtml(String(value));
  });
}

/**
 * Resolves {{#if prop}}...{{/if}} conditional blocks.
 */
function resolveConditionals(
  template: string,
  props: Record<string, string | boolean>
): string {
  const pattern = /\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g;

  return template.replace(pattern, (_match, key: string, content: string) => {
    const value = props[key];
    const isTruthy = value !== undefined
      && value !== false
      && value !== ''
      && value !== 'false';
    return isTruthy ? content : '';
  });
}

/**
 * Fills {{slot:name}} placeholders with provided slot content.
 */
function fillSlots(
  template: string,
  slots: Record<string, string>
): string {
  return template.replace(
    /\{\{slot:(\w+)\}\}/g,
    (_match, name: string) => escapeHtml(slots[name] ?? '')
  );
}

/**
 * Builds CSS custom property declarations from token map.
 */
function buildTokenStyles(tokens: Record<string, string>): string {
  const entries = Object.entries(tokens);
  if (entries.length === 0) {
    return '';
  }

  const declarations = entries
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n');

  return `:root {\n${declarations}\n}`;
}

/**
 * Assembles the combined single-file HTML output.
 */
function buildCombinedOutput(
  html: string,
  css: string,
  js: string,
  componentName: string
): string {
  const parts: string[] = [
    `<!-- Voltz UI: ${escapeHtml(componentName)} -->`,
  ];

  if (css) {
    parts.push(`<style>\n${css}\n</style>`);
  }

  parts.push(html);

  if (js) {
    parts.push(`<script>\n${js}\n</script>`);
  }

  return parts.join('\n\n');
}

/**
 * Compiles a Voltz component template to vanilla HTML + CSS + JS.
 */
export function compileHtml(input: HtmlCompilerInput): HtmlCompilerOutput {
  let processed = input.template;

  processed = resolveConditionals(processed, input.props);
  processed = replacePropPlaceholders(processed, input.props);
  processed = fillSlots(processed, input.slots);

  const tokenCss = buildTokenStyles(input.tokens);
  const fullCss = tokenCss
    ? `${tokenCss}\n\n${input.style}`
    : input.style;

  const combined = buildCombinedOutput(
    processed,
    fullCss,
    input.script,
    input.componentName
  );

  return {
    html: processed,
    css: fullCss,
    js: input.script,
    combined,
  };
}
