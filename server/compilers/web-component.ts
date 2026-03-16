/**
 * @module compilers/web-component
 * @description Compiles Voltz component templates to Custom Elements with Shadow DOM.
 * Produces a self-contained Web Component class that encapsulates styles
 * in Shadow DOM, defines observed attributes from props, and uses
 * a template element for efficient rendering.
 */

import { escapeHtml } from '../utils/escape-html.js';

export interface WebComponentCompilerInput {
  template: string;
  style: string;
  script: string;
  props: Record<string, string | boolean>;
  slots: Record<string, string>;
  componentName: string;
  customProperties: string[];
}

export interface WebComponentCompilerOutput {
  js: string;
}

/**
 * Converts component name to a valid custom element tag (must contain hyphen).
 */
function toTagName(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return slug.includes('-') ? `voltz-${slug}` : `voltz-${slug}`;
}

/**
 * Converts a component name to a valid PascalCase class name.
 */
function toClassName(name: string): string {
  return 'Voltz' + name
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

/**
 * Generates the observedAttributes static getter.
 */
function generateObservedAttributes(
  props: Record<string, string | boolean>
): string {
  const attrs = Object.keys(props)
    .map((key) => `'${key}'`)
    .join(', ');

  return `  static get observedAttributes() {\n    return [${attrs}];\n  }`;
}

/**
 * Converts Voltz template slots to native Shadow DOM slots.
 */
function convertToShadowSlots(template: string): string {
  let result = template;

  result = result.replace(
    /\{\{slot:default\}\}/g,
    '<slot></slot>'
  );

  result = result.replace(
    /\{\{slot:(\w+)\}\}/g,
    (_m, name: string) => `<slot name="${escapeHtml(name)}"></slot>`
  );

  return result;
}

/**
 * Strips Voltz conditional and prop syntax for static template.
 */
function stripTemplateSyntax(template: string): string {
  let result = template;

  result = result.replace(
    /\{\{#if\s+\w+\}\}([\s\S]*?)\{\{\/if\}\}/g,
    (_m, content: string) => content
  );

  result = result.replace(/\{\{\w+\}\}/g, '');

  return result;
}

/**
 * Generates the attributeChangedCallback method body.
 */
function generateAttributeHandler(
  props: Record<string, string | boolean>
): string {
  const cases = Object.keys(props).map((key) =>
    `      case '${key}':\n        this._props['${key}'] = newValue;\n        break;`
  );

  return [
    `  attributeChangedCallback(name, _oldValue, newValue) {`,
    `    switch (name) {`,
    ...cases,
    `    }`,
    `    this._render();`,
    `  }`,
  ].join('\n');
}

/**
 * Compiles a Voltz component to a Custom Element with Shadow DOM.
 */
export function compileWebComponent(
  input: WebComponentCompilerInput
): WebComponentCompilerOutput {
  const tagName = toTagName(input.componentName);
  const className = toClassName(input.componentName);

  let templateHtml = input.template;
  templateHtml = convertToShadowSlots(templateHtml);
  templateHtml = stripTemplateSyntax(templateHtml);

  const observedAttrs = generateObservedAttributes(input.props);
  const attrHandler = generateAttributeHandler(input.props);

  const js = [
    `class ${className} extends HTMLElement {`,
    observedAttrs,
    '',
    `  constructor() {`,
    `    super();`,
    `    this._props = {};`,
    `    this.attachShadow({ mode: 'open' });`,
    `  }`,
    '',
    `  connectedCallback() {`,
    `    this._render();`,
    `  }`,
    '',
    attrHandler,
    '',
    `  _render() {`,
    `    const style = document.createElement('style');`,
    `    style.textContent = \`${input.style}\`;`,
    `    const template = document.createElement('template');`,
    `    template.innerHTML = \`${templateHtml.trim()}\`;`,
    `    this.shadowRoot.replaceChildren(`,
    `      style,`,
    `      template.content.cloneNode(true)`,
    `    );`,
    `  }`,
    `}`,
    '',
    `customElements.define('${tagName}', ${className});`,
    '',
  ].join('\n');

  return { js };
}
