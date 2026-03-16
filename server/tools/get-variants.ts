/**
 * @module tools/get-variants
 * @description MCP tool definition for get_variants. Takes a component ID
 * and returns all variant definitions including types, possible values,
 * defaults, and descriptions. Useful for discovering customization options.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { registry } from '../registry.js';

/**
 * Extracts variant information from component props.
 */
function extractVariants(
  props: Record<string, unknown> | undefined
): Record<string, unknown>[] {
  if (!props) return [];

  return Object.entries(props).map(([name, def]) => {
    const propDef = def as Record<string, unknown>;
    return {
      name,
      type: propDef.type ?? 'string',
      options: propDef.options ?? [],
      default: propDef.default ?? null,
      description: propDef.description ?? '',
    };
  });
}

/**
 * Registers the get_variants tool on the MCP server.
 */
export function registerGetVariants(server: McpServer): void {
  server.tool(
    'get_variants',
    'Get all variant definitions for a Voltz UI component. Returns types, possible values, and defaults.',
    {
      id: z.string().describe('Component ID, e.g. "button", "input", "navbar"'),
    },
    async ({ id }) => {
      const component = registry.get(id);

      if (!component) {
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify({
                error: 'COMPONENT_NOT_FOUND',
                message: `No component found with ID "${id}".`,
              }),
            },
          ],
        };
      }

      const variants = extractVariants(component.props);

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              id: component.id,
              name: component.name,
              variants,
              variantNames: component.variants,
              slots: component.slots ?? {},
              customProperties: component.customProperties ?? [],
              examples: component.examples ?? [],
            }, null, 2),
          },
        ],
      };
    }
  );
}
