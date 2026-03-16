/**
 * search_components — Search Voltz UI components by natural language query.
 *
 * Accepts a query like "animated hero with particles" and returns
 * the top matching components with metadata and previews.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { registry } from "../registry.js";

export function registerSearchComponents(server: McpServer): void {
  server.tool(
    "search_components",
    "Search Voltz UI components by natural language query. Returns matching components with metadata, variant info, and example usage.",
    {
      query: z
        .string()
        .describe(
          "Natural language search query, e.g. 'animated pricing table' or 'dark mode sidebar'"
        ),
      category: z
        .string()
        .optional()
        .describe(
          "Filter by category: primitives, animated, backgrounds, typography, layout, navigation, data-display, marketing, application"
        ),
      limit: z
        .number()
        .min(1)
        .max(50)
        .default(10)
        .describe("Maximum number of results to return"),
      target: z
        .enum(["html", "react", "vue", "svelte", "web-component"])
        .optional()
        .describe("Target framework for example code snippets"),
    },
    async ({ query, category, limit, target }) => {
      const results = registry.search(query, { category, limit });

      const formattedResults = results.map((component) => ({
        id: component.id,
        name: component.name,
        description: component.description,
        category: component.category,
        tags: component.tags,
        variantCount: Object.keys(component.variants).length,
        variants: Object.fromEntries(
          Object.entries(component.variants).map(([key, config]) => [
            key,
            {
              type: config.type,
              values: config.values,
              default: config.default,
            },
          ])
        ),
        hasAnimation:
          component.category === "animated" ||
          component.tags.includes("animated"),
        hasJavaScript:
          component.dependencies?.js ||
          component.dependencies?.jsInteractive,
        relatedComponents: component.relatedComponents,
        exampleUsage: target
          ? registry.getExampleSnippet(component.id, target)
          : undefined,
        score: component._searchScore,
      }));

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                query,
                totalResults: formattedResults.length,
                components: formattedResults,
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
