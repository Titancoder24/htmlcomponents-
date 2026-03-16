/**
 * @module compilers/svelte
 * @description Compiles Voltz component templates to Svelte components.
 * Transforms template syntax to Svelte's native {#if} blocks and
 * <slot> elements, generates typed export let props, and produces
 * a complete .svelte component file with scoped styles.
 */

export interface SvelteCompilerInput {
  template: string;
  style: string;
  script: string;
  props: Record<string, string | boolean>;
  slots: Record<string, string>;
  componentName: string;
  customProperties: string[];
}

export interface SvelteCompilerOutput {
  component: string;
}

/**
 * Generates Svelte export let declarations from component props.
 */
function generatePropDeclarations(
  props: Record<string, string | boolean>
): string {
  return Object.entries(props)
    .map(([key, value]) => {
      if (typeof value === 'boolean') {
        return `  export let ${key}: boolean = ${value};`;
      }
      return `  export let ${key}: string = '${value}';`;
    })
    .join('\n');
}

/**
 * Converts Voltz {{#if}} blocks to Svelte {#if} blocks.
 */
function convertConditionals(template: string): string {
  let result = template;

  result = result.replace(
    /\{\{#if\s+(\w+)\}\}/g,
    (_m, key: string) => `{#if ${key}}`
  );

  result = result.replace(/\{\{\/if\}\}/g, '{/if}');

  return result;
}

/**
 * Converts Voltz slot placeholders to Svelte slot syntax.
 */
function convertSlots(template: string): string {
  let result = template;

  result = result.replace(
    /\{\{slot:default\}\}/g,
    '<slot />'
  );

  result = result.replace(
    /\{\{slot:(\w+)\}\}/g,
    (_m, name: string) => `<slot name="${name}" />`
  );

  return result;
}

/**
 * Converts Voltz prop placeholders to Svelte expression syntax.
 */
function convertPropBindings(
  template: string,
  props: Record<string, string | boolean>
): string {
  return template.replace(
    /\{\{(\w+)\}\}/g,
    (_m, key: string) => {
      if (key in props) {
        return `{${key}}`;
      }
      return '';
    }
  );
}

/**
 * Compiles a Voltz component to a Svelte component.
 */
export function compileSvelte(input: SvelteCompilerInput): SvelteCompilerOutput {
  let templateBody = input.template;
  templateBody = convertConditionals(templateBody);
  templateBody = convertSlots(templateBody);
  templateBody = convertPropBindings(templateBody, input.props);

  const propDeclarations = generatePropDeclarations(input.props);

  const component = [
    `<script lang="ts">`,
    propDeclarations,
    `</script>`,
    '',
    templateBody.trim(),
    '',
    `<style>`,
    input.style,
    `</style>`,
    '',
  ].join('\n');

  return { component };
}
