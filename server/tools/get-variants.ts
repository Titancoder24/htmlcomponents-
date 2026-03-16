/**
 * get_variants — Get all variants of a specific component.
 *
 * Returns the full variant definitions including types,
 * possible values, defaults, and descriptions.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { registry } from "../registry.js";

export function registerGetVariants(server: McpServer): void {
  server.tool(
    "get_variants",
    "Get all variant definitions for a Voltz UI component. Returns types, possible values, and defaults.",
    {
      id: z.string().describe("Component ID, e.g. 'button', 'card'"),
    },
    async ({ id }) => {
      const component = registry.get(id);

      if (!component) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                error: "COMPONENT_NOT_FOUND",
                message: `No component found with ID "${id}".`,
              }),
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                id: component.id,
                name: component.name,
                variants: component.variants,
                slots: component.slots,
                examples: component.examples,
                accessibility: component.accessibility,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );
}
