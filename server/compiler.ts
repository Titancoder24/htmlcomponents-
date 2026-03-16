/**
 * @module compiler
 * @description Routes compilation requests to framework-specific compilers.
 * Takes a universal component template and produces output for the
 * specified target framework. Supports html, react, vue, svelte,
 * and web-component targets.
 */

import { registry, type ComponentMeta } from './registry.js';
import { resolveTokens } from './tokens.js';
import { compileHtml } from './compilers/html.js';
import { compileReact } from './compilers/react.js';
import { compileVue } from './compilers/vue.js';
import { compileSvelte } from './compilers/svelte.js';
import { compileWebComponent } from './compilers/web-component.js';
import { buildFontImportUrl } from './fonts.js';

export interface CompileOptions {
  componentId: string;
  target: string;
  variants?: Record<string, string>;
  tokenOverrides?: Record<string, string>;
  font?: string;
  theme?: string;
  slots?: Record<string, string>;
}

export interface CompilerOutputFile {
  filename: string;
  language: string;
  code: string;
}

export interface CompilerOutput {
  files: CompilerOutputFile[];
  fontImports: string[];
  usageExample: string;
}

const VALID_TARGETS = ['html', 'react', 'vue', 'svelte', 'web-component'];

/** Build the props map from component meta and variant overrides */
function buildProps(
  meta: ComponentMeta,
  variants?: Record<string, string>
): Record<string, string | boolean> {
  const props: Record<string, string | boolean> = {};

  if (meta.props) {
    for (const [key, def] of Object.entries(meta.props)) {
      const propDef = def as Record<string, unknown>;
      props[key] = (propDef.default as string | boolean) ?? '';
    }
  }

  if (variants) {
    for (const [key, value] of Object.entries(variants)) {
      props[key] = value;
    }
  }

  return props;
}

/** Compile for the html target */
function compileForHtml(
  meta: ComponentMeta,
  props: Record<string, string | boolean>,
  slots: Record<string, string>,
  tokens: Record<string, string>
): CompilerOutputFile[] {
  const template = registry.getTemplate(meta.id) ?? '';
  const style = registry.getStyle(meta.id) ?? '';
  const script = registry.getScript(meta.id) ?? '';

  const result = compileHtml({
    template, style, script, props, slots, tokens,
    componentName: meta.name,
  });

  return [
    { filename: `${meta.id}.html`, language: 'html', code: result.combined },
  ];
}

/** Compile for the react target */
function compileForReact(
  meta: ComponentMeta,
  props: Record<string, string | boolean>,
  slots: Record<string, string>
): CompilerOutputFile[] {
  const template = registry.getTemplate(meta.id) ?? '';
  const style = registry.getStyle(meta.id) ?? '';

  const result = compileReact({
    template, style, script: '', props, slots,
    componentName: meta.name,
    customProperties: meta.customProperties ?? [],
  });

  return [
    { filename: `${meta.id}.tsx`, language: 'tsx', code: result.jsx },
    { filename: `${meta.id}.css`, language: 'css', code: result.css },
  ];
}

/** Compile for the vue target */
function compileForVue(
  meta: ComponentMeta,
  props: Record<string, string | boolean>,
  slots: Record<string, string>
): CompilerOutputFile[] {
  const template = registry.getTemplate(meta.id) ?? '';
  const style = registry.getStyle(meta.id) ?? '';

  const result = compileVue({
    template, style, script: '', props, slots,
    componentName: meta.name,
    customProperties: meta.customProperties ?? [],
  });

  return [
    { filename: `${meta.id}.vue`, language: 'vue', code: result.sfc },
  ];
}

/** Compile for the svelte target */
function compileForSvelte(
  meta: ComponentMeta,
  props: Record<string, string | boolean>,
  slots: Record<string, string>
): CompilerOutputFile[] {
  const template = registry.getTemplate(meta.id) ?? '';
  const style = registry.getStyle(meta.id) ?? '';

  const result = compileSvelte({
    template, style, script: '', props, slots,
    componentName: meta.name,
    customProperties: meta.customProperties ?? [],
  });

  return [
    { filename: `${meta.id}.svelte`, language: 'svelte', code: result.component },
  ];
}

/** Compile for the web-component target */
function compileForWebComponent(
  meta: ComponentMeta,
  props: Record<string, string | boolean>,
  slots: Record<string, string>
): CompilerOutputFile[] {
  const template = registry.getTemplate(meta.id) ?? '';
  const style = registry.getStyle(meta.id) ?? '';

  const result = compileWebComponent({
    template, style, script: '', props, slots,
    componentName: meta.name,
    customProperties: meta.customProperties ?? [],
  });

  return [
    { filename: `${meta.id}.js`, language: 'javascript', code: result.js },
  ];
}

/**
 * Compile a component to the specified target framework.
 * Returns compiled files, font imports, and a usage example.
 */
export async function compile(
  options: CompileOptions
): Promise<CompilerOutput> {
  const { componentId, target } = options;

  if (!VALID_TARGETS.includes(target)) {
    throw new Error(
      `Unknown target "${target}". Valid: ${VALID_TARGETS.join(', ')}`
    );
  }

  const meta = registry.get(componentId);
  if (!meta) {
    throw new Error(`Component "${componentId}" not found`);
  }

  const props = buildProps(meta, options.variants);
  const slots = options.slots ?? { default: meta.name };
  const tokens = resolveTokens(options.tokenOverrides, options.theme);
  const fontImports = options.font
    ? [buildFontImportUrl([options.font])].filter(Boolean)
    : [];

  let files: CompilerOutputFile[];

  switch (target) {
    case 'html':
      files = compileForHtml(meta, props, slots, tokens);
      break;
    case 'react':
      files = compileForReact(meta, props, slots);
      break;
    case 'vue':
      files = compileForVue(meta, props, slots);
      break;
    case 'svelte':
      files = compileForSvelte(meta, props, slots);
      break;
    case 'web-component':
      files = compileForWebComponent(meta, props, slots);
      break;
    default:
      throw new Error(`Unknown target: ${target}`);
  }

  const usageExample = registry.getExampleSnippet(
    componentId,
    target
  ) ?? '';

  return { files, fontImports, usageExample };
}
