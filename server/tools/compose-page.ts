/**
 * compose_page — Assemble multiple components into a full page.
 *
 * Takes an array of section configurations and produces a
 * complete, production-ready page with shared tokens and fonts.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { composePage } from "../composer.js";

export function registerComposePage(server: McpServer): void {
  server.tool(
    "compose_page",
    "Assemble multiple Voltz UI components into a complete page. Returns production-ready HTML/CSS/JS.",
    {
      sections: z
        .array(
          z.object({
            component: z.string().describe("Component ID"),
            props: z
              .record(z.string(), z.any())
              .optional()
              .describe("Component props/variants"),
            tokens: z
              .record(z.string(), z.string())
              .optional()
              .describe("Per-section token overrides"),
          })
        )
        .describe("Array of page sections in order"),
      target: z
        .enum(["html", "react", "vue", "svelte", "web-component"])
        .default("html"),
      theme: z.enum(["light", "dark", "system"]).default("system"),
      font: z
        .object({
          heading: z.string().optional(),
          body: z.string().optional(),
        })
        .optional(),
      tokens: z
        .record(z.string(), z.string())
        .optional()
        .describe("Global design token overrides"),
      minified: z.boolean().default(false),
    },
    async ({ sections, target, theme, font, tokens, minified }) => {
      const output = await composePage({
        sections,
        target,
        theme,
        font,
        tokens,
        minified,
      });

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                sectionCount: output.sectionCount,
                fontImports: output.fontImports,
                totalSizeBytes: new TextEncoder().encode(
                  output.html
                ).length,
                html: output.html,
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
