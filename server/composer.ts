/**
 * @module composer
 * @description Page composition engine for Voltz UI. Assembles multiple
 * components into a complete HTML page with shared design tokens,
 * font imports, and section ordering. Used by the compose_page tool.
 */

import { registry } from './registry.js';
import { compile, type CompilerOutput } from './compiler.js';
import { mergeTokens } from './utils/merge-tokens.js';
import { escapeHtml } from './utils/escape-html.js';

export interface PageSection {
  component: string;
  props?: Record<string, unknown>;
  slots?: Record<string, string>;
  tokens?: Record<string, string>;
}

export interface ComposeOptions {
  sections: PageSection[];
  target: string;
  theme: string;
  font?: { heading?: string; body?: string };
  tokens?: Record<string, string>;
}

export interface PageOutput {
  html: string;
  css: string;
  js: string;
  fontImports: string[];
  sectionCount: number;
}

/** Build font link tags for Google Fonts */
function buildFontLinks(fonts: string[]): string {
  const unique = [...new Set(fonts)].filter(Boolean);
  return unique
    .map((font) => {
      const family = font.replace(/\s+/g, '+');
      const pre = '<link rel="preconnect" href="https://fonts.googleapis.com">';
      const gstatic = '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>';
      const css = `<link href="https://fonts.googleapis.com/css2?family=${escapeHtml(family)}:wght@300;400;500;600;700&display=swap" rel="stylesheet">`;
      return `${pre}\n${gstatic}\n${css}`;
    })
    .join('\n');
}

/**
 * Compose a full page from multiple component sections.
 */
export async function composePage(
  options: ComposeOptions
): Promise<PageOutput> {
  const baseTokens = registry.getBaseTokens();
  const resolvedTokens = options.tokens
    ? mergeTokens(baseTokens, options.tokens)
    : baseTokens;

  const allFontImports: string[] = [];
  const allCss: string[] = [];
  const allJs: string[] = [];
  const allHtml: string[] = [];

  for (const section of options.sections) {
    const component = registry.get(section.component);
    if (!component) continue;

    const sectionTokens = section.tokens
      ? mergeTokens(resolvedTokens, section.tokens)
      : resolvedTokens;

    const variantOverrides: Record<string, string> = {};
    if (section.props) {
      for (const [k, v] of Object.entries(section.props)) {
        variantOverrides[k] = String(v);
      }
    }

    const output: CompilerOutput = await compile({
      componentId: component.id,
      target: options.target,
      variants: variantOverrides,
      tokenOverrides: sectionTokens,
      slots: section.slots,
      font: options.font?.heading,
      theme: options.theme,
    });

    allFontImports.push(...output.fontImports);

    for (const file of output.files) {
      if (file.language === 'css') allCss.push(file.code);
      else if (file.language === 'javascript') allJs.push(file.code);
      else if (file.language === 'html') allHtml.push(file.code);
    }
  }

  const fontLinks = buildFontLinks(allFontImports);
  const combinedCss = allCss.join('\n\n');
  const combinedJs = allJs.join('\n\n');

  const html = `<!DOCTYPE html>
<html lang="en" data-theme="${escapeHtml(options.theme)}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Voltz UI Page</title>
  ${fontLinks}
  <style>${combinedCss}</style>
</head>
<body>
  ${allHtml.join('\n\n  ')}
  ${combinedJs ? `<script>${combinedJs}</script>` : ''}
</body>
</html>`;

  return {
    html,
    css: combinedCss,
    js: combinedJs,
    fontImports: [...new Set(allFontImports)],
    sectionCount: options.sections.length,
  };
}
