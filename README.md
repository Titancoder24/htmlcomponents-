# Voltz UI

**MCP-native, framework-agnostic UI component library.**

200 production-grade components. Zero dependencies. Works with Claude, GPT, Gemini, and any MCP-compatible AI agent.

## Quick Start

### As an MCP Server

Add to your Claude Desktop or Cursor config:

```json
{
  "mcpServers": {
    "voltz-ui": {
      "command": "npx",
      "args": ["tsx", "server/index.ts"],
      "cwd": "/path/to/voltz-ui"
    }
  }
}
```

### Direct Usage

Every component is a self-contained set of files you can copy directly:

```
components/{category}/{component}/
  ├── meta.json       # Metadata, variants, accessibility info
  ├── template.html   # Universal HTML template
  ├── style.css       # Component styles (CSS custom properties)
  └── script.js       # Optional interaction logic
```

## MCP Tools

| Tool | Description |
|------|-------------|
| `search_components` | Search by natural language query |
| `get_component` | Fetch component compiled to target framework |
| `list_categories` | Browse all component categories |
| `get_variants` | Get all variants for a component |
| `compose_page` | Assemble multiple components into a page |
| `get_fonts` | Browse Google Font pairings |
| `get_animations` | Browse animation presets |
| `customize` | Apply custom design tokens |

## Target Frameworks

- **HTML + CSS + JS** — Vanilla, works everywhere
- **React + Tailwind** — JSX functional components
- **Vue 3 + Tailwind** — SFCs with Composition API
- **Svelte** — Native Svelte components
- **Web Components** — Custom Elements with Shadow DOM

## Component Categories

| Category | Count | Description |
|----------|-------|-------------|
| Primitives | 40 | Button, input, dialog, tabs, accordion, etc. |
| Typography | 15 | Heading, paragraph, blockquote, callout, etc. |
| Layout | 15 | Grid, flex, stack, bento-grid, dashboard-shell, etc. |
| Animated | 35 | Text-reveal, marquee, shimmer-button, particles, etc. |
| Backgrounds | 15 | Aurora, dot-grid, mesh-gradient, star-field, etc. |
| Navigation | 15 | Navbar, sidebar, command-palette, stepper, etc. |
| Data Display | 20 | Table, stat-card, timeline, pricing-card, etc. |
| Marketing | 30 | Hero sections, CTAs, testimonials, footers, etc. |
| Application | 15 | Dashboard, settings, chat, notifications, etc. |

## Design Tokens

All components use CSS custom properties prefixed with `--voltz-`:

```css
--voltz-color-primary-500: #6366f1;
--voltz-font-size-base: 1rem;
--voltz-spacing-4: 16px;
--voltz-radius-md: 6px;
--voltz-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
```

Override any token to re-theme the entire library.

## Principles

- **Zero dependencies** — No npm packages at runtime
- **LLM-readable** — Every file understandable by humans and AI
- **Production-grade** — Accessible, responsive, dark mode, RTL, reduced motion
- **Security-first** — No innerHTML, no eval, CSP-compatible
- **Performance** — CSS < 45KB gzip, JS < 15KB gzip, compositor-only animations

## Development

```bash
npm install          # Install dev dependencies only
npm run dev          # Start MCP server
npm run build        # Build production bundles
npm run validate     # Validate all component metadata
npm run test         # Run test suite
npm run lint         # Lint all components
```

## License

MIT
