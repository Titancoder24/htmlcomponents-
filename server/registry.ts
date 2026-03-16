/**
 * @module registry
 * @description Component registry for the Voltz design system.
 * Reads all meta.json files from the components/ directory tree, builds
 * a searchable in-memory index. Single source of truth for component
 * metadata at runtime. Provides lookup by ID, category, and search query.
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { searchComponents } from './search.js';
import { getBaseTokens } from './tokens.js';

/** Metadata shape for a single component */
export interface ComponentMeta {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  version: string;
  status: string;
  variants: string[];
  props?: Record<string, unknown>;
  slots?: Record<string, unknown>;
  events?: Record<string, unknown>;
  customProperties?: string[];
  dependencies?: string[];
  examples?: Array<Record<string, unknown>>;
  _dir?: string;
}

export interface VariantDef {
  type: string;
  values?: string[];
  default: unknown;
  description: string;
}

interface SearchOptions {
  category?: string;
  limit?: number;
}

const COMPONENTS_DIR = resolve(
  new URL('.', import.meta.url).pathname,
  '../components'
);

const CATEGORIES = [
  'primitives',
  'animated',
  'backgrounds',
  'typography',
  'layout',
  'navigation',
  'data-display',
  'marketing',
  'application',
];

/** Load all component meta.json files into memory */
function loadAllComponents(): ComponentMeta[] {
  const components: ComponentMeta[] = [];

  for (const category of CATEGORIES) {
    const categoryDir = join(COMPONENTS_DIR, category);
    if (!existsSync(categoryDir)) continue;

    const componentDirs = readdirSync(categoryDir, { withFileTypes: true });
    for (const entry of componentDirs) {
      if (!entry.isDirectory()) continue;
      const metaPath = join(categoryDir, entry.name, 'meta.json');
      if (!existsSync(metaPath)) continue;

      try {
        const raw = readFileSync(metaPath, 'utf-8');
        const meta = JSON.parse(raw);
        meta.id = meta.name ?? entry.name;
        meta.tags = meta.tags ?? [];
        meta.variants = meta.variants ?? [];
        meta.customProperties = meta.customProperties ?? [];
        meta.dependencies = meta.dependencies ?? [];
        meta._dir = join(categoryDir, entry.name);
        components.push(meta as ComponentMeta);
      } catch {
        /* skip malformed meta.json files */
      }
    }
  }

  return components;
}

/** Read a component file (template, style, script) */
function readComponentFile(
  componentDir: string,
  filename: string
): string | null {
  const filePath = join(componentDir, filename);
  if (!existsSync(filePath)) return null;
  return readFileSync(filePath, 'utf-8');
}

/** Generate a usage snippet for the given target framework */
function generateExampleSnippet(
  meta: ComponentMeta,
  target: string
): string {
  const example = meta.examples?.[0];
  const content = (example as Record<string, unknown>)?.content ?? 'Content';

  if (target === 'react') {
    const tag = meta.name.replace(/\s+/g, '');
    return `<${tag}>${String(content)}</${tag}>`;
  }

  if (target === 'vue') {
    const tag = `Voltz${meta.name.replace(/\s+/g, '')}`;
    return `<${tag}>${String(content)}</${tag}>`;
  }

  const cssClass = `voltz-${meta.id}`;
  return `<div class="${cssClass}">${String(content)}</div>`;
}

class ComponentRegistry {
  private components: ComponentMeta[] = [];
  private indexById: Map<string, ComponentMeta> = new Map();

  constructor() {
    this.components = loadAllComponents();
    for (const component of this.components) {
      this.indexById.set(component.id, component);
    }
  }

  /** Search components by query string */
  search(query: string, options: SearchOptions = {}): ComponentMeta[] {
    return searchComponents(query, this.components, options);
  }

  /** Get a single component by ID */
  get(id: string): ComponentMeta | undefined {
    return this.indexById.get(id);
  }

  /** Get all components */
  getAll(): ComponentMeta[] {
    return this.components;
  }

  /** Get components by category */
  getByCategory(category: string): ComponentMeta[] {
    return this.components.filter((c) => c.category === category);
  }

  /** Get base design tokens */
  getBaseTokens(): Record<string, string> {
    return getBaseTokens();
  }

  /** Get example code snippet */
  getExampleSnippet(id: string, target: string): string | undefined {
    const meta = this.indexById.get(id);
    if (!meta) return undefined;
    return generateExampleSnippet(meta, target);
  }

  /** Read a component's template file */
  getTemplate(id: string): string | null {
    const meta = this.indexById.get(id);
    if (!meta?._dir) return null;
    return readComponentFile(meta._dir, 'template.html');
  }

  /** Read a component's style file */
  getStyle(id: string): string | null {
    const meta = this.indexById.get(id);
    if (!meta?._dir) return null;
    return readComponentFile(meta._dir, 'style.css');
  }

  /** Read a component's script file */
  getScript(id: string): string | null {
    const meta = this.indexById.get(id);
    if (!meta?._dir) return null;
    return readComponentFile(meta._dir, 'script.js');
  }

  /** Get all category names with counts */
  getCategories(): Array<{ name: string; count: number }> {
    const counts = new Map<string, number>();
    for (const c of this.components) {
      counts.set(c.category, (counts.get(c.category) ?? 0) + 1);
    }
    return CATEGORIES.map((name) => ({
      name,
      count: counts.get(name) ?? 0,
    }));
  }
}

export const registry = new ComponentRegistry();
