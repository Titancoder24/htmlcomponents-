/**
 * get_animations — Browse animation presets.
 *
 * Returns available animation presets filtered by category
 * (entrances, exits, emphasis, transitions).
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

const ANIMATIONS_DIR = resolve(
  new URL(".", import.meta.url).pathname,
  "../../animations"
);

interface AnimationPreset {
  name: string;
  category: string;
  cssClass: string;
  duration: string;
  easing: string;
  description: string;
}

/** Load animation presets from presets.json */
function loadPresets(): AnimationPreset[] {
  const presetsPath = resolve(ANIMATIONS_DIR, "presets.json");
  if (!existsSync(presetsPath)) return [];
  const raw = readFileSync(presetsPath, "utf-8");
  const data = JSON.parse(raw);
  return data.presets ?? [];
}

export function registerGetAnimations(server: McpServer): void {
  server.tool(
    "get_animations",
    "Browse Voltz UI animation presets. Returns CSS animation classes and configurations.",
    {
      category: z
        .enum(["entrances", "exits", "emphasis", "transitions", "all"])
        .default("all")
        .describe("Animation category to browse"),
    },
    async ({ category }) => {
      const presets = loadPresets();

      const filtered =
        category === "all"
          ? presets
          : presets.filter((p) => p.category === category);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                category,
                totalPresets: filtered.length,
                presets: filtered,
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
