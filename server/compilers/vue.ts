/**
 * @module compilers/vue
 * @description Compiles Voltz component templates to Vue 3 Single File Components
 * using the Composition API with <script setup>. Transforms template syntax
 * to Vue directives, generates typed props with defineProps, and produces
 * a complete .vue SFC with scoped styles.
 */

export interface VueCompilerInput {
  template: string;
  style: string;
  script: string;
  props: Record<string, string | boolean>;
  slots: Record<string, string>;
  componentName: string;
  customProperties: string[];
}

export interface VueCompilerOutput {
  sfc: string;
}

/**
 * Converts a component name to PascalCase for the Vue component.
 */
function toPascalCase(name: string): string {
  return name
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

/**
 * Generates the defineProps TypeScript type from component props.
 */
function generateDefineProps(
  props: Record<string, string | boolean>
): string {
  const entries = Object.entries(props).map(([key, value]) => {
    const type = typeof value === 'boolean' ? 'boolean' : 'string';
    return `  ${key}?: ${type};`;
  });

  return `defineProps<{\n${entries.join('\n')}\n}>()`;
}

/**
 * Converts Voltz template conditionals to Vue v-if directives.
 */
function convertConditionals(template: string): string {
  let result = template;

  result = result.replace(
    /\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g,
    (_m, key: string, content: string) => {
      const trimmed = content.trim();
      const tagMatch = trimmed.match(/^<(\w+)/);
      if (tagMatch) {
        return trimmed.replace(
          /^<(\w+)/,
          `<$1 v-if="${key}"`
        );
      }
      return `<template v-if="${key}">${trimmed}</template>`;
    }
  );

  return result;
}

/**
 * Converts Voltz slot placeholders to Vue slot syntax.
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
 * Converts Voltz prop placeholders to Vue binding syntax.
 */
function convertPropBindings(
  template: string,
  props: Record<string, string | boolean>
): string {
  return template.replace(
    /\{\{(\w+)\}\}/g,
    (_m, key: string) => {
      if (key in props) {
        return `{{ ${key} }}`;
      }
      return '';
    }
  );
}

/**
 * Compiles a Voltz component to a Vue 3 SFC with Composition API.
 */
export function compileVue(input: VueCompilerInput): VueCompilerOutput {
  const _pascalName = toPascalCase(input.componentName);

  let templateBody = input.template;
  templateBody = convertConditionals(templateBody);
  templateBody = convertSlots(templateBody);
  templateBody = convertPropBindings(templateBody, input.props);

  const definePropsCode = generateDefineProps(input.props);

  const sfc = [
    `<script setup lang="ts">`,
    `const props = ${definePropsCode};`,
    `</script>`,
    '',
    `<template>`,
    `  ${templateBody.trim()}`,
    `</template>`,
    '',
    `<style scoped>`,
    input.style,
    `</style>`,
    '',
  ].join('\n');

  return { sfc };
}
