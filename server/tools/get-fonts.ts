/**
 * get_fonts — Browse and search Google Font pairings.
 *
 * Returns curated font pairings filtered by mood or search query.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  searchFonts,
  getPairings,
  getFontCategories,
} from "../fonts.js";

export function registerGetFonts(server: McpServer): void {
  server.tool(
    "get_fonts",
    "Browse Google Font pairings and search fonts. Returns curated heading + body pairings by mood.",
    {
      query: z
        .string()
        .optional()
        .describe("Search fonts by name, e.g. 'Inter' or 'serif'"),
      mood: z
        .string()
        .optional()
        .describe(
          "Filter pairings by mood: clean, elegant, technical, bold, minimal, creative, editorial, professional, luxury, friendly, geometric, playful, futuristic, accessible, warm, neutral"
        ),
      includeCategories: z
        .boolean()
        .default(false)
        .describe("Include font category listings"),
    },
    async ({ query, mood, includeCategories }) => {
      const result: Record<string, unknown> = {};

      if (query) {
        result.searchResults = searchFonts(query);
      }

      result.pairings = getPairings(mood);

      if (includeCategories) {
        result.categories = getFontCategories();
      }

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }
  );
}
