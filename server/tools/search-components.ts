/**
 * @module tools/search-components
 * @description MCP tool definition for search_components. Accepts a query string,
 * optional category filter, result limit, and target framework. Returns
 * matching components with metadata sorted by relevance score.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { registry } from '../registry.js';

/**
 * Registers the search_components tool on the MCP server.
 */
export function registerSearchComponents(server: McpServer): void {
  server.tool(
    'search_components',
    'Search Voltz UI components by name, tag, or keyword. Returns matching components sorted by relevance.',
    {
      query: z
        .string()
        .describe('Search query: component name, tag, or keyword'),
      category: z
        .string()
        .optional()
        .describe('Filter by category: primitives, animated, backgrounds, typography, layout, navigation, data-display, marketing, application'),
      limit: z
        .number()
        .min(1)
        .max(50)
        .default(10)
        .describe('Maximum number of results to return'),
      target: z
        .enum(['html', 'react', 'vue', 'svelte', 'web-component'])
        .optional()
        .describe('Target framework for example code snippets'),
    },
    async ({ query, category, limit, target }) => {
      const results = registry.search(query, { category, limit });

      const formatted = results.map((component) => ({
        id: component.id,
        name: component.name,
        description: component.description,
        category: component.category,
        tags: component.tags,
        variants: component.variants,
        status: component.status,
        exampleUsage: target
          ? registry.getExampleSnippet(component.id, target)
          : undefined,
      }));

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              query,
              total: formatted.length,
              components: formatted,
            }, null, 2),
          },
        ],
      };
    }
  );
}
