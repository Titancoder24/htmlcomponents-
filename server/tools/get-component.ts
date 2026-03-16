/**
 * @module tools/get-component
 * @description MCP tool definition for get_component. Fetches a single component
 * by ID, compiles it for the specified target framework, and returns
 * the compiled code files along with font imports and usage example.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { registry } from '../registry.js';
import { compile } from '../compiler.js';

/**
 * Registers the get_component tool on the MCP server.
 */
export function registerGetComponent(server: McpServer): void {
  server.tool(
    'get_component',
    'Get the full source code of a Voltz UI component compiled to your target framework.',
    {
      id: z.string().describe('Component ID, e.g. "button", "navbar", "hero-centered"'),
      target: z
        .enum(['html', 'react', 'vue', 'svelte', 'web-component'])
        .default('html')
        .describe('Target framework'),
      variant: z
        .record(z.string(), z.string())
        .optional()
        .describe('Variant overrides, e.g. { "variant": "outline", "size": "lg" }'),
      tokens: z
        .record(z.string(), z.string())
        .optional()
        .describe('Design token overrides as CSS custom properties'),
      font: z
        .string()
        .optional()
        .describe('Google Font family name'),
      theme: z
        .enum(['light', 'dark', 'system'])
        .default('light')
        .describe('Theme: light, dark, or system'),
    },
    async ({ id, target, variant, tokens, font, theme }) => {
      const component = registry.get(id);

      if (!component) {
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify({
                error: 'COMPONENT_NOT_FOUND',
                message: `No component found with ID "${id}".`,
                suggestion: `Try search_components({ query: "${id}" })`,
              }),
            },
          ],
        };
      }

      try {
        const output = await compile({
          componentId: id,
          target,
          variants: variant,
          tokenOverrides: tokens,
          font,
          theme,
        });

        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify({
                id: component.id,
                name: component.name,
                target,
                theme,
                files: output.files.map((file) => ({
                  filename: file.filename,
                  language: file.language,
                  code: file.code,
                })),
                fontImports: output.fontImports,
                usage: output.usageExample,
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            { type: 'text' as const, text: `Error: ${message}` },
          ],
          isError: true,
        };
      }
    }
  );
}
