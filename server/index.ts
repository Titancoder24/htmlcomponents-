/**
 * Voltz UI — MCP Server Entry Point
 *
 * This file registers all MCP tools that AI agents use to
 * discover, fetch, customize, and compose UI components.
 *
 * The server exposes 8 tools:
 *   1. search_components  — Semantic search across all components
 *   2. get_component      — Fetch a single component in any target framework
 *   3. list_categories    — Browse all available categories
 *   4. get_variants       — Get all variants of a specific component
 *   5. compose_page       — Assemble multiple components into a full page
 *   6. get_fonts          — Browse and search Google Font pairings
 *   7. get_animations     — Browse animation presets
 *   8. customize          — Apply custom design tokens to a component
 *
 * Zero external dependencies. All compilation happens in-process.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerSearchComponents } from "./tools/search-components.js";
import { registerGetComponent } from "./tools/get-component.js";
import { registerListCategories } from "./tools/list-categories.js";
import { registerGetVariants } from "./tools/get-variants.js";
import { registerComposePage } from "./tools/compose-page.js";
import { registerGetFonts } from "./tools/get-fonts.js";
import { registerGetAnimations } from "./tools/get-animations.js";
import { registerCustomize } from "./tools/customize.js";

async function main(): Promise<void> {
  const server = new McpServer({
    name: "voltz-ui",
    version: "1.0.0",
    description:
      "Production-grade UI component library. 200 components, framework-agnostic, accessible, animated. Search, fetch, customize, and compose.",
  });

  /* Register every MCP tool */
  registerSearchComponents(server);
  registerGetComponent(server);
  registerListCategories(server);
  registerGetVariants(server);
  registerComposePage(server);
  registerGetFonts(server);
  registerGetAnimations(server);
  registerCustomize(server);

  /* Connect via stdio transport (works with Claude, Cursor, etc.) */
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error: Error) => {
  console.error("Failed to start Voltz UI MCP server:", error.message);
  process.exit(1);
});
