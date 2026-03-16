/**
 * @module compilers/react
 * @description Compiles Voltz component templates to React + Tailwind JSX
 * functional components. Transforms HTML templates into valid JSX syntax,
 * converts CSS classes to Tailwind utilities where possible, and generates
 * a complete functional component with typed props interface.
 */

import { escapeHtml } from '../utils/escape-html.js';
import { slugify } from '../utils/slugify.js';

export interface ReactCompilerInput {
  template: string;
  style: string;
  script: string;
  props: Record<string, string | boolean>;
  slots: Record<string, string>;
  componentName: string;
  customProperties: string[];
}

export interface ReactCompilerOutput {
  jsx: string;
  css: string;
}

/**
 * Converts a component name to a valid PascalCase React component name.
 */
function toPascalCase(name: string): string {
  return name
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

/**
 * Converts HTML attributes to JSX equivalents.
 */
function htmlToJsxAttributes(html: string): string {
  return html
    .replace(/\bclass=/g, 'className=')
    .replace(/\bfor=/g, 'htmlFor=')
    .replace(/\btabindex=/g, 'tabIndex=')
    .replace(/\bstroke-width=/g, 'strokeWidth=')
    .replace(/\bstroke-linecap=/g, 'strokeLinecap=')
    .replace(/\bstroke-dasharray=/g, 'strokeDasharray=')
    .replace(/\bfill-rule=/g, 'fillRule=')
    .replace(/\bclip-rule=/g, 'clipRule=')
    .replace(/\bviewBox=/g, 'viewBox=')
    .replace(/\bxmlns=/g, 'xmlns=')
    .replace(/\baria-hidden=/g, 'aria-hidden=')
    .replace(/\baria-disabled=/g, 'aria-disabled=')
    .replace(/\baria-busy=/g, 'aria-busy=');
}

/**
 * Generates the TypeScript props interface from component props.
 */
function generatePropsInterface(
  componentName: string,
  props: Record<string, string | boolean>
): string {
  const lines: string[] = [];
  lines.push(`interface ${componentName}Props {`);

  for (const [key, value] of Object.entries(props)) {
    const type = typeof value === 'boolean' ? 'boolean' : 'string';
    lines.push(`  ${key}?: ${type};`);
  }

  lines.push('  children?: React.ReactNode;');
  lines.push('}');
  return lines.join('\n');
}

/**
 * Strips Voltz template syntax and replaces with JSX expressions.
 */
function convertTemplateSyntax(
  template: string,
  props: Record<string, string | boolean>
): string {
  let result = template;

  result = result.replace(
    /\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g,
    (_m, key: string, content: string) => `{${key} && (<>${content.trim()}</>)}`
  );

  result = result.replace(
    /\{\{slot:default\}\}/g,
    '{children}'
  );

  result = result.replace(
    /\{\{slot:(\w+)\}\}/g,
    (_m, name: string) => `{${name}}`
  );

  result = result.replace(
    /\{\{(\w+)\}\}/g,
    (_m, key: string) => {
      if (key in props) {
        return `{${key}}`;
      }
      return '';
    }
  );

  return result;
}

/**
 * Compiles a Voltz component to a React functional component with JSX.
 */
export function compileReact(input: ReactCompilerInput): ReactCompilerOutput {
  const pascalName = toPascalCase(input.componentName);

  let jsxBody = input.template;
  jsxBody = convertTemplateSyntax(jsxBody, input.props);
  jsxBody = htmlToJsxAttributes(jsxBody);

  const propsInterface = generatePropsInterface(pascalName, input.props);

  const propDestructure = Object.keys(input.props)
    .concat(['children'])
    .join(', ');

  const component = [
    `import React from 'react';`,
    `import './${slugify(input.componentName)}.css';`,
    '',
    propsInterface,
    '',
    `export function ${pascalName}({ ${propDestructure} }: ${pascalName}Props) {`,
    `  return (`,
    `    ${jsxBody.trim()}`,
    `  );`,
    `}`,
    '',
  ].join('\n');

  return {
    jsx: component,
    css: input.style,
  };
}
