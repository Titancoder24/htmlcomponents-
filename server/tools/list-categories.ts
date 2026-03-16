/**
 * @module tools/list-categories
 * @description MCP tool definition for list_categories. Returns all available
 * component categories with component counts and descriptions.
 * No input parameters required.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registry } from '../registry.js';

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  primitives: 'Core building blocks: buttons, inputs, dialogs, tabs, and more.',
  animated: 'Magic UI style animated components: text reveals, particles, shimmer effects.',
  backgrounds: 'Animated and static background patterns: aurora, gradients, particles.',
  typography: 'Text rendering components: headings, blockquotes, callouts, lists.',
  layout: 'Structural components: grids, stacks, containers, dashboard shells.',
  navigation: 'Navigation patterns: navbars, sidebars, mega menus, breadcrumbs.',
  'data-display': 'Data presentation: tables, data tables.',
  marketing: 'Landing page sections: heroes, CTAs, testimonials, pricing.',
  application: 'Dashboard and SaaS patterns: headers, settings, notifications.',
};

/**
 * Registers the list_categories tool on the MCP server.
 */
export function registerListCategories(server: McpServer): void {
  server.tool(
    'list_categories',
    'Browse all available Voltz UI component categories with component counts.',
    {},
    async () => {
      const categories = registry.getCategories();

      const result = categories.map((cat) => ({
        name: cat.name,
        count: cat.count,
        description: CATEGORY_DESCRIPTIONS[cat.name] ?? '',
      }));

      const totalComponents = categories.reduce(
        (sum, c) => sum + c.count,
        0
      );

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(
              { totalComponents, categories: result },
              null,
              2
            ),
          },
        ],
      };
    }
  );
}
