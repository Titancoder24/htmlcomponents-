/**
 * get_component — Fetch a single component compiled to the target framework.
 *
 * This is the primary tool agents use to get production-ready component code.
 * It compiles the universal template into the specified framework format.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { registry } from "../registry.js";
import { compile } from "../compiler.js";
import { mergeTokens } from "../utils/merge-tokens.js";

export function registerGetComponent(server: McpServer): void {
  server.tool(
    "get_component",
    "Get the full source code of a Voltz UI component compiled to your target framework.",
    {
      id: z.string().describe("Component ID, e.g. 'button', 'hero-gradient'"),
      target: z
        .enum(["html", "react", "vue", "svelte", "web-component"])
        .default("html")
        .describe("Target framework"),
      variant: z
        .record(z.string(), z.any())
        .optional()
        .describe("Variant overrides, e.g. { variant: 'outline', size: 'lg' }"),
      tokens: z
        .record(z.string(), z.string())
        .optional()
        .describe("Design token overrides"),
      font: z
        .object({
          heading: z.string().optional(),
          body: z.string().optional(),
        })
        .optional()
        .describe("Google Font selections"),
      theme: z.enum(["light", "dark", "system"]).default("system"),
      includeTokens: z.boolean().default(true),
      minified: z.boolean().default(false),
    },
    async ({ id, target, variant, tokens, font, theme, includeTokens, minified }) => {
      const component = registry.get(id);

      if (!component) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                error: "COMPONENT_NOT_FOUND",
                message: `No component found with ID "${id}".`,
                suggestion: `Try search_components({ query: "${id}" })`,
              }),
            },
          ],
        };
      }

      const resolvedTokens = tokens
        ? mergeTokens(registry.getBaseTokens(), tokens)
        : registry.getBaseTokens();

      const output = await compile({
        component,
        target,
        variant: variant ?? {},
        tokens: resolvedTokens,
        font: font ?? {},
        theme,
        includeTokens,
        minified,
      });

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
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
                totalSizeBytes: output.files.reduce(
                  (sum, f) =>
                    sum + new TextEncoder().encode(f.code).length,
                  0
                ),
                usage: output.usageExample,
                notes: component.accessibility,
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
