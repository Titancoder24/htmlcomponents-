/**
 * @module fonts
 * @description Google Fonts registry and pairing engine for Voltz UI.
 * Maintains a curated list of popular Google Fonts organized by category,
 * provides search functionality, and recommends font pairings based on
 * complementary style relationships (serif + sans-serif, etc.).
 */

export interface FontEntry {
  family: string;
  category: string;
  weights: number[];
  styles: string[];
  importUrl: string;
}

export interface FontPairing {
  heading: FontEntry;
  body: FontEntry;
  reason: string;
}

export interface FontSearchOptions {
  category?: string;
  limit?: number;
}

const FONT_REGISTRY: FontEntry[] = [
  { family: 'Inter', category: 'sans-serif', weights: [400, 500, 600, 700], styles: ['normal'], importUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' },
  { family: 'Roboto', category: 'sans-serif', weights: [300, 400, 500, 700], styles: ['normal', 'italic'], importUrl: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap' },
  { family: 'Open Sans', category: 'sans-serif', weights: [400, 600, 700], styles: ['normal', 'italic'], importUrl: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap' },
  { family: 'Lato', category: 'sans-serif', weights: [300, 400, 700], styles: ['normal', 'italic'], importUrl: 'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap' },
  { family: 'Montserrat', category: 'sans-serif', weights: [400, 500, 600, 700, 800], styles: ['normal'], importUrl: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap' },
  { family: 'Poppins', category: 'sans-serif', weights: [400, 500, 600, 700], styles: ['normal'], importUrl: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap' },
  { family: 'Source Sans 3', category: 'sans-serif', weights: [400, 600, 700], styles: ['normal'], importUrl: 'https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700&display=swap' },
  { family: 'DM Sans', category: 'sans-serif', weights: [400, 500, 700], styles: ['normal'], importUrl: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap' },
  { family: 'Playfair Display', category: 'serif', weights: [400, 500, 600, 700], styles: ['normal', 'italic'], importUrl: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap' },
  { family: 'Merriweather', category: 'serif', weights: [300, 400, 700], styles: ['normal', 'italic'], importUrl: 'https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&display=swap' },
  { family: 'Lora', category: 'serif', weights: [400, 500, 600, 700], styles: ['normal', 'italic'], importUrl: 'https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap' },
  { family: 'Source Serif 4', category: 'serif', weights: [400, 600, 700], styles: ['normal'], importUrl: 'https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600;700&display=swap' },
  { family: 'JetBrains Mono', category: 'monospace', weights: [400, 500, 700], styles: ['normal'], importUrl: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap' },
  { family: 'Fira Code', category: 'monospace', weights: [400, 500, 700], styles: ['normal'], importUrl: 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;700&display=swap' },
  { family: 'Space Mono', category: 'monospace', weights: [400, 700], styles: ['normal'], importUrl: 'https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap' },
  { family: 'Space Grotesk', category: 'sans-serif', weights: [400, 500, 600, 700], styles: ['normal'], importUrl: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap' },
];

const FONT_PAIRINGS: FontPairing[] = [
  { heading: FONT_REGISTRY[8], body: FONT_REGISTRY[0], reason: 'Elegant serif headings with clean sans-serif body for modern editorial style' },
  { heading: FONT_REGISTRY[4], body: FONT_REGISTRY[0], reason: 'Bold geometric headings with neutral body for startup/tech style' },
  { heading: FONT_REGISTRY[15], body: FONT_REGISTRY[0], reason: 'Modern geometric headings with versatile body for contemporary design' },
  { heading: FONT_REGISTRY[8], body: FONT_REGISTRY[3], reason: 'Classic serif headings with humanist body for traditional elegance' },
  { heading: FONT_REGISTRY[5], body: FONT_REGISTRY[2], reason: 'Friendly rounded headings with readable body for approachable design' },
  { heading: FONT_REGISTRY[10], body: FONT_REGISTRY[7], reason: 'Refined serif headings with geometric body for balanced sophistication' },
  { heading: FONT_REGISTRY[4], body: FONT_REGISTRY[1], reason: 'Strong geometric headings with versatile body for professional sites' },
];

/**
 * Searches fonts by name or category.
 */
export function searchFonts(
  query: string,
  options: FontSearchOptions = {}
): FontEntry[] {
  const limit = options.limit ?? 10;
  let results = FONT_REGISTRY;

  if (options.category) {
    const cat = options.category.toLowerCase();
    results = results.filter((f) => f.category === cat);
  }

  if (query && query.trim() !== '') {
    const lower = query.toLowerCase();
    results = results.filter((f) =>
      f.family.toLowerCase().includes(lower) ||
      f.category.includes(lower)
    );
  }

  return results.slice(0, limit);
}

/**
 * Returns font pairing recommendations, optionally filtered.
 */
export function getFontPairings(
  query?: string,
  limit: number = 5
): FontPairing[] {
  if (!query || query.trim() === '') {
    return FONT_PAIRINGS.slice(0, limit);
  }

  const lower = query.toLowerCase();
  const filtered = FONT_PAIRINGS.filter((p) =>
    p.heading.family.toLowerCase().includes(lower) ||
    p.body.family.toLowerCase().includes(lower) ||
    p.reason.toLowerCase().includes(lower)
  );

  return filtered.slice(0, limit);
}

/**
 * Builds a Google Fonts import URL for the given font families.
 */
export function buildFontImportUrl(families: string[]): string {
  const found = families
    .map((f) => FONT_REGISTRY.find(
      (r) => r.family.toLowerCase() === f.toLowerCase()
    ))
    .filter((f): f is FontEntry => f !== undefined);

  if (found.length === 0) {
    return '';
  }

  return found.map((f) => f.importUrl).join('\n');
}

/**
 * Looks up a single font by family name.
 */
export function getFont(family: string): FontEntry | undefined {
  return FONT_REGISTRY.find(
    (f) => f.family.toLowerCase() === family.toLowerCase()
  );
}
