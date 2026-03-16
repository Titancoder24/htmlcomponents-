/**
 * customize — Apply custom design tokens to a component.
 *
 * Merges custom token overrides with the base token system
 * and returns the component with the customized theme.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { registry } from "../registry.js";
import { compile } from "../compiler.js";
import { mergeTokens } from "../utils/merge-tokens.js";

export function registerCustomize(server: McpServer): void {
  server.tool(
    "customize",
    "Apply custom design tokens and fonts to a Voltz UI component. Returns the component with your custom theme applied.",
    {
      id: z.string().describe("Component ID to customize"),
      tokens: z
        .record(z.string(), z.string())
        .optional()
        .describe(
          "Design token overrides, e.g. { 'primary': '#6366f1', 'radius': '12px' }"
        ),
      font: z
        .object({
          heading: z.string().optional(),
          body: z.string().optional(),
        })
        .optional()
        .describe("Google Font overrides"),
      target: z
        .enum(["html", "react", "vue", "svelte", "web-component"])
        .default("html"),
      theme: z.enum(["light", "dark", "system"]).default("system"),
    },
    async ({ id, tokens, font, target, theme }) => {
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

      const baseTokens = registry.getBaseTokens();
      const resolvedTokens = tokens
        ? mergeTokens(baseTokens, tokens)
        : baseTokens;

      const output = await compile({
        component,
        target,
        variant: {},
        tokens: resolvedTokens,
        font: font ?? {},
        theme,
        includeTokens: true,
        minified: false,
      });

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                id: component.id,
                name: component.name,
                customized: true,
                tokensApplied: tokens
                  ? Object.keys(tokens).length
                  : 0,
                fontOverrides: font ?? null,
                target,
                theme,
                files: output.files.map((file) => ({
                  filename: file.filename,
                  language: file.language,
                  code: file.code,
                })),
                fontImports: output.fontImports,
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
